import React from 'react';
import styled from 'styled-components';
import { Booking } from '../types';

interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #111827;
  }
`;

const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BookingItem = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const GuestName = styled.div`
  font-weight: 600;
  color: #111827;
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const DetailLabel = styled.span`
  font-weight: 500;
`;

export const BookingsModal: React.FC<BookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Bookings</ModalTitle>
          <CloseButton onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </ModalHeader>
        <BookingList>
          {bookings.map((booking) => (
            <BookingItem key={booking.bookingId}>
              <BookingHeader>
                <GuestName>{booking.guestName}</GuestName>
                <div>ID: {booking.bookingId}</div>
              </BookingHeader>
              <BookingDetails>
                <div>
                  <DetailLabel>Phone:</DetailLabel> {booking.guestPhoneNumber}
                </div>
                <div>
                  <DetailLabel>Hotel ID:</DetailLabel> {booking.hotelId}
                </div>
                <div>
                  <DetailLabel>Check-in:</DetailLabel> {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div>
                  <DetailLabel>Check-out:</DetailLabel> {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </BookingDetails>
            </BookingItem>
          ))}
        </BookingList>
      </ModalContent>
    </ModalOverlay>
  );
}; 