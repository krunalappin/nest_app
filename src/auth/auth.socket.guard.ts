import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { jwtConstants } from './constants';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization;
    console.log(':: ========= :: > token < :: ========= :: ', token);    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret : jwtConstants.secret
            }
        )
        client['user'] = payload; 

    } catch (error) {
        throw new UnauthorizedException('User Unauthorized from Guard');
    }
    

    return true;
  }
}
