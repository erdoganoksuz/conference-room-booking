import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaintenanceTimeDocument = MaintenanceTime & Document;

@Schema()
export class MaintenanceTime {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;
}

export const MaintenanceTimeSchema =
  SchemaFactory.createForClass(MaintenanceTime);
