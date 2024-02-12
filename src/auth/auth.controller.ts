import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: Record<string, any>, @Res() response: Response) {
    const { access_token, user } = await this.authService.signIn(body.email, body.password, response);

    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
    });

    response.status(200).json({
      user,
      access_token
    })
  }
  
}