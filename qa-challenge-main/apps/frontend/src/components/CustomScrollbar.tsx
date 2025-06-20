import React, { useEffect, useRef, useState } from "react";

import styled from "styled-components";

// Types
interface CustomScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement>;
  totalPages: number;
  currentPage: number;
  onScrollChange?: (position: number) => void;
}

// Styled components
const StyledScrollbar = styled.div`
  width: 100%;
  height: 20px;
  position: relative;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const StyledTrack = styled.div`
  width: 100%;
  height: 4px;
  left: 0px;
  top: 8px;
  position: absolute;
  background: #CDD4E5;
  border-radius: 4px;
`;

const StyledComponent = styled.div<{ position: number }>`
  width: 194px;
  height: 16px;
  position: absolute;
  background: #CDD4E5;
  border-radius: 4px;
  left: ${({ position }) => position}px;
  top: 2px;
  cursor: grab;
  transition: left 0.1s ease;
`;

const StyledIndicatorContainer = styled.div`
  width: 314px;
  height: 46px;
  padding: 10px;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
  transform: translateX(-61px);
`;

const StyledRectangle24961 = styled.div`
  width: 10px;
  height: 4px;
  left: 79px;
  top: 3px;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  background: #F9FBFF;
  border-radius: 4px;
`;

const StyledRectangle24962 = styled.div`
  width: 10px;
  height: 4px;
  left: 99px;
  top: 3px;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  background: #F9FBFF;
  border-radius: 4px;
`;

const StyledRectangle24963 = styled.div`
  width: 10px;
  height: 4px;
  left: 119px;
  top: 3px;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  background: #F9FBFF;
  border-radius: 4px;
`;

const StyledThumb = styled.div<{ isDragging: boolean }>`
  width: 10px;
  height: 4px;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  background: ${({ isDragging }) => isDragging ? '#4f46e5' : '#475569'};
  border-radius: 4px;
  transition: background-color 0.2s;
`;

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ 
  containerRef, 
  totalPages, 
  currentPage,
  onScrollChange
}) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollHandlePosition, setScrollHandlePosition] = useState(0);
  
  // Calculate handle position based on scroll
  const calculateHandlePosition = () => {
    if (!containerRef.current) return 0;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    // Calculate scroll percentage (0 to 1)
    const scrollPercentage = scrollLeft / (scrollWidth - clientWidth) || 0;
    
    // Calculate position for the handle in pixels
    // We want it to move within our component's width limits
    const trackWidth = scrollbarRef.current?.clientWidth || 0;
    const componentWidth = 194; // Width of our handle component
    const maxPosition = trackWidth - componentWidth;
    
    // Calculate position in pixels based on scroll percentage
    return Math.max(0, Math.min(maxPosition * scrollPercentage, maxPosition));
  };
  
  // Update handle position when scroll changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleScroll = () => {
      setScrollHandlePosition(calculateHandlePosition());
    };
    
    // Initial position
    handleScroll();
    
    // Listen for scroll events
    containerRef.current.addEventListener('scroll', handleScroll);
    
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, totalPages, currentPage]);
  
  // Handle scrollbar drag start
  const handleScrollbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Attach events to window to handle drag
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle scrollbar drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollbarRef.current || !containerRef.current) return;
    
    const trackRect = scrollbarRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const componentWidth = 194; // Width of our handle
    
    // Calculate position relative to the track
    const offsetX = e.clientX - trackRect.left;
    
    // Convert to percentage (0-1), accounting for the handle width
    const handleWidthPercentage = componentWidth / trackWidth;
    let scrollPercentage = (offsetX - componentWidth / 2) / (trackWidth - componentWidth);
    scrollPercentage = Math.max(0, Math.min(1, scrollPercentage));
    
    // Scroll the content
    const { scrollWidth, clientWidth } = containerRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    containerRef.current.scrollLeft = maxScrollLeft * scrollPercentage;
    
    // Update position
    setScrollHandlePosition(calculateHandlePosition());
    
    // Call the callback
    if (onScrollChange) {
      onScrollChange(scrollPercentage);
    }
  };
  
  // Handle scrollbar drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate thumb position for draggable element
  const getThumbPosition = () => {
    // Base position is 99px, adjust based on scroll position
    const minPos = 79;
    const maxPos = 119;
    
    // If we have at least one page, calculate position
    if (totalPages > 1) {
      return minPos + (maxPos - minPos) * (currentPage / (totalPages - 1));
    }
    
    return 99; // Default middle position
  };
  
  return (
    <StyledScrollbar ref={scrollbarRef}>
      <StyledTrack />
      <StyledIndicatorContainer 
        style={{ left: `${scrollHandlePosition}px` }}
        onMouseDown={handleScrollbarMouseDown}
      >
        <StyledComponent position={0}>
          <StyledRectangle24961 />
          <StyledRectangle24962 />
          <StyledRectangle24963 />
          <StyledThumb 
            isDragging={isDragging} 
            style={{ left: `${getThumbPosition()}px`, top: '3px' }}
          />
        </StyledComponent>
      </StyledIndicatorContainer>
    </StyledScrollbar>
  );
}; 