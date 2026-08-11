import { DiaryController } from './diary.controller';
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DiaryService } from './diary.service';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    DiaryController,
  ],

  providers: [
    DiaryService,
  ],

  exports: [
    DiaryService,
  ],
})
export class DiaryModule {}