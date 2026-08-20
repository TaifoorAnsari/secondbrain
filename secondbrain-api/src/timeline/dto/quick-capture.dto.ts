import { IsNotEmpty, IsString } from 'class-validator';

export class QuickCaptureDto {
  @IsString()
  @IsNotEmpty()
  input!: string;
}