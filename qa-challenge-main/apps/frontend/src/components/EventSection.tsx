import React, { useEffect, useRef, useState } from 'react';

import { CustomScrollbar } from './CustomScrollbar';
import { RoomingList } from '../types';
import { RoomingListCard } from './RoomingListCard';
import styled from 'styled-components';

interface EventSectionProps {
  eventName: string;
  roomingLists: RoomingList[];
}


interface PaginationDotProps {
  isActive: boolean;
}

const PaginationDot = styled.button<PaginationDotProps>`
  height: 0.5rem;
  border-radius: 9999px;
  width: ${props => props.isActive ? '2rem' : '0.5rem'};
  background-color: ${props => props.isActive ? '#4f46e5' : '#cbd5e1'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isActive ? '#4f46e5' : '#94a3b8'};
  }
`;

export const EventSection: React.FC<EventSectionProps> = ({ eventName, roomingLists }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const cardsPerPage = 3; // Number of cards visible at once

  useEffect(() => {
    // Calculate total pages based on card count and cards per page
    if (roomingLists.length > 0) {
      setTotalPages(Math.ceil(roomingLists.length / cardsPerPage));
    }
    
    // Initially scroll to the beginning
    if (scrollContainerRef.current && roomingLists.length > cardsPerPage) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
          setCurrentPage(0);
        }
      }, 100);
    }
  }, [roomingLists.length, totalPages]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollPosition = scrollLeft / (scrollWidth - clientWidth);
      
      // Update current page based on scroll position
      const newPage = Math.min(
        Math.floor(scrollPosition * totalPages),
        totalPages - 1
      );
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  };

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const pagePosition = pageIndex / (totalPages - 1 || 1);
      const targetScrollLeft = maxScrollLeft * pagePosition;
      
      scrollContainerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      
      setCurrentPage(pageIndex);
    }
  };

  const handleScrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const handleScrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  const handleIndicatorClick = (pageIndex: number) => {
    scrollToPage(pageIndex);
  };

  // Handle scroll position change from custom scrollbar
  const handleScrollChange = (scrollPosition: number) => {
    // This is automatically handled by the scrollbars' internal logic
    // that directly scrolls the container when dragged
  };

  return (
    <SectionContainer>
      {/* Scrollable card container */}
      <CardsContainer>
        <ScrollableArea 
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <CardsRow>
            {roomingLists.map((roomingList) => (
              <CardWrapper key={roomingList.roomingListId}>
                <RoomingListCard roomingList={roomingList} />
              </CardWrapper>
            ))}
          </CardsRow>
        </ScrollableArea>
        
        {/* Scroll indicators */}
        {roomingLists.length > cardsPerPage && (
          <>
            <NavButton isLeftButton isHidden={currentPage === 0}>
              <CircleButton onClick={handleScrollLeft}>
                <NavIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </NavIcon>
              </CircleButton>
            </NavButton>
            
            <NavButton isHidden={currentPage === totalPages - 1}>
              <CircleButton onClick={handleScrollRight}>
                <NavIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </NavIcon>
              </CircleButton>
            </NavButton>
          </>
        )}
      </CardsContainer>
      
      {/* Custom scrollbar */}
      {roomingLists.length > cardsPerPage && (
        <CustomScrollbar 
          containerRef={scrollContainerRef}
          totalPages={totalPages}
          currentPage={currentPage}
          onScrollChange={handleScrollChange}
        />
      )}
    </SectionContainer>
  );
}; 


// Styled components
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const CardsContainer = styled.div`
  position: relative;
`;

const ScrollableArea = styled.div`
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  max-width: 100%;
  padding-bottom: 1rem;
  
  /* Hide the default scrollbar since we're using a custom one */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CardsRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 0.125rem;
  width: max-content;
`;

const CardWrapper = styled.div`
  scroll-snap-align: start;
`;

interface NavButtonProps {
  isLeftButton?: boolean;
  isHidden?: boolean;
}

const NavButton = styled.div<NavButtonProps>`
  position: absolute;
  top: 50%;
  ${props => props.isLeftButton ? 'left: 0;' : 'right: 0;'}
  transform: translateY(-50%) ${props => props.isLeftButton ? 'translateX(-1rem)' : 'translateX(1rem)'};
  display: ${props => props.isHidden ? 'none' : 'block'};
`;

const CircleButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const NavIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PaginationDots = styled.div`
  display: inline-flex;
  gap: 0.75rem;
`;
