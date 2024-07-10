import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { ConferenceRoomModule } from '../src/conference-room/conference-room.module';

describe('ConferenceRoomController (integration)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              MONGO_URI: uri,
              MONGO_DB_NAME: 'MONGO_DB_NAME',
            }),
          ],
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        DatabaseModule,
        ConferenceRoomModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await mongod.stop();
    await app.close();
  });

  describe('POST /conference-room/book', () => {
    it('should book a room', async () => {
      const bookingDto = {
        startTime: '2028-07-10T06:00:00.585',
        endTime: '2028-07-10T06:30:00.585',
        numberOfPeople: 1,
      };

      await request(app.getHttpServer())
        .post('/conference-room/book')
        .send(bookingDto)
        .expect(201);
    });
  });

  describe('GET /conference-room/availability', () => {
    it('should return available rooms', async () => {
      const availabilityDto = {
        startTime: '2029-07-10T06:00:00.585',
        endTime: '2029-07-10T06:30:00.585',
      };

      const response = await request(app.getHttpServer())
        .get('/conference-room/availability')
        .query(availabilityDto)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(1);
    });
  });
});
