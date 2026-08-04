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

import { EntitiesService } from './entities.service';

import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Controller('entities')
@UseGuards(JwtAuthGuard)
export class EntitiesController {
  constructor(
    private readonly entitiesService: EntitiesService,
  ) {}

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateEntityDto,
  ) {
    return this.entitiesService.create(
      req.user.id,
      dto,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.entitiesService.findAll(
      req.user.id,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.entitiesService.findOne(
      id,
      req.user.id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateEntityDto,
  ) {
    return this.entitiesService.update(
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
    return this.entitiesService.remove(
      id,
      req.user.id,
    );
  }
}