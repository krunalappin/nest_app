import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sockets } from './entity/socket.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class SocketService {
    
    constructor(
        @InjectRepository(Sockets) private readonly socketRepository: Repository<Sockets>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async create(client: any) {
        const token = client.handshake.headers.authorization;
        
            // const payload = await this.jwtService.verify(token , {
            //     secret : jwtConstants.secret
            // });
            // console.log(':: ========= :: > payload < :: ========= :: ', payload);

            // let socketSession = await this.socketRepository.findOneBy({ user : payload.id});
            // console.log(socketSession.user);
            
            // if(!socketSession.user === payload.sub || null) {
            //     socketSession = new Sockets();
            //     socketSession.user = payload.sub;
            // }
            // socketSession.socketId = client.id;

            // return await this.socketRepository.save(socketSession);
    }
}
