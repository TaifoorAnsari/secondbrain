import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // CREATE
  // ==========================================

  async create(
    userId: string,
    dto: CreateDiaryDto,
  ) {
    return this.prisma.diaryEntry.create({
      data: {
        title: dto.title,

        content: dto.content,

        mood: dto.mood as any,

        entryDate: new Date(
          dto.entryDate,
        ),

        userId,
      },
    });
  }


  // ==========================================
  // FIND ALL
  // ==========================================

  async findAll(
    userId: string,
  ) {
    return this.prisma.diaryEntry.findMany({
      where: {
        userId,
      },

      orderBy: {
        entryDate: 'desc',
      },
    });
  }


  // ==========================================
  // FIND ONE
  // ==========================================

  async findOne(
    id: string,
    userId: string,
  ) {
    const diaryEntry =
      await this.prisma.diaryEntry.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!diaryEntry) {
      throw new NotFoundException(
        'Diary entry not found',
      );
    }

    return diaryEntry;
  }


  // ==========================================
  // UPDATE
  // ==========================================

  async update(
    id: string,
    userId: string,
    dto: UpdateDiaryDto,
  ) {
    await this.findOne(
      id,
      userId,
    );

    return this.prisma.diaryEntry.update({
      where: {
        id,
      },

      data: {
        ...(dto.title !== undefined && {
          title: dto.title,
        }),

        ...(dto.content !== undefined && {
          content: dto.content,
        }),

        ...(dto.mood !== undefined && {
          mood: dto.mood as any,
        }),

        ...(dto.entryDate !== undefined && {
          entryDate: new Date(
            dto.entryDate,
          ),
        }),
      },
    });
  }


  // ==========================================
  // DELETE
  // ==========================================

  async remove(
    id: string,
    userId: string,
  ) {
    await this.findOne(
      id,
      userId,
    );

    return this.prisma.diaryEntry.delete({
      where: {
        id,
      },
    });
  }

}