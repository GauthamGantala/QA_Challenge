import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { BookingDto } from '../dtos/booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() bookingDto: BookingDto) {
    return this.bookingService.create(bookingDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Delete()
  removeAll() {
    return this.bookingService.removeAll();
  }
} 