import { AgreementType, Booking, RoomingList, RoomingListStatus } from "../types";
import {
  formatAgreementType,
  formatDate,
  getDateRange,
} from "../utils/helpers";

import React, { useState } from "react";
import styled from "styled-components";
import { useRoomingListStore } from "../store/roomingListStore";
import { BookingsModal } from "./BookingsModal";

interface RoomingListCardProps {
  roomingList: RoomingList;
}

export const RoomingListCard: React.FC<RoomingListCardProps> = ({
  roomingList,
}) => {
  const { viewBookings } = useRoomingListStore();
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Calculate date range
  const { startDate, endDate } = roomingList.bookings
    ? getDateRange(roomingList.bookings)
    : { startDate: "29 Jun, 2025", endDate: "05 Jul, 2025" };

  const handleViewBookings = async () => {
    const bookingsData = await viewBookings(roomingList.roomingListId);
    // @ts-ignore
    setBookings(bookingsData);
    setIsBookingsModalOpen(true);
  };

  const getBookingCount = () => {
    if (!roomingList.bookings) return 0;
    return roomingList.bookings.length;
  };

  // Extract date from cutoff date for badge
  const cutoffDay = new Date(roomingList.cutOffDate).getDate();

  // Get month abbreviation
  const getMonthAbbr = () => {
    const date = new Date(roomingList.cutOffDate);
    return date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  };

  return (
    <>
      {isBookingsModalOpen && (
        <BookingsModal
          isOpen={isBookingsModalOpen}
          bookings={bookings}
          onClose={() => setIsBookingsModalOpen(false)}
        />
      )}
      <Card>
        {/* Header with Date Badge */}
        <CardHeader>
          {/* RFP Name and Agreement Type */}
          <InfoContainer>
            <RfpName>[{roomingList.rfpName}]</RfpName>
            <AgreementText>
              Agreement:{" "}
              <span>{formatAgreementType(roomingList.agreement_type)}</span>
            </AgreementText>
          </InfoContainer>

          {/* Date Badge */}
          <DateBadgeContainer>
            <DateBadge>
              <MonthDisplay>
                <div>{getMonthAbbr()}</div>
              </MonthDisplay>
              <DayDisplay>
                <div>{cutoffDay}</div>
              </DayDisplay>
            </DateBadge>
            <DateLabel>Cut-Off Date</DateLabel>
          </DateBadgeContainer>
        </CardHeader>

        {/* Card Content and Buttons */}
        <CardContent>
          {/* Date Range */}
          <MetadataContainer>
            <DateRange>
              <CalendarIcon
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </CalendarIcon>
              {startDate} - {endDate}
            </DateRange>

            {/* Status Pill */}
            <StatusBadge status={roomingList.status}>
              {roomingList.status}
            </StatusBadge>
          </MetadataContainer>

          {/* Buttons */}
          <ButtonsContainer>
            {/* View Bookings Button */}
            <ViewButton onClick={handleViewBookings}>
              <div>View Bookings ({getBookingCount()})</div>
            </ViewButton>

            {/* File Button */}
            <FileButton>
              <img src="../../assets/Icon.svg" alt="Arrow" />
            </FileButton>
          </ButtonsContainer>
        </CardContent>
      </Card>
    </>
  );
};

// Styled components
const Card = styled.div`
  width: 24rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RfpName = styled.div`
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: normal;
  color: #171717;
`;

const AgreementText = styled.div`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25;
  color: rgba(23, 23, 23, 0.8);

  span {
    font-weight: 800;
  }
`;

const DateBadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const DateBadge = styled.div`
  width: 3.5rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
`;

const MonthDisplay = styled.div`
  background-color: rgba(59, 130, 246, 0.25);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 0.125rem 0.625rem;
  display: flex;
  justify-content: center;

  div {
    color: #3b82f6;
    font-family: "Poppins", sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 0.75rem;
    letter-spacing: 0.05em;
  }
`;

const DayDisplay = styled.div`
  background-color: rgba(59, 130, 246, 0.1);
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  padding: 0.25rem 0.625rem;
  display: flex;
  justify-content: center;

  div {
    color: #3b82f6;
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: normal;
    text-align: center;
  }
`;

const DateLabel = styled.div`
  color: #64748b;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: normal;
`;

const MetadataContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
`;

const CalendarIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
`;

interface StatusBadgeProps {
  status: RoomingListStatus;
}

const StatusBadge = styled.div<StatusBadgeProps>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0 0.5rem;
  border-radius: 9999px;

  ${({ status }) => {
    switch (status) {
      case RoomingListStatus.ACTIVE:
        return `
          background-color: #f0fdf4;
          color: #15803d;
          border: 1px solid #dcfce7;
        `;
      case RoomingListStatus.CLOSED:
        return `
          background-color: #f9fafb;
          color: #374151;
          border: 1px solid #f3f4f6;
        `;
      default:
        return `
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fee2e2;
        `;
    }
  }}
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 0.625rem;
  background-color: #4f46e5;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }

  div {
    color: white;
    font-family: "Poppins", sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: normal;
  }
`;

const FileButton = styled.button`
  width: 2.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid #4f46e5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #eef2ff;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #4f46e5;
  }
`;
