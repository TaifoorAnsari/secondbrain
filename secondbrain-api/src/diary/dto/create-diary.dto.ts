import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export enum DiaryMood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  EXCITED = 'EXCITED',
  CALM = 'CALM',
  ANGRY = 'ANGRY',
  ANXIOUS = 'ANXIOUS',
  GRATEFUL = 'GRATEFUL',
  NEUTRAL = 'NEUTRAL',
}

export class CreateDiaryDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content!: string;

  @IsEnum(DiaryMood)
  mood!: DiaryMood;

  @IsDateString()
  entryDate!: string;
}