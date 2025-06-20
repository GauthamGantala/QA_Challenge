import './index.css';

import React, { useEffect } from 'react';

import { Button } from './components/Button';
// import { DataImportButton } from './components/DataImportButton';
import { EmptyState } from './components/EmptyState';
import { EventSection } from './components/EventSection';
import { Filters } from './components/Filters';
import { LoadingState } from './components/LoadingState';
import { Login } from './components/Login';
import { importData } from './services/api';
import styled from 'styled-components';
import { useRoomingListStore } from './store/roomingListStore';

function App() {
  const { 
    fetchRoomingLists, 
    eventGroups, 
    loading, 
    error,
    search,
    setSearch
  } = useRoomingListStore();

  useEffect(() => {
    fetchRoomingLists();
  }, [fetchRoomingLists]);

  const handleImportData = async () => {
    try {
      await importData();
      await fetchRoomingLists();
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (loading) {
    return <LoadingState message="Loading rooming lists..." />;
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </ErrorIcon>
        <span>{error}</span>
      </ErrorContainer>
    );
  }

  if (Object.keys(eventGroups).length === 0) {
    return (
      <EmptyState 
        title="No rooming lists found"
        description="Import data to see rooming lists for your events."
        actionLabel="Import Data"
        onAction={handleImportData}
        icon={
          <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
    );
  }

  return (
    <AppContainer>
      <ContentContainer>
        {/* Header Section */}
        <Header>
          <Heading>
            Rooming List Management: Events
          </Heading>
          
          {/* Search and Filters Row */}
          <ToolbarRow>
            <SearchArea>
              {/* Search Input */}
              <SearchInputContainer>
                <SearchIconContainer>
                  <SearchIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.7956 18 9.5C18 7.20435 17.0913 5.09129 15.5 3.5C13.9087 1.90871 11.7956 1 9.5 1C7.20435 1 5.09129 1.90871 3.5 3.5C1.90871 5.09129 1 7.20435 1 9.5C1 11.7956 1.90871 13.9087 3.5 15.5C5.09129 17.0913 7.20435 18 9.5 18C11.7956 18 13.9087 17.0913 15.5 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </SearchIcon>
                </SearchIconContainer>
                <SearchInput
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search"
                />
              </SearchInputContainer>
              {/* Filters Component */}
              <Filters />
            </SearchArea>
            
          </ToolbarRow>
        </Header>

        {/* Main Content */}
        <Main>
          <EventsContainer>
            {Object.values(eventGroups).map((event) => (
              <EventDivider key={event.eventId}>
                {/* Event Divider with Label */}
                <DividerRow>
                  <DividerLine />
                  <EventLabel>
                    <EventName>{event.name}</EventName>
                  </EventLabel>
                  <DividerLine />
                </DividerRow>
                
                {/* Event Section Component */}
                <EventSection
                  eventName={event.name}
                  roomingLists={event.roomingLists}
                />
              </EventDivider>
            ))}
          </EventsContainer>
        </Main>
      </ContentContainer>
    </AppContainer>
  );
}

export default App; 



// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 2rem 5rem;
  padding-top: 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Heading = styled.h1`
  color: #141416;
  font-size: 1.875rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
`;

const ToolbarRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInputContainer = styled.div`
  width: 18rem;
  height: 3rem;
  padding-left: 0.25rem;
  padding-right: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const SearchIconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
`;

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  color: #64748b;
  width: 100%;
`;

const Main = styled.main`
  width: 100%;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const EventDivider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DividerRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 194, 166, 0.00) 0%, #00C2A6 50%, rgba(0, 194, 166, 0.00) 100%);
`;

const EventLabel = styled.div`
  padding: 0.375rem 0.75rem;
  background-color: #ecfdf5;
  border-radius: 0.25rem;
  border: 1px solid #14b8a6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EventName = styled.span`
  color: #14b8a6;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
`;

const ErrorContainer = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ErrorIcon = styled.svg`
  height: 1.25rem;
  width: 1.25rem;
`;