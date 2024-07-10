import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Max, Min } from 'class-validator';
import { IsBefore } from '../../validators/is-before.validator';
import { IsFutureDate } from '../../validators/is-future-date.validatior';
import { IsTimeInterval } from '../../validators/is-interval-valid-validator';

export class CreateConferenceRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsFutureDate()
  @IsTimeInterval('endTime')
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsBefore('startTime')
  endTime: string;

  @ApiProperty()
  @Min(1)
  @Max(20)
  numberOfPeople: number;
}
