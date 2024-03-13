import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { SessionService } from 'src/session/session.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/constants/message-constants';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
          
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token && token === undefined) {
            throw new UnauthorizedException('Token not found');
        }

        const validToken = await this.sessionService.findByToken(token);
        if(!(token === validToken?.access_token)) {
            throw new UnauthorizedException('Invalid Token');
        }
        
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            request['user'] = payload;
            
        } catch {
            throw new UnauthorizedException('User Unauthorized from Guard');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }


    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies.token
    }

}