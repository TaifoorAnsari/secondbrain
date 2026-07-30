import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

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
}