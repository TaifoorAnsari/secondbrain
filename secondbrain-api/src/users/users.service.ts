import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  // ==========================================
  // GET USER PROFILE
  // ==========================================

  async getProfile(
    id: string,
  ) {

    const user =
      await this.prisma.user.findUnique({

        where: {
          id,
        },

        select: {

          id: true,

          fullName: true,

          username: true,

          email: true,

          phone: true,

          bio: true,

          avatar: true,

          createdAt: true,

        },

      });


    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }


    return user;

  }


  // ==========================================
  // UPDATE USER PROFILE
  // ==========================================

  async updateProfile(
    id: string,
    data: any,
  ) {

    const user =
      await this.prisma.user.findUnique({

        where: {
          id,
        },

      });


    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }


    return this.prisma.user.update({

      where: {
        id,
      },

      data: {

        fullName:
          data.fullName,

        username:
          data.username,

        phone:
          data.phone,

        bio:
          data.bio,

      },

    });

  }


  // ==========================================
  // UPDATE PROFILE AVATAR
  // ==========================================

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ) {

    // ----------------------------------------
    // CHECK USER
    // ----------------------------------------

    const user =
      await this.prisma.user.findUnique({

        where: {
          id,
        },

      });


    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }


    // ----------------------------------------
    // CHECK FILE
    // ----------------------------------------

    if (!file) {

      throw new NotFoundException(
        'Profile photo is required',
      );

    }


    // ----------------------------------------
    // CREATE AVATAR URL
    // ----------------------------------------

    const avatarUrl =
      `/uploads/avatars/${file.filename}`;


    // ----------------------------------------
    // SAVE AVATAR
    // ----------------------------------------

    return this.prisma.user.update({

      where: {
        id,
      },

      data: {

        avatar:
          avatarUrl,

      },

      select: {

        id: true,

        fullName: true,

        username: true,

        email: true,

        phone: true,

        bio: true,

        avatar: true,

        createdAt: true,

      },

    });

  }

}