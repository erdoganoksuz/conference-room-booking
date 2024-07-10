import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { IsBefore } from '../../validators/is-before.validator';
import { IsFutureDate } from '../../validators/is-future-date.validatior';
import { IsTimeInterval } from '../../validators/is-interval-valid-validator';

export class ConferenceRoomAvailabilityDto {
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
}
