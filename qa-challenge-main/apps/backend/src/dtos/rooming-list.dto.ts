import { AgreementType, RoomingListStatus } from '../models/rooming-list.entity';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RoomingListDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  rfpName: string;

  @IsDateString()
  @IsNotEmpty()
  cutOffDate: string;

  @IsEnum(RoomingListStatus)
  @IsNotEmpty()
  status: RoomingListStatus;

  @IsEnum(AgreementType)
  @IsNotEmpty()
  agreement_type: AgreementType;
} 