import { RoomingList, RoomingListStatus, Booking } from '../types';
import { getRoomingListBookings, getRoomingLists } from '../services/api';

import { create } from 'zustand';
import { format } from 'date-fns';
import { groupBy } from '../utils/helpers';

interface RoomingListState {
  roomingLists: RoomingList[];
  filteredRoomingLists: RoomingList[];
  status: string | null;
  search: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  loading: boolean;
  error: string | null;
  eventGroups: Record<string, {
    eventId: string;
    name: string;
    roomingLists: RoomingList[];
  }>;
  fetchRoomingLists: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  viewBookings: (roomingListId: string) => Promise<Booking[]>;
}

// Create a single debounced fetch function
const createDebouncedFetch = (fetchFn: () => Promise<void>) => {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fetchFn(), 500);
  };
};

export const useRoomingListStore = create<RoomingListState>((set, get) => {
  // Create the debounced fetch function once
  const debouncedFetch = createDebouncedFetch(() => get().fetchRoomingLists());

  return {
    roomingLists: [],
    filteredRoomingLists: [],
    status: null,
    search: '',
    sortBy: 'cutOffDate',
    sortOrder: 'ASC',
    loading: false,
    error: null,
    eventGroups: {},

    fetchRoomingLists: async () => {
      set({ loading: true, error: null });
      try {
        const { status, search, sortBy, sortOrder } = get();
        const data = await getRoomingLists(status || undefined, search || undefined, sortBy, sortOrder);
        
        // Group by eventId
        const groupedByEvent = groupBy(data, 'eventId');
        
        // Create named event groups
        const eventGroups = Object.keys(groupedByEvent).reduce((acc, eventId) => {
          // Map event names (in a real app, you'd fetch this from the backend)
          const eventName = eventId === '1' ? 'Austin City Limits' : 'Ultra Musical Festival';
          
          acc[eventId] = {
            eventId,
            name: eventName,
            roomingLists: groupedByEvent[eventId],
          };
          
          return acc;
        }, {} as Record<string, { eventId: string; name: string; roomingLists: RoomingList[] }>);
        
        set({ 
          roomingLists: data, 
          filteredRoomingLists: data, 
          eventGroups,
          loading: false 
        });
      } catch (error) {
        console.error('Failed to fetch rooming lists', error);
        set({ error: 'Failed to fetch rooming lists', loading: false });
      }
    },

    setStatus: (status) => {
      set({ status });
      get().fetchRoomingLists();
    },

    setSearch: (search) => {
      set({ search });
      debouncedFetch();
    },

    setSortBy: (sortBy) => {
      set({ sortBy });
      get().fetchRoomingLists();
    },

    setSortOrder: (sortOrder) => {
      set({ sortOrder });
      get().fetchRoomingLists();
    },

    viewBookings: async (roomingListId: string) => {
      try {
        const bookings = await getRoomingListBookings(roomingListId);
        return bookings;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    },
  };
}); 