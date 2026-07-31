import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: dto.title,
        content: dto.content,
        pinned: dto.pinned ?? false,
        userId,
      },
    });
  }

  async findAll(userId: string) {
  return this.prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

async findOne(id: string, userId: string) {
  const note = await this.prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!note) {
    throw new NotFoundException('Note not found');
  }

  return note;
}

async update(
  id: string,
  userId: string,
  dto: UpdateNoteDto,
) {
  const note = await this.prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!note) {
    throw new NotFoundException('Note not found');
  }

  return this.prisma.note.update({
    where: {
      id,
    },
    data: {
      ...dto,
    },
  });
}

async remove(id: string, userId: string) {
  const note = await this.prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!note) {
    throw new NotFoundException('Note not found');
  }

  await this.prisma.note.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Note deleted successfully',
  };
}
}