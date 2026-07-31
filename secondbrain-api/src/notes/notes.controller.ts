import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(req.user.id, dto);
  }

  @Get()
   findAll(@Req() req: any) {
  return this.notesService.findAll(req.user.id);
}

@Get(':id')
findOne(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.notesService.findOne(id, req.user.id);
}

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