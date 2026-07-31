import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

async getDashboard(userId: string) {
  const totalNotes = await this.prisma.note.count({
    where: {
      userId,
    },
  });

  const pinnedNotes = await this.prisma.note.count({
    where: {
      userId,
      pinned: true,
    },
  });

  const recentNotes = await this.prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 5,
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
      pinned: true,
    },
  });

  return {
    stats: {
      totalNotes,
      pinnedNotes,
      categories: 0, // We'll replace this after we build Categories
    },
    recentNotes,
  };
}
}