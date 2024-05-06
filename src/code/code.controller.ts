import { Body, Controller, Post } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  async runCode(@Body() request: any) {
    const { code, language, input, fileName } = request;
    return await this.codeService.runCode(code, language, input, fileName);
  }
}
