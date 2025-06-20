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

export interface Booking {
  bookingId: string;
  hotelId: string;
  eventId: string;
  guestName: string;
  guestPhoneNumber?: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface RoomingList {
  roomingListId: string;
  eventId: string;
  hotelId: string;
  rfpName: string;
  cutOffDate: string;
  status: RoomingListStatus;
  agreement_type: AgreementType;
  bookings?: Booking[];
}

export interface Event {
  eventId: string;
  name: string;
  roomingLists: RoomingList[];
} 