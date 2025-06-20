import { Booking, RoomingList } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:4003/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Rooming Lists
export const getRoomingLists = async (
  status?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: 'ASC' | 'DESC'
) => {
  const params = { status, search, sortBy, sortOrder };
  const response = await api.get<RoomingList[]>('/rooming-lists', { params });
  return response.data;
};

export const getRoomingListBookings = async (roomingListId: string) => {
  const response = await api.get<Booking[]>(`/rooming-lists/${roomingListId}/bookings`);
  return response.data;
};

// Data Import
export const importData = async () => {
  const response = await api.post('/data/import');
  return response.data;
}; 