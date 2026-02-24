import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: { id: number; email: string; role: string } }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    const DUMMY_BCRYPT_HASH =
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8eG1JpN96CB2mu.6Zf3uZ5qX6ChK6m'; // valid format


    if (!user) {
      // Use same timing as successful login to prevent timing attacks
      await bcrypt.compare(loginDto.password, DUMMY_BCRYPT_HASH);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async generateJwtCookie(payload: JwtPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  /**
   * Request password reset by email. Only PARENT accounts get reset flow.
   * ADMIN: return message to contact administrator.
   * PARENT: TODO send reset email; return generic success.
   * Not found: return same generic success (no user enumeration).
   */
  async requestForgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim() },
      select: { role: true },
    });

    const genericMessage =
      'Jika email terdaftar sebagai orang tua/wali, Anda akan menerima instruksi di email Anda.';

    if (!user) {
      return { message: genericMessage };
    }

    if (user.role === 'ADMIN') {
      return {
        message:
          'Untuk reset kata sandi akun admin, hubungi administrator.',
      };
    }

    // PARENT: TODO — generate reset token, store it, send email with reset link
    // await this.sendPasswordResetEmail(email, token);
    return { message: genericMessage };
  }

  /** Change password for logged-in user (e.g. parent). Verifies current password then updates. */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Kata sandi saat ini salah.');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }
}
