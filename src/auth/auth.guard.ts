import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/constants/message-constants';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
        private readonly userService: UserService
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
        if (!(token === validToken?.access_token)) {
            throw new UnauthorizedException('Invalid Token');
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            const userCheck = await this.userService.getUserById(payload.sub);
            if (userCheck.lastDeactivatedAt >= new Date()) {
                throw new UnauthorizedException(`You have been deactivated. You can login after ${userCheck.lastDeactivatedAt}`);
            }
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
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