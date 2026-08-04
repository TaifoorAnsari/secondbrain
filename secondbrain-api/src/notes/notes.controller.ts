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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // ==============================
  // CREATE NOTE
  // POST /notes
  // ==============================

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(req.user.id, dto);
  }

  // ==============================
  // GET ALL NOTES
  // GET /notes
  // ==============================

  @Get()
  findAll(@Req() req: any) {
    return this.notesService.findAll(req.user.id);
  }

  // ==============================
  // GET SINGLE NOTE
  // GET /notes/:id
  // ==============================

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notesService.findOne(
      id,
      req.user.id,
    );
  }

  // ==============================
  // UPDATE NOTE
  // PATCH /notes/:id
  // ==============================

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(
      id,
      req.user.id,
      dto,
    );
  }

  // ==============================
  // DELETE NOTE
  // DELETE /notes/:id
  // ==============================

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notesService.remove(
      id,
      req.user.id,
    );
  }
}