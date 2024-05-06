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
  async create(createShortcutDto: CreateShortcutDto) {
    const shortcut = await this.prisma.keyBind.create({
      data: {
        ...createShortcutDto,
      },
    });
    return shortcut;
  }

  async findAll() {
    const keys = await this.prisma.keyBind.findMany();
    const data = keys.map((key) => {
      return {
        combination: key.combination,
        action: key.action,
      };
    });
    console.log(data);

    return data;
  }

  // async update(
  //   token: string,
  //   id: string,
  //   updateShortcutDto: UpdateShortcutDto,
  // ) {
  //   const { userId } = decodeJwtToken(token) as JwtPayload;
  //   const key = await this.prisma.keyBind.update({
  //     where: { id },
  //     data: { ...updateShortcutDto },
  //   });
  //   return key;
  // }

  // async remove(token: string, id: string) {
  //   const { userId } = decodeJwtToken(token) as JwtPayload;
  //   const key = await this.prisma.keyBind.delete({ where: { id } });
  //   return key;
  // }
}
