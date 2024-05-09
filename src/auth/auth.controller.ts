import { Body, Controller, HttpStatus, Post, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('signin')
  async signIn(@Body() body: AuthDto) {
    return await this.authService.signIn(body.email, body.password);
  }

  @Post('signup')
  async signUp(@Body() body: AuthDto) {
    const token = await this.authService.signUp(body.email, body.password);
    if (!token) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      };
    }
    return token;
  }


  @Delete('logout')
  async logout(@Body() body) {
    const { token } = body;
    if (!token) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Token is missing',
      };
    }
    const result = await this.authService.signOut(token);
    if (result === 'OK') {
      return { statusCode: HttpStatus.OK, message: 'Logged out successfully' };
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' };
  }
}
