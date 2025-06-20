# Rooming List API Postman Collection

This directory contains a Postman collection and environment for testing the Rooming List API.

## Files

- `rooming-list-api.postman_collection.json`: The Postman collection with all API endpoints
- `rooming-list-api.postman_environment.json`: The Postman environment with variables

## Setup Instructions

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Import the collection:
   - Open Postman
   - Click "Import" in the top left
   - Select the `rooming-list-api.postman_collection.json` file
   
3. Import the environment:
   - Click "Import" in the top left
   - Select the `rooming-list-api.postman_environment.json` file
   
4. Select the environment:
   - In the top right corner, select "Rooming List API - Local" from the environment dropdown

## Using the Collection

### Authentication

1. First, use the "Login" request to authenticate:
   - Username: admin
   - Password: admin
   
   The JWT token will be automatically saved to the environment variable `token`.

### Workflow

Typical workflow:

1. Login to get a token
2. Import data using the "Import Data" endpoint
3. Get all rooming lists to see the available data
4. Get bookings for a specific rooming list

### Variables

- `baseUrl`: The base URL of the API (default: http://localhost:3000)
- `token`: JWT authentication token (automatically set after login)
- `roomingListId`: ID of a rooming list for testing specific endpoints
- `bookingId`: ID of a booking for testing specific endpoints

**Tip**: After getting all rooming lists, you can copy an ID from the response and set it as the `roomingListId` variable in the environment.

## Endpoints

### Authentication
- `POST /auth/login`: Login and get JWT token

### Data Import
- `POST /data/import`: Import sample data

### Rooming Lists
- `GET /rooming-lists`: Get all rooming lists
- `GET /rooming-lists/:id`: Get a rooming list by ID
- `GET /rooming-lists/:id/bookings`: Get bookings for a rooming list
- `POST /rooming-lists`: Create a new rooming list
- `DELETE /rooming-lists`: Delete all rooming lists

### Bookings
- `GET /bookings`: Get all bookings
- `GET /bookings/:id`: Get a booking by ID
- `POST /bookings`: Create a new booking
- `DELETE /bookings`: Delete all bookings 