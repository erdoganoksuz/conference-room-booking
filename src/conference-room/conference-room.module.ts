import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConferenceRoomController } from './conference-room.controller';
import { ConferenceRoomService } from './conference-room.service';
import { Booking, BookingSchema } from './schema/booking.schema';
import { ConferenceRoom } from './entities/conference-room.entity';
import { ConferenceRoomSchema } from './schema/conference-room.schema';
import { SeedService } from './seed.service';
import {
  MaintenanceTime,
  MaintenanceTimeSchema,
} from './schema/maintenenace-time.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConferenceRoom.name, schema: ConferenceRoomSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: MaintenanceTime.name, schema: MaintenanceTimeSchema },
    ]),
  ],
  controllers: [ConferenceRoomController],
  providers: [ConferenceRoomService, SeedService, ConferenceRoom],
})
export class ConferenceRoomModule {}
