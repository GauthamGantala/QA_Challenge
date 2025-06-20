import { Booking } from './models/booking.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { ConfigModule } from '@nestjs/config';
import { DataController } from './controllers/data.controller';
import { DataService } from './services/data.service';
import { Module } from '@nestjs/common';
import { RoomingList } from './models/rooming-list.entity';
import { RoomingListController } from './controllers/rooming-list.controller';
import { RoomingListService } from './services/rooming-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'rooming_list',
      entities: [RoomingList, Booking],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([RoomingList, Booking]),
  ],
  controllers: [
    RoomingListController,
    BookingController,
    DataController,
  ],
  providers: [
    RoomingListService,
    BookingService,
    DataService,
  ],
})
export class AppModule {} 