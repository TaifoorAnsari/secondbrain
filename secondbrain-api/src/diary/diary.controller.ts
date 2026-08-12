import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diary')
@UseGuards(AuthGuard('jwt'))
export class DiaryController {

  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  // ==========================================
  // CREATE DIARY
  // ==========================================

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateDiaryDto,
  ) {
    return this.diaryService.create(
      req.user.id,
      dto,
    );
  }

  // ==========================================
  // GET ALL DIARIES
  // ==========================================

  @Get()
  findAll(
    @Req() req: any,
  ) {
    return this.diaryService.findAll(
      req.user.id,
    );
  }

  // ==========================================
  // GET ONE DIARY
  // ==========================================

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.diaryService.findOne(
      id,
      req.user.id,
    );
  }

  // ==========================================
  // UPDATE DIARY
  // ==========================================

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(
      id,
      req.user.id,
      dto,
    );
  }

  // ==========================================
  // DELETE DIARY
  // ==========================================

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.diaryService.remove(
      id,
      req.user.id,
    );
  }
}