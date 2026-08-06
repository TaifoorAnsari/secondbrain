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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { TimelineService } from './timeline.service';

import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@Controller('timeline')
@UseGuards(JwtAuthGuard)
export class TimelineController {

  constructor(
    private readonly timelineService: TimelineService,
  ) {}

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateTimelineDto,
  ) {

    return this.timelineService.create(
      req.user.id,
      dto,
    );

  }

  @Get()
  findAll(
    @Req() req: any,
  ) {

    return this.timelineService.findAll(
      req.user.id,
    );

  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {

    return this.timelineService.findOne(
      id,
      req.user.id,
    );

  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateTimelineDto,
  ) {

    return this.timelineService.update(
      id,
      req.user.id,
      dto,
    );

  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {

    return this.timelineService.remove(
      id,
      req.user.id,
    );

  }

}