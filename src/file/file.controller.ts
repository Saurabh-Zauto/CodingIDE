import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { IRequest } from 'src/model/IRequest';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getFiles(@Req() request: IRequest) {
    if (request.token) {
      return await this.fileService.getFiles(request.token);
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }

  @Post()
  async uploadFile(
    @Body('projectName') projectName: string,
    @Body('fileName') fileName: string,
    @Body('code') code: string,
    @Body('token') token: string,
  ): Promise<void> {
    try {
      await this.fileService.saveFile(projectName, fileName, code, token);
    } catch (e) {
      console.log(e);
    }
  }

  @Put(':id')
  async updateProjectName(
    @Param('id') id: string,
    @Body('projectName') projectName: string,
  ): Promise<void> {
    await this.fileService.updateProjectName(id, projectName);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileService.deleteFile(id);
  }
}
