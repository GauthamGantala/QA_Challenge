import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Event Cards Functionality', () => {
  // Visit the events page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('text=Rooming List Management: Events');
  });

  test('TC12: Event cards are grouped by event names', async ({ page }) => {
    // Check that event cards are grouped under headings like "Austin City Limits"
    const groupHeadings = await page.locator('div[class*="sc-fOFsAX kHRNIv"]').allTextContents();
    expect(groupHeadings).toContain('Austin City Limits');
    expect(groupHeadings).toContain('Ultra Musical Festival');
  });

  test('TC13: Each card displays RFP, Agreement, and Cut-Off Day (top right box)', async ({ page }) => {
    const cards = page.locator('div.sc-bmCFzp.kQijna');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);

      // Check RFP name is visible
      await expect(card.locator('.sc-lpbaSe.guyUPL')).toBeVisible();

      // Check "Agreement: <Type>" exists
      await expect(card.locator('.sc-bxjEGZ.coxujC')).toContainText('Agreement:');

      // Check Cut-Off Day (top right number) is present and valid
      const cutOffDay = await card.locator('.sc-cNFqVt.fkZjea div').textContent();
      expect(Number(cutOffDay?.trim())).toBeGreaterThan(0);
    }
  });

  test('TC14: Each event card has a "View Bookings" button', async ({ page }) => {
    const eventCards = page.locator('div[class*="sc-bmCFzp"]');
    const count = await eventCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = eventCards.nth(i);

      // Check that each card has a "View Bookings" button
      await expect(card.getByRole('button', { name: /View Bookings/ })).toBeVisible();
    }
  });

  test('TC15: View Bookings count matches modal entries', async ({ page }) => {
    const cards = page.locator('div.sc-bmCFzp.kQijna');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const viewBtn = card.locator('button.sc-kRZjnb.uEwrw');

      // Extract booking count from button text (e.g. "View Bookings (2)")
      const label = await viewBtn.textContent();
      const match = label?.match(/\((\d+)\)/);
      const expectedCount = match ? Number(match[1]) : 0;

      if (expectedCount > 0) {
        // Click the button to open the modal
        await expect(viewBtn).toBeVisible();
        await viewBtn.click({ force: true });

        // Wait for modal entries to appear and count them
        const modalEntries = page.locator('div.sc-dKKIkQ.dxQRDf');
        await expect(modalEntries.first()).toBeVisible();
        const actualCount = await modalEntries.count();

        // Compare the modal booking count with the button's label
        expect(actualCount).toBe(expectedCount);

        // Close the modal by clicking the "×" button next to the 'Bookings' title
        await page.locator('div').filter({ hasText: /^Bookings$/ }).getByRole('button').click();
      }
    }
  });
});
