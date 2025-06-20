import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Booking } from './booking.entity';

export enum RoomingListStatus {
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum AgreementType {
  LEISURE = 'leisure',
  STAFF = 'staff',
  ARTIST = 'artist',
}

@Entity('rooming_lists')
export class RoomingList {
  @PrimaryGeneratedColumn('uuid')
  roomingListId: string;

  @Column()
  eventId: string;

  @Column()
  hotelId: string;

  @Column()
  rfpName: string;

  @Column({ type: 'date' })
  cutOffDate: Date;

  @Column({
    type: 'enum',
    enum: RoomingListStatus,
    default: RoomingListStatus.ACTIVE,
  })
  status: RoomingListStatus;

  @Column({
    type: 'enum',
    enum: AgreementType,
  })
  agreement_type: AgreementType;

  @ManyToMany(() => Booking, booking => booking.roomingLists)
  @JoinTable({
    name: 'rooming_list_bookings',
    joinColumn: {
      name: 'roomingListId',
      referencedColumnName: 'roomingListId',
    },
    inverseJoinColumn: {
      name: 'bookingId',
      referencedColumnName: 'bookingId',
    },
  })
  bookings: Booking[];
} 