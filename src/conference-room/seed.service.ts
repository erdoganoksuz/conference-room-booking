import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConferenceRoom,
  ConferenceRoomDocument,
} from './schema/conference-room.schema';
import {
  MaintenanceTime,
  MaintenanceTimeDocument,
} from './schema/maintenenace-time.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(ConferenceRoom.name)
    private conferenceRoomModel: Model<ConferenceRoomDocument>,
    @InjectModel(MaintenanceTime.name)
    private maintenanceTimeModel: Model<MaintenanceTimeDocument>,
  ) {}

  async onModuleInit() {
    const roomsCount = await this.conferenceRoomModel.countDocuments().exec();
    if (roomsCount === 0) {
      await Promise.all([
        this.seedConferenceRooms(),
        this.seedMaintenenaceTimes(),
      ]);
    }
  }

  private async seedMaintenenaceTimes() {
    const maintenanceTimeModel = [
      { start: '09:00', end: '09:15' },
      { start: '13:00', end: '13:15' },
      { start: '17:00', end: '17:15' },
    ];
    await this.maintenanceTimeModel.insertMany(maintenanceTimeModel);
  }

  private async seedConferenceRooms() {
    const conferenceRooms = [
      {
        name: 'Amaze',
        capacity: 3,
      },
      {
        name: 'Beauty',
        capacity: 7,
      },
      {
        name: 'Inspire',
        capacity: 12,
      },
      {
        name: 'Strive',
        capacity: 20,
      },
    ];

    await this.conferenceRoomModel.insertMany(conferenceRooms);
  }
}
