import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  diskStorage,
} from 'multer';

import {
  extname,
} from 'path';

import { UsersService } from './users.service';


@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}


  // ==========================================
  // GET PROFILE
  // ==========================================

  @Get(':id')
  getProfile(
    @Param('id') id: string,
  ) {

    return this.usersService.getProfile(id);

  }


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  @Put(':id')
  updateProfile(
    @Param('id') id: string,

    @Body() body: any,
  ) {

    return this.usersService.updateProfile(
      id,
      body,
    );

  }


  // ==========================================
  // UPLOAD PROFILE PHOTO
  // ==========================================

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      {
        storage: diskStorage({

          destination:
            './uploads/avatars',

          filename: (
            req,
            file,
            callback,
          ) => {

            const uniqueName =
              `${Date.now()}-${Math.round(
                Math.random() * 1e9,
              )}${extname(
                file.originalname,
              )}`;

            callback(
              null,
              uniqueName,
            );

          },

        }),

        fileFilter: (
          req,
          file,
          callback,
        ) => {

          const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
          ];

          if (
            allowedTypes.includes(
              file.mimetype,
            )
          ) {

            callback(
              null,
              true,
            );

          } else {

            callback(
              new Error(
                'Only JPG, PNG and WEBP images are allowed',
              ),
              false,
            );

          }

        },

        limits: {
          fileSize:
            5 * 1024 * 1024,
        },

      },
    ),
  )
  uploadAvatar(
    @Param('id') id: string,

    @UploadedFile()
    file: Express.Multer.File,
  ) {

    return this.usersService.updateAvatar(
      id,
      file,
    );

  }

}