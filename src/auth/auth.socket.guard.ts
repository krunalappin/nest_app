import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';


@Injectable()
export class SocketAuthGuard extends IoAdapter {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new WsException('Token not provided');
    }

    const userId = await this.validateToken(token);
    client.data.userId = userId;
    return true;
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      return payload.sub;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const token = client.handshake.headers.authorization;
    return token;
  }
}
