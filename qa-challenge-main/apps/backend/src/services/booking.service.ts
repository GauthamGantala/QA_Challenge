import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from '../models/booking.entity';
import { BookingDto } from '../dtos/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource
  ) {}

  async create(bookingDto: BookingDto) {
    const booking = this.bookingRepository.create({
      ...bookingDto,
      checkInDate: new Date(bookingDto.checkInDate),
      checkOutDate: new Date(bookingDto.checkOutDate),
    });
    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { bookingId: id },
    });
  }

  async removeAll() {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      // First, clear the junction table
      await queryRunner.query('DELETE FROM rooming_list_bookings');
      
      // Then, clear the bookings table
      await queryRunner.query('DELETE FROM bookings');
      
      await queryRunner.commitTransaction();
      
      return { success: true, message: 'All bookings have been deleted' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { 
        success: false, 
        message: 'Failed to delete bookings', 
        error: error.message 
      };
    } finally {
      await queryRunner.release();
    }
  }
} 