import { Injectable } from '@nestjs/common';
import { CreateShortcutDto } from './dto/create-shortcut.dto';
import { UpdateShortcutDto } from './dto/update-shortcut.dto';
import { PrismaClient } from '@prisma/client';
import { JwtPayload, decodeJwtToken } from 'src/util';

@Injectable()
export class ShortcutService {
  private prisma: PrismaClient;

  constructor() {
    try {
      this.prisma = new PrismaClient();
    } catch (error) {
      console.error('Error initializing PrismaClient:', error);
    }
  }
  async create(token: string, createShortcutDto: CreateShortcutDto) {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    const shortcut = await this.prisma.keyBind.create({
      data: {
        userId,
        ...createShortcutDto,
      },
    });
    return shortcut;
  }

  async findAll(token: string) {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    if (!userId) {
      return []
    }
    const keys = await this.prisma.keyBind.findMany({ where: { userId } });
    const data = keys.map((key) => {
      return {
        id: key.id,
        combination: key.combination,
        action: key.action,
      };
    });
    return data;
  }

  async update(
    token: string,
    id: string,
    updateShortcutDto: UpdateShortcutDto,
  ) {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    const key = await this.prisma.keyBind.update({
      where: { id },
      data: { ...updateShortcutDto },
    });
    return key;
  }

  async remove(token: string, id: string) {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    const key = await this.prisma.keyBind.delete({ where: { id } });
    return key;
  }
}
