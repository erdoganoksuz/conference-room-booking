import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import {
  ConferenceRoom,
  ConferenceRoomDocument,
} from './schema/conference-room.schema';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';
import { ConferenceRoomAvailabilityDto } from './dto/conference-room-availability.dto';
import {
  MaintenanceTime,
  MaintenanceTimeDocument,
} from './schema/maintenenace-time.schema';

@Injectable()
export class ConferenceRoomService {
  constructor(
    @InjectModel(ConferenceRoom.name)
    private conferenceRoomModel: Model<ConferenceRoomDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(MaintenanceTime.name)
    private maintenanceTimeModel: Model<MaintenanceTimeDocument>,
  ) {}

  async bookRoom(bookingDto: CreateConferenceRoomDto): Promise<string> {
    const { startTime, endTime, numberOfPeople } = bookingDto;

    if (await this.isMaintenanceTime(startTime, endTime)) {
      return 'Booking cannot be done in maintenance times';
    }

    const availableRoom = await this.getAvailableRoom(
      startTime,
      endTime,
      numberOfPeople,
    );

    if (!availableRoom) {
      return 'No available rooms';
    }

    await this.bookingModel.create({
      room: availableRoom._id,
      startTime,
      endTime,
      numberOfPeople,
    });

    return `Room ${availableRoom.name} booked successfully for ${bookingDto.startTime} to ${bookingDto.endTime}`;
  }

  async checkAvailability(
    availabilityDto: ConferenceRoomAvailabilityDto,
  ): Promise<ConferenceRoom[]> {
    const { startTime, endTime } = availabilityDto;

    if (await this.isMaintenanceTime(startTime, endTime)) {
      return [];
    }

    const rooms = await this.conferenceRoomModel.find();

    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        const isAvailable = await this.isRoomAvailable(
          room,
          startTime,
          endTime,
        );
        return isAvailable ? room : null;
      }),
    );
    return availableRooms.filter((room) => room);
  }

  private async getAvailableRoom(
    startTime: string,
    endTime: string,
    numberOfPeople: number,
  ): Promise<ConferenceRoomDocument> {
    const rooms = await this.conferenceRoomModel
      .find({ capacity: { $gte: numberOfPeople } })
      .sort({ capacity: 1 });
    for (const room of rooms) {
      if (await this.isRoomAvailable(room, startTime, endTime)) {
        return room;
      }
    }
    return null;
  }

  private async isMaintenanceTime(
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const startHoursMinutes = new Date(startTime).toTimeString().slice(0, 5);
    const endHoursMinutes = new Date(endTime).toTimeString().slice(0, 5);

    const maintenanceTimes = await this.maintenanceTimeModel.find({});

    return maintenanceTimes.some((time) => {
      return startHoursMinutes < time.end && endHoursMinutes > time.start;
    });
  }

  private async isRoomAvailable(
    room: ConferenceRoomDocument,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const booking = await this.bookingModel.exists({
      room: room._id,
      endTime: { $gte: startTime },
      startTime: { $lte: endTime },
    });

    return !booking;
  }
}
