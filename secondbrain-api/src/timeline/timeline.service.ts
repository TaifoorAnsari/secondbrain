import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';


@Injectable()
export class TimelineService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // CREATE TIMELINE
  // ==========================================

  async create(
    userId: string,
    dto: CreateTimelineDto,
  ) {

    return this.prisma.timeline.create({

      data: {

        title: dto.title,

        description: dto.description,

        eventDate: new Date(
          dto.eventDate,
        ),

        // Calendar
        showOnCalendar: dto.showOnCalendar,

        userId,

        entities: {

          create: dto.entityIds.map(
            entityId => ({

              entityId,

            }),
          ),

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


  // ==========================================
  // GET ALL TIMELINES
  // ==========================================

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


  // ==========================================
  // GET ONE TIMELINE
  // ==========================================

  async findOne(
    id: string,
    userId: string,
  ) {

    const timeline =
      await this.prisma.timeline.findFirst({

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


  // ==========================================
  // UPDATE TIMELINE
  // ==========================================

  async update(
    id: string,
    userId: string,
    dto: UpdateTimelineDto,
  ) {

    await this.findOne(
      id,
      userId,
    );

    // Remove existing entity links

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

        // Calendar
        showOnCalendar:
          dto.showOnCalendar,

        entities: dto.entityIds
          ? {

              create: dto.entityIds.map(
                entityId => ({

                  entityId,

                }),
              ),

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

async quickCapture(
  userId: string,
  input: string,
  entityId?: string,
) {
  const description = input.trim();

  if (!description) {
    throw new Error('Message cannot be empty');
  }

  return this.prisma.$transaction(async (tx) => {

    if (!entityId) {
      throw new Error('Entity must be selected');
    }

    const entity = await tx.entity.findFirst({
      where: {
        id: entityId,
        userId,
      },
    });

    if (!entity) {
      throw new Error('Entity not found');
    }

    const timeline = await tx.timeline.create({
      data: {
        title: entity.name,
        description,
        eventDate: new Date(),
        showOnCalendar: false,
        userId,

        entities: {
          create: {
            entityId: entity.id,
          },
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

    return {
      entity,
      timeline,
    };
  });
}

  // ==========================================
  // DELETE TIMELINE
  // ==========================================

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