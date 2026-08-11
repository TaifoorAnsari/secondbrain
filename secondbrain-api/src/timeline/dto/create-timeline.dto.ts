import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTimelineDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @MaxLength(5000)
  description!: string;

  @IsDateString()
  eventDate!: string;

  @IsArray()
  entityIds!: string[];

  @IsBoolean()
  showOnCalendar!: boolean;

}