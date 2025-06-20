import { test, expect } from '@playwright/test';

// Load backend data sources for test validation
const bookings = require('../apps/backend/data/bookings.json');
const roomingListBookings = require('../apps/backend/data/rooming-list-bookings.json');
const roomingLists = require('../apps/backend/data/rooming-lists.json');

test('TC16: Clicking "View Bookings" displays correct booking details', async ({ page }) => {
  // Open the main page where events are listed
  await page.goto('http://localhost:3000');
  await page.waitForSelector('text=Rooming List Management: Events');

  const cards = page.locator('div.sc-bmCFzp.kQijna');
  const cardCount = await cards.count();

  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i);
    // Get the event name from the UI card
    const rawName = await card.locator('.sc-lpbaSe.guyUPL').textContent();
    const rfpName = rawName?.replace(/^[\[]|[\]]$/g, '').trim();
    // Find the matching event in backend data
    const roomingList = roomingLists.find((rl) => rl.rfpName === rfpName);
    expect(roomingList, `No roomingList found for RFP name: ${rfpName}`).toBeTruthy();
    const roomingListId = roomingList.roomingListId;
    // Get all booking IDs linked to this event
    const linkedBookingIds = roomingListBookings
      .filter((r) => String(r.roomingListId) === String(roomingListId))
      .map((r) => String(r.bookingId));
    // Build a map so we can look up bookings by their ID
    const bookingIdMap = new Map<string, any>();
    for (let i = 0; i < bookings.length; i++) {
      bookingIdMap.set(String(i + 1), bookings[i]);
    }
    // Get the actual booking objects for this event
    const expectedBookings = linkedBookingIds.map(id => {
      const booking = bookingIdMap.get(id);
      if (!booking) throw new Error(`Booking ID ${id} not found in bookings.json`);
      return booking;
    });
    // Click the "View Bookings" button to open the modal
    const viewBtn = card.locator('button.sc-kRZjnb.uEwrw');
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();
    // Check that the modal opened and has the right number of bookings
    const modalEntries = page.locator('div.sc-dKKIkQ.dxQRDf');
    await expect(modalEntries.first()).toBeVisible();
    const actualCount = await modalEntries.count();
    expect(actualCount).toBe(expectedBookings.length);
    // For each booking, make sure the details match what's in the backend
    for (let j = 0; j < expectedBookings.length; j++) {
      const modal = modalEntries.nth(j);
      const eb = expectedBookings[j];
      const formattedCheckIn = formatDate(eb.checkInDate);
      const formattedCheckOut = formatDate(eb.checkOutDate);
      await expect(modal).toContainText(eb.guestName);
      await expect(modal).toContainText(eb.guestPhoneNumber);
      await expect(modal).toContainText(formattedCheckIn);
      await expect(modal).toContainText(formattedCheckOut);
    }
    // Close the modal before moving to the next card
    await page.locator('div').filter({ hasText: /^Bookings$/ }).getByRole('button').click();
    await page.waitForTimeout(300);
  }
});

// Helper to format date as MM/DD/YYYY (UI expects this format)
function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${month}/${day}/${year}`;
}
