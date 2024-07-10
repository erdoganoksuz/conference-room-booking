import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConferenceRoom } from './conference-room.schema';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'ConferenceRoom', required: true })
  room: ConferenceRoom;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  numberOfPeople: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
