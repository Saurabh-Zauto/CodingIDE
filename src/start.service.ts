import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StartService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createAdmin() {
    const user = await this.prisma.user.findMany();
    if (user.length !== 0) return;
    const email = 'admin@gmail.com';
    const password = 'admin';
    const hashed_password = await bcrypt.hash(password, 10);
    const admin = await this.prisma.user.create({
      data: {
        email,
        password: hashed_password,
      },
    });
  }
}
