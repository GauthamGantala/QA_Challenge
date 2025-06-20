import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookingDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsOptional()
  guestPhoneNumber?: string;

  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;
} 