import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { SessionService } from "./session.service";
import { UserSessionDto } from "./create-session.dto";
import { UserSession } from "./session.entity";

@Controller()
export class SessionController {

    constructor(
        private readonly sessionService: SessionService
    ) { }

   @Post()
   async createSession(@Body() userSessionDto: UserSessionDto) {
       const user = await this.sessionService.createOrUpdateSession(userSessionDto.user, userSessionDto.access_token , userSessionDto.ip);
       return user;
   }

   @Get(':token')
  async findByToken(@Param('token') token: string) {
    const session = await this.sessionService.findByToken(token);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }
}