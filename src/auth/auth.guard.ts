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

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
       
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