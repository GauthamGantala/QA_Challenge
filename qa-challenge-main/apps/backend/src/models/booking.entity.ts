import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoomingList } from './rooming-list.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column()
  hotelId: string;

  @Column()
  eventId: string;

  @Column()
  guestName: string;

  @Column({ nullable: true })
  guestPhoneNumber: string;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @ManyToMany(() => RoomingList, roomingList => roomingList.bookings)
  roomingLists: RoomingList[];
} 