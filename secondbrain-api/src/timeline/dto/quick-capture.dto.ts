import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuickCaptureDto {
  @IsString()
  @IsNotEmpty()
  input!: string;

  @IsOptional()
  @IsString()
  entityId?: string;
}