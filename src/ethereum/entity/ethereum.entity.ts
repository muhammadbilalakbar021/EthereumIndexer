import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EthereumDocument = EthereumEntity &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class EthereumEntity {
  _id?: any;

  @Prop()
  xaccount?: string;

  @Prop()
  address: string;

  @Prop()
  publicKey: string;

  @Prop()
  privateKey: string;

  @Prop()
  hdPath: string;

  @Prop({ default: 0 })
  balance?: string;

  @Prop()
  coinSymbol: string;

  @Prop()
  isERC20: boolean;

  @Prop()
  isBEP20: boolean;

  @Prop()
  updatedAt?: string;

  @Prop()
  seed: string;

  @Prop({ default: false })
  distributionRequest: boolean;
}

export const EthereumSchema = SchemaFactory.createForClass(EthereumEntity);
