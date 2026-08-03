import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  // Get User Profile
  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Update User Profile
  async updateProfile(id: string, data: any) {

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        username: data.username,
        phone: data.phone,
        bio: data.bio,
        avatar: data.avatar
      }
    });

  }

}