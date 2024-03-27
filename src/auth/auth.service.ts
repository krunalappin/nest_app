import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) { }

    async signIn(email: string, password: string, response: Response): Promise<{ access_token: string, user: User }> {
        const user = await this.userService.findOneBy(email);
        if (!user) {
            throw new UnauthorizedException('User Invalid Credentials');
        }
        const isMatch: boolean = await compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid Password');
        }
        if (user.lastDeactivatedAt >= new Date()) {
            const timeDiff  = Math.abs(new Date().getTime() - user.lastDeactivatedAt.getTime());
            const [days, hours, minutes] = [Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), Math.ceil((timeDiff / (1000 * 60 * 60)) % 24), Math.ceil((timeDiff / (1000 * 60)) % 60)];
            throw new UnauthorizedException(`You have been deactivated. You can login after ${days} days, ${hours} hours, and ${minutes} minutes.`);
        }
        const ip = response.get('x-forwarded-for') || response.connection.remoteAddress;
        const payload = { username: user.username, sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        await this.sessionService.createOrUpdateSession(user, access_token, ip);
        return { user, access_token }
    }

    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token);
    }

}

