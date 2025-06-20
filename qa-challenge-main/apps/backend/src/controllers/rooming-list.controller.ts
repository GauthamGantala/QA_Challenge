import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { RoomingListService } from '../services/rooming-list.service';
import { RoomingListDto } from '../dtos/rooming-list.dto';

@Controller('rooming-lists')
export class RoomingListController {
  constructor(private readonly roomingListService: RoomingListService) {}

  @Post()
  create(@Body() roomingListDto: RoomingListDto) {
    return this.roomingListService.create(roomingListDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.roomingListService.findAll(status, search, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomingListService.findOne(id);
  }

  @Get(':id/bookings')
  findBookings(@Param('id') id: string) {
    return this.roomingListService.findBookings(id);
  }

  @Delete()
  removeAll() {
    return this.roomingListService.removeAll();
  }
} 