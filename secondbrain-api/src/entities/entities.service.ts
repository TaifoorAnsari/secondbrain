import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Injectable()
export class EntitiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEntityDto) {
    return this.prisma.entity.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        avatar: dto.avatar,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.entity.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateEntityDto,
  ) {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return this.prisma.entity.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string, userId: string) {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    await this.prisma.entity.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Entity deleted successfully',
    };
  }
}