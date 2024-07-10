import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConferenceRoomService } from './conference-room.service';
import { Booking, BookingDocument } from './schema/booking.schema';
import {
  ConferenceRoom,
  ConferenceRoomDocument,
} from './schema/conference-room.schema';
import {
  MaintenanceTime,
  MaintenanceTimeDocument,
} from './schema/maintenenace-time.schema';
import { Model } from 'mongoose';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';

describe('ConferenceRoomService', () => {
  let service: ConferenceRoomService;
  let conferenceRoomModel: Model<ConferenceRoomDocument>;
  let bookingModel: Model<BookingDocument>;
  let maintenanceTimeModel: Model<MaintenanceTimeDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConferenceRoomService,
        {
          provide: getModelToken(ConferenceRoom.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: getModelToken(Booking.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: getModelToken(MaintenanceTime.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConferenceRoomService>(ConferenceRoomService);
    conferenceRoomModel = module.get<Model<ConferenceRoomDocument>>(
      getModelToken(ConferenceRoom.name),
    );
    bookingModel = module.get<Model<BookingDocument>>(
      getModelToken(Booking.name),
    );
    maintenanceTimeModel = module.get<Model<MaintenanceTimeDocument>>(
      getModelToken(MaintenanceTime.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bookRoom', () => {
    it('should return a message when booking is during maintenance time', async () => {
      const bookingDto: CreateConferenceRoomDto = {
        startTime: '2024-07-10T10:00:00.000',
        endTime: '2024-07-10T12:00:00.000',
        numberOfPeople: 10,
      };

      (maintenanceTimeModel.find as jest.Mock).mockResolvedValue([
        { start: '09:00', end: '11:00' },
      ]);

      const result = await service.bookRoom(bookingDto);
      expect(result).toBe('Booking cannot be done in maintenance times');
    });

    it('should return a message when no rooms are available', async () => {
      const bookingDto: CreateConferenceRoomDto = {
        startTime: '2024-07-10T10:00:00.000',
        endTime: '2024-07-10T12:00:00.000',
        numberOfPeople: 10,
      };

      (maintenanceTimeModel.find as jest.Mock).mockResolvedValue([]);
      (conferenceRoomModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn(() => []),
      });

      (bookingModel.create as jest.Mock).mockResolvedValue({});

      const result = await service.bookRoom(bookingDto);
      expect(result).toBe('No available rooms');
    });

    it('should return a success message when a room is booked', async () => {
      const bookingDto: CreateConferenceRoomDto = {
        startTime: '2024-07-10T10:00:00.000',
        endTime: '2024-07-10T12:00:00.000',
        numberOfPeople: 10,
      };

      const availableRoom = [
        {
          _id: 'roomId',
          name: 'Conference Room A',
          capacity: 10,
        },
      ];

      (maintenanceTimeModel.find as jest.Mock).mockResolvedValue([]);
      (conferenceRoomModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn(() => availableRoom),
      });
      (bookingModel.create as jest.Mock).mockResolvedValue({});
      (bookingModel.exists as jest.Mock).mockResolvedValue(null);

      const result = await service.bookRoom(bookingDto);
      expect(result).toBe(
        `Room Conference Room A booked successfully for ${bookingDto.startTime} to ${bookingDto.endTime}`,
      );
    });
  });
});
