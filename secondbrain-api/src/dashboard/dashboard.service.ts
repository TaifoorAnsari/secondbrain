import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
  return {
    stats: {
      totalNotes: 0,
      pinnedNotes: 0,
      categories: 0,
    },
    recentNotes: [],
    userId,
  };
}
}