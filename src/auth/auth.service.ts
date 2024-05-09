import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { JwtPayload, decodeJwtToken, generateJwtToken } from 'src/util';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    try {
      this.prisma = new PrismaClient();
    } catch (error) {
      console.error('Error initializing PrismaClient:', error);
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      return { token: null, message: 'Invalid User Credentials' };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { token: null, message: 'Invalid User Credentials' };
    }
    const payload: JwtPayload = { userId: user.id };
    const token = generateJwtToken(payload);
    return { token, message: 'Success' };
  }

  async signUp(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
    }
  }

  async signOut(token: string): Promise<string> {
    const payload = decodeJwtToken(token);
    if (!payload) {
      return 'Invalid token';
    }
    const userId = payload.userId;
    return 'OK';
  }
}
