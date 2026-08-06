import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@Injectable()
export class TimelineService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreateTimelineDto,
  ) {

    return this.prisma.timeline.create({

      data: {

        title: dto.title,

        description: dto.description,

        eventDate: new Date(dto.eventDate),

        userId,

        entities: {

          create: dto.entityIds.map(entityId => ({

            entityId,

          })),

        },

      },

      include: {

        entities: {

          include: {

            entity: true,

          },

        },

      },

    });

  }

  async findAll(
    userId: string,
  ) {

    return this.prisma.timeline.findMany({

      where: {

        userId,

      },

      include: {

        entities: {

          include: {

            entity: true,

          },

        },

      },

      orderBy: {

        eventDate: 'desc',

      },

    });

  }

  async findOne(
    id: string,
    userId: string,
  ) {

    const timeline = await this.prisma.timeline.findFirst({

      where: {

        id,

        userId,

      },

      include: {

        entities: {

          include: {

            entity: true,

          },

        },

      },

    });

    if (!timeline) {

      throw new NotFoundException(
        'Timeline not found',
      );

    }

    return timeline;

  }

  async update(
    id: string,
    userId: string,
    dto: UpdateTimelineDto,
  ) {

    await this.findOne(
      id,
      userId,
    );

    await this.prisma.timelineEntity.deleteMany({

      where: {

        timelineId: id,

      },

    });

    return this.prisma.timeline.update({

      where: {

        id,

      },

      data: {

        title: dto.title,

        description: dto.description,

        eventDate: dto.eventDate
          ? new Date(dto.eventDate)
          : undefined,

        entities: dto.entityIds
          ? {

              create: dto.entityIds.map(entityId => ({

                entityId,

              })),

            }
          : undefined,

      },

      include: {

        entities: {

          include: {

            entity: true,

          },

        },

      },

    });

  }

  async remove(
    id: string,
    userId: string,
  ) {

    await this.findOne(
      id,
      userId,
    );

    return this.prisma.timeline.delete({

      where: {

        id,

      },

    });

  }

}