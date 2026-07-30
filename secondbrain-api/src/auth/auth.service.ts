import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

async signup(signupDto: SignupDto) {
  const existingUser = await this.prisma.user.findUnique({
    where: {
      email: signupDto.email,
    },
  });

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(signupDto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      fullName: signupDto.fullName,
      email: signupDto.email,
      password: hashedPassword,
    },
  });

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  return {
    message: 'User created successfully',

    accessToken,

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

async login(loginDto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: {
      email: loginDto.email,
    },
  });

  if (!user) {
    throw new BadRequestException('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new BadRequestException('Invalid email or password');
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  return {
    message: 'Login successful',
    accessToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  };
}

async updateProfile(userId: string, dto: UpdateProfileDto) {
  const user = await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fullName: dto.fullName,
    },
  });

  return {
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

async changePassword(
  userId: string,
  dto: ChangePasswordDto,
) {

  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isPasswordValid = await bcrypt.compare(
    dto.currentPassword,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Current password is incorrect',
    );
  }

  if (dto.newPassword !== dto.confirmPassword) {
    throw new BadRequestException(
      'New passwords do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    dto.newPassword,
    10,
  );

  await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password changed successfully',
  };
}

}