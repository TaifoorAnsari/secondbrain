import { Body, Controller, Post, Get, Req, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any) {
    return req.user;
}

@Patch('profile')
@UseGuards(JwtAuthGuard)
updateProfile(
  @Req() req: any,
  @Body() dto: UpdateProfileDto,
) {
  return this.authService.updateProfile(req.user.id, dto);
}

@Patch('change-password')
@UseGuards(JwtAuthGuard)
changePassword(
  @Req() req: any,
  @Body() dto: ChangePasswordDto,
) {
  return this.authService.changePassword(
    req.user.id,
    dto,
  );
}
}