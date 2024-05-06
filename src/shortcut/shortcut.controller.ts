import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ShortcutService } from './shortcut.service';
import { CreateShortcutDto } from './dto/create-shortcut.dto';
import { UpdateShortcutDto } from './dto/update-shortcut.dto';
import { IRequest } from 'src/model/IRequest';

@Controller('shortcut')
export class ShortcutController {
  constructor(private readonly shortcutService: ShortcutService) {}

  @Post()
  async create(@Body() createShortcutDto: CreateShortcutDto) {
    return await this.shortcutService.create(createShortcutDto);
  }

  @Get()
  async findAll(@Req() request: IRequest) {
      return await this.shortcutService.findAll();
    
  }

  // @Patch(':id')
  // update(
  //   @Req() request: IRequest,
  //   @Param('id') id: string,
  //   @Body() updateShortcutDto: UpdateShortcutDto,
  // ) {
  //   if (request.token) {
  //     return this.shortcutService.update(request.token, id, updateShortcutDto);
  //   } else {
  //     throw new UnauthorizedException('Unauthorized access');
  //   }
  // }
  // @Delete(':id')
  // remove(@Req() request: IRequest, @Param('id') id: string) {
  //   if (request.token) {
  //     return this.shortcutService.remove(request.token, id);
  //   } else {
  //     throw new UnauthorizedException('Unauthorized access');
  //   }
  // }
}
