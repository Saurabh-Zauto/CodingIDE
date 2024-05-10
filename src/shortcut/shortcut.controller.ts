import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IRequest } from 'src/model/IRequest';
import { CreateShortcutDto } from './dto/create-shortcut.dto';
import { UpdateShortcutDto } from './dto/update-shortcut.dto';
import { ShortcutService } from './shortcut.service';

@Controller('shortcut')
@UseGuards(AuthGuard)
export class ShortcutController {
  constructor(private readonly shortcutService: ShortcutService) { }

  @Post()
  async create(@Req() request: IRequest, @Body() createShortcutDto: CreateShortcutDto) {
    if (request.token) {
      return await this.shortcutService.create(request.token, createShortcutDto);
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }

  @Get()
  async findAll(@Req() request: IRequest) {
    if (request.token) {
      return await this.shortcutService.findAll(request.token);
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }


  @Put(':id')
  update(
    @Req() request: IRequest,
    @Param('id') id: string,
    @Body() updateShortcutDto: UpdateShortcutDto,
  ) {
    if (request.token) {
      return this.shortcutService.update(request.token, id, updateShortcutDto);
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
  @Delete(':id')
  remove(@Req() request: IRequest, @Param('id') id: string) {
    if (request.token) {
      return this.shortcutService.remove(request.token, id);
    } else {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
