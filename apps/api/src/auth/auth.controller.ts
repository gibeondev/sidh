import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    const payload: JwtPayload = {
      sub: result.user.id,
      email: result.user.email,
      role: result.user.role as 'ADMIN' | 'PARENT',
    };

    const token = await this.authService.generateJwtCookie(payload);

    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    };
  
    res.cookie('access_token', token, {
      ...cookieOptions,
      maxAge: this.getCookieMaxAge(),
    });
  
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
  
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });
  
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() user: JwtPayload) {
    const dbUser = await this.authService.validateUser(user.sub);
    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
  }

  private getCookieMaxAge(): number {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    // Parse common formats: '7d', '24h', '30m', etc.
    if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.slice(0, -1), 10);
      return days * 24 * 60 * 60 * 1000;
    }
    if (expiresIn.endsWith('h')) {
      const hours = parseInt(expiresIn.slice(0, -1), 10);
      return hours * 60 * 60 * 1000;
    }
    if (expiresIn.endsWith('m')) {
      const minutes = parseInt(expiresIn.slice(0, -1), 10);
      return minutes * 60 * 1000;
    }
    
    // Default to 7 days
    return 7 * 24 * 60 * 60 * 1000;
  }
}
