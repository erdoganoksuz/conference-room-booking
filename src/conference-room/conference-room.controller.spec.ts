import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceRoomController } from './conference-room.controller';
import { ConferenceRoomService } from './conference-room.service';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';
import { ConferenceRoomAvailabilityDto } from './dto/conference-room-availability.dto';
import { ConferenceRoom } from './entities/conference-room.entity';

describe('ConferenceRoomController', () => {
  let controller: ConferenceRoomController;
  let service: ConferenceRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConferenceRoomController],
      providers: [
        {
          provide: ConferenceRoomService,
          useValue: {
            bookRoom: jest.fn(),
            checkAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConferenceRoomController>(ConferenceRoomController);
    service = module.get<ConferenceRoomService>(ConferenceRoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookRoom', () => {
    it('should book a room', async () => {
      const bookingDto: CreateConferenceRoomDto = {
        startTime: '2024-07-10T10:00:00.000Z',
        endTime: '2024-07-10T12:00:00.000Z',
        numberOfPeople: 10,
      };

      const expectedResult = 'Room Conference Room A booked successfully';

      jest.spyOn(service, 'bookRoom').mockResolvedValue(expectedResult);

      const result = await controller.bookRoom(bookingDto);
      expect(result).toBe(expectedResult);
      expect(service.bookRoom).toHaveBeenCalledWith(bookingDto);
    });
  });

  describe('checkAvailability', () => {
    it('should return available rooms', async () => {
      const availabilityDto: ConferenceRoomAvailabilityDto = {
        startTime: '2024-07-10T10:00:00.000Z',
        endTime: '2024-07-10T12:00:00.000Z',
      };

      const availableRooms: ConferenceRoom[] = [
        { name: 'Conference Room A', capacity: 10 },
        { name: 'Conference Room B', capacity: 15 },
      ];

      jest
        .spyOn(service, 'checkAvailability')
        .mockResolvedValue(availableRooms);

      const result = await controller.checkAvailability(availabilityDto);
      expect(result).toBe(availableRooms);
      expect(service.checkAvailability).toHaveBeenCalledWith(availabilityDto);
    });
  });
});
