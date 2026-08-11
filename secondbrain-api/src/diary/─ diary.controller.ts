import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { DiaryService } from './diary.service';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diary')
export class DiaryController {

  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  // ==========================================
  // CREATE
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
  // GET ALL
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
  // GET ONE
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
  // UPDATE
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
  // DELETE
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