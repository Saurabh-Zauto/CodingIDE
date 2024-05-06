import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtPayload, decodeJwtToken } from 'src/util';

@Injectable()
export class FileService {
  private prisma: PrismaClient;

  constructor() {
    try {
      this.prisma = new PrismaClient();
    } catch (error) {
      console.error('Error initializing PrismaClient:', error);
    }
  }

  async saveFile(
    projectName: string,
    fileName: string,
    code: string,
    token: string,
  ): Promise<void> {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    const project = await this.prisma.file.findFirst({
      where: { projectName, userId },
    });
    if (project) {
      await this.prisma.file.updateMany({
        where: {
          projectName,
          userId,
        },
        data: { fileName, code },
      });
      return;
    }
    await this.prisma.file.create({
      data: { projectName, fileName, code, userId },
    });
  }

  async getFiles(token: string) {
    const { userId } = decodeJwtToken(token) as JwtPayload;
    return await this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProjectName(id: string, projectName: string) {
    await this.prisma.file.update({
      where: { id },
      data: { projectName },
    });
  }

  async deleteFile(id: string) {
    await this.prisma.file.delete({
      where: { id },
    });
  }
}
