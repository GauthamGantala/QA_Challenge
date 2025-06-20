import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { RoomingList, RoomingListStatus, AgreementType } from "../models/rooming-list.entity";
import { Booking } from "../models/booking.entity";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(RoomingList)
    private roomingListRepository: Repository<RoomingList>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource
  ) {}

  async importData() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Start transaction to ensure data integrity
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      // Clear existing junction table data first to avoid foreign key constraint errors
      await queryRunner.query("DELETE FROM rooming_list_bookings");

      // Now clear the main tables
      await queryRunner.query("DELETE FROM bookings");
      await queryRunner.query("DELETE FROM rooming_lists");

      // Read JSON files
      const roomingListsData = JSON.parse(
        fs.readFileSync(__dirname + "/../../data/rooming-lists.json", "utf-8")
      );
      const bookingsData = JSON.parse(
        fs.readFileSync(
          path.join(__dirname + "/../../data/bookings.json"),
          "utf-8"
        )
      );
      const roomingListBookingsData = JSON.parse(
        fs.readFileSync(
          path.join(__dirname + "/../../data/rooming-list-bookings.json"),
          "utf-8"
        )
      );

      // Create a mapping to track original IDs to new auto-generated IDs
      const bookingIdMap = new Map(); // old ID -> new entity
      const roomingListIdMap = new Map(); // old ID -> new entity

      // Insert bookings without specifying IDs
      const bookings: Booking[] = [];
      for (let i = 0; i < bookingsData.length; i++) {
        const bookingData = bookingsData[i];
        // Create booking without the ID field
        const booking = this.bookingRepository.create({
          hotelId: bookingData.hotelId,
          eventId: bookingData.eventId,
          guestName: bookingData.guestName,
          guestPhoneNumber: bookingData.guestPhoneNumber,
          checkInDate: new Date(bookingData.checkInDate),
          checkOutDate: new Date(bookingData.checkOutDate),
        });
        
        // Save and get the newly created booking with auto-generated ID
        const savedBooking = await this.bookingRepository.save(booking);
        
        // Store mapping from original ID to new entity
        bookingIdMap.set((i + 1).toString(), savedBooking);
        bookings.push(savedBooking);
      }

      // Insert rooming lists without specifying IDs
      const roomingLists: RoomingList[] = [];
      for (let i = 0; i < roomingListsData.length; i++) {
        const roomingListData = roomingListsData[i];
        // Create rooming list without the ID field
        const roomingList = this.roomingListRepository.create({
          eventId: roomingListData.eventId,
          hotelId: roomingListData.hotelId,
          rfpName: roomingListData.rfpName,
          cutOffDate: new Date(roomingListData.cutOffDate),
          status: roomingListData.status as RoomingListStatus,
          agreement_type: roomingListData.agreement_type as AgreementType,
        });
        
        // Save and get the newly created rooming list with auto-generated ID
        const savedRoomingList = await this.roomingListRepository.save(roomingList);
        
        // Store mapping from original ID to new entity
        roomingListIdMap.set((i + 1).toString(), savedRoomingList);
        roomingLists.push(savedRoomingList);
      }

      // Create relationships using the mapping
      for (const relation of roomingListBookingsData) {
        const roomingList = roomingListIdMap.get(relation.roomingListId);
        const booking = bookingIdMap.get(relation.bookingId);

        if (roomingList && booking) {
          if (!roomingList.bookings) {
            roomingList.bookings = [];
          }
          roomingList.bookings.push(booking);
          await this.roomingListRepository.save(roomingList);
        }
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      return { success: true, message: "Data imported successfully" };
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();

      console.error("Import error:", error);

      return {
        success: false,
        message: "Failed to import data",
        error: error.message,
      };
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
