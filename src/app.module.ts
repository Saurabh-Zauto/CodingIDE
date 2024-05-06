import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StartService } from './start.service';
import { FileModule } from './file/file.module';
import { CodeModule } from './code/code.module';
import { ShortcutModule } from './shortcut/shortcut.module';

@Module({
  imports: [AuthModule, FileModule, CodeModule, ShortcutModule],
  controllers: [AppController],
  providers: [AppService, StartService],
})
export class AppModule {}
