import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ConferenceRoomService } from './conference-room.service';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';
import { ApiTags } from '@nestjs/swagger';
import { ConferenceRoomAvailabilityDto } from './dto/conference-room-availability.dto';
import { ConferenceRoom } from './entities/conference-room.entity';

@ApiTags('Conference Room')
@Controller('conference-room')
export class ConferenceRoomController {
  constructor(private readonly conferenceRoomService: ConferenceRoomService) {}

  @Post('book')
  bookRoom(
    @Body(ValidationPipe) bookingDto: CreateConferenceRoomDto,
  ): Promise<string> {
    return this.conferenceRoomService.bookRoom(bookingDto);
  }

  @Get('availability')
  async checkAvailability(
    @Query(ValidationPipe) availabilityDto: ConferenceRoomAvailabilityDto,
  ): Promise<ConferenceRoom[]> {
    const res =
      await this.conferenceRoomService.checkAvailability(availabilityDto);
    return res;
  }
}
