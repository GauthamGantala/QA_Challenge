import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions, DataSource } from 'typeorm';
import { RoomingList, RoomingListStatus } from '../models/rooming-list.entity';
import { RoomingListDto } from '../dtos/rooming-list.dto';

@Injectable()
export class RoomingListService {
  constructor(
    @InjectRepository(RoomingList)
    private roomingListRepository: Repository<RoomingList>,
    private dataSource: DataSource
  ) {}

  async create(roomingListDto: RoomingListDto) {
    const roomingList = this.roomingListRepository.create(roomingListDto);
    return this.roomingListRepository.save(roomingList);
  }

  async findAll(
    status?: string,
    search?: string,
    sortBy: string = 'cutOffDate',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<RoomingList[]> {
    const options: FindManyOptions<RoomingList> = {
      relations: ['bookings'],
    };

    // Filter by status if provided
    if (status) {
      options.where = {
        status: status as RoomingListStatus,
      };
    }

    // Add search if provided
    if (search) {
      options.where = {
        ...(options.where || {}),
        rfpName: ILike(`%${search}%`),
      };
    }

    // Add sorting
    options.order = {
      [sortBy]: sortOrder,
    };

    return this.roomingListRepository.find(options);
  }

  async findOne(id: string): Promise<RoomingList> {
    return this.roomingListRepository.findOne({
      where: { roomingListId: id },
      relations: ['bookings'],
    });
  }

  async findBookings(id: string) {
    const roomingList = await this.roomingListRepository.findOne({
      where: { roomingListId: id },
      relations: ['bookings'],
    });
    return roomingList.bookings;
  }

  async removeAll() {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      // First, clear the junction table
      await queryRunner.query('DELETE FROM rooming_list_bookings');
      
      // Then, clear the rooming lists table
      await queryRunner.query('DELETE FROM rooming_lists');
      
      await queryRunner.commitTransaction();
      
      return { success: true, message: 'All rooming lists have been deleted' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { 
        success: false, 
        message: 'Failed to delete rooming lists', 
        error: error.message 
      };
    } finally {
      await queryRunner.release();
    }
  }
} 