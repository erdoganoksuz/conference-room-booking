import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConferenceRoomDocument = ConferenceRoom & Document;

@Schema()
export class ConferenceRoom {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;
}

export const ConferenceRoomSchema =
  SchemaFactory.createForClass(ConferenceRoom);
