import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserSession } from './session.entity';
import { User } from 'src/user/entity/user.entity';
import { UserSessionDto } from './create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  async createOrUpdateSession(user: User, access_token: string , ip: string): Promise<UserSession> {
    let session = await this.sessionRepository.findOneBy({ user });

    if (!session) {
      session = new UserSession();
      session.user = user;
    }
    session.loginTime = new Date();
    session.access_token = access_token;
    session.ip = ip;
    
    try {
      return await this.sessionRepository.save(session);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByToken(token: string): Promise<UserSession> {
    const session = await this.sessionRepository.findOneBy({ access_token: token });
    return session;
  }
}


