import { test, expect } from '@playwright/test';

test.describe('Visual Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    // Go to the main events page before each test
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Rooming List Management: Events');
  });

  // TC20 – Verify that each event group has a clear visual separator
  test('TC20: Event groups should have clear visual separators', async ({ page }) => {
    // Find all event group containers
    const eventGroups = page.locator('div.sc-fMGxnE.dqnWDz');
    const groupCount = await eventGroups.count();
    expect(groupCount).toBeGreaterThan(0);

    // Check that there is a visible gap (separator) between each group
    for (let i = 0; i < groupCount - 1; i++) {
      const currentGroup = eventGroups.nth(i);
      const nextGroup = eventGroups.nth(i + 1);
      // Get the bottom of the current group and the top of the next
      const currentBox = await currentGroup.boundingBox();
      const nextBox = await nextGroup.boundingBox();
      if (currentBox && nextBox) {
        // There should be a gap between groups (visual separator)
        const gap = nextBox.y - (currentBox.y + currentBox.height);
        expect(gap).toBeGreaterThan(0);
      }
    }
  });

  // TC21 – Verify the behavior when no events are available
  test('TC21: Empty state message should be displayed when no events are available', async ({ page }) => {
    // Use a search term that won't match anything to simulate no events
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('NONEXISTENT_EVENT_12345');
    await page.waitForTimeout(500);

    // The UI should show an empty state message
    const emptyState = page.locator('text=No rooming lists found');
    await expect(emptyState).toBeVisible();

    // There should be no event cards visible
    const eventCards = page.locator('div.sc-bpuAaX.jOKtSV');
    const cardCount = await eventCards.count();
    expect(cardCount).toBe(0);
  });

  // TC22 – Verify if search and filters work together
  test('TC22: Search and filters should work together correctly', async ({ page }) => {
    // Get the number of events before any filters/search
    const initialCards = page.locator('div.sc-bpuAaX.jOKtSV');
    const initialCount = await initialCards.count();

    // Apply a search filter
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('housing');
    await page.waitForTimeout(500);
    const afterSearchCards = page.locator('div.sc-bpuAaX.jOKtSV');
    const afterSearchCount = await afterSearchCards.count();

    // Open the filters dropdown and select the 'Active' filter
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForTimeout(500);
    const activeCheckbox = page.getByTestId('active-checkbox');
    await activeCheckbox.click();
    await page.waitForTimeout(500);
    // Save the filter selection
    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);

    // Check the number of events after applying both search and filter
    const finalCards = page.locator('div.sc-bpuAaX.jOKtSV');
    const finalCount = await finalCards.count();
    // The filtered count should never be more than before
    expect(finalCount).toBeLessThanOrEqual(afterSearchCount);
    expect(finalCount).toBeLessThanOrEqual(initialCount);

    // Clean up: clear search and reset all filters
    await searchInput.clear();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForTimeout(500);
    // Uncheck all filters (Active, Closed, Cancelled)
    const closedCheckbox = page.getByTestId('closed-checkbox');
    const cancelledCheckbox = page.getByTestId('cancelled-checkbox');
    const isChecked = async (checkbox: any) => (await checkbox.locator('svg').count()) > 0;
    for (const checkbox of [activeCheckbox, closedCheckbox, cancelledCheckbox]) {
      if (await isChecked(checkbox)) {
        await checkbox.click();
        await page.waitForTimeout(500);
      }
    }
    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(500);
  });

});
