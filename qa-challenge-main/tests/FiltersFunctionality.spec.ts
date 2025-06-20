import { test, expect, Locator } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Filters Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Let's make sure the main page header is loaded before we do anything else
    await page.waitForSelector('text=Rooming List Management: Events');
  });

  test('TC05: The Filters button is visible', async ({ page }) => {
    // Just checking that the Filters button is actually there and easy to spot!
    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();
  });

  test('TC06: Clicking the Filters button opens the dropdown', async ({ page }) => {
    // Give the Filters button a click and see if the dropdown pops up
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForTimeout(1000); 
    await page.waitForSelector('text=RFP status'); // Looking for a filter label to confirm
  });

  test('TC07: Filter options are Active, Closed, and Cancelled', async ({ page }) => {
    // Let's open up the Filters dropdown and see what options we get
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForTimeout(500);

    // Making sure all the expected filter options are there
    await expect(page.getByTestId('active-checkbox')).toBeVisible();
    await expect(page.getByTestId('closed-checkbox')).toBeVisible();
    await expect(page.getByTestId('cancelled-checkbox')).toBeVisible();
  });

  test('TC08, TC09: Selecting and applying a filter updates the event list', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);

    // open the Filters dropdown
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.waitForTimeout(1000);

    // Grab all the checkboxes by their test IDs
    const activeCheckbox = page.getByTestId('active-checkbox');
    const closedCheckbox = page.getByTestId('closed-checkbox');
    const cancelledCheckbox = page.getByTestId('cancelled-checkbox');

    // Handy helper to check if a checkbox is ticked (SVG means checked)
    const isChecked = async (checkbox: Locator) => (await checkbox.locator('svg').count()) > 0;

    // Let's uncheck everything first, so we start with a clean slate
    for (const checkbox of [activeCheckbox, closedCheckbox, cancelledCheckbox]) {
      if (await isChecked(checkbox)) {
        await checkbox.click();
        await page.waitForTimeout(500);
      }
    }

    // Now, let's just check the Cancelled filter for this test
    await cancelledCheckbox.click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);

    // Let's make sure only cancelled events are showing up now
    const eventStatuses = await page.locator('div[class*="sc-fsj1ER"]').allTextContents();
    for (const status of eventStatuses) {
      expect(status.trim()).toBe('Cancelled');
    }
  });

  test('TC10: Selected filter persists after reopening the Filters dropdown', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click();

    const activeCheckbox = page.getByTestId('active-checkbox');
    const closedCheckbox = page.getByTestId('closed-checkbox');
    const cancelledCheckbox = page.getByTestId('cancelled-checkbox');

    // Helper to check if a checkbox is selected (SVG means checked)
    const isChecked = async (checkbox: Locator) => (await checkbox.locator('svg').count()) > 0;

    // Uncheck everything to start fresh
    for (const checkbox of [activeCheckbox, closedCheckbox, cancelledCheckbox]) {
      if (await isChecked(checkbox)) {
        await checkbox.click();
      }
    }

    // Let's pick Active and Closed filters
    await activeCheckbox.click();
    await closedCheckbox.click();

    // Save our choices
    await page.getByRole('button', { name: /save/i }).click();

    // Reopen the dropdown to see if our selections are still checked
    await page.getByRole('button', { name: 'Filters' }).click();

    // Both Active and Closed should still be checked, Cancelled should not
    await expect(activeCheckbox.locator('svg')).toHaveCount(1);
    await expect(closedCheckbox.locator('svg')).toHaveCount(1);
    await expect(cancelledCheckbox.locator('svg')).toHaveCount(0);
  });

  test('TC11: Multiple filters can be selected and deselected', async ({ page }) => {
  await page.getByRole('button', { name: 'Filters' }).click();

  const activeCheckbox = page.getByTestId('active-checkbox');
  const closedCheckbox = page.getByTestId('closed-checkbox');
  const cancelledCheckbox = page.getByTestId('cancelled-checkbox');

  const isChecked = async (checkbox: Locator) =>
    (await checkbox.locator('svg').count()) > 0;

  //Clear all filters
  for (const checkbox of [activeCheckbox, closedCheckbox, cancelledCheckbox]) {
    if (await isChecked(checkbox)) await checkbox.click();
  }

  //Select Active and Closed
  await activeCheckbox.click();
  await closedCheckbox.click();
  await page.getByRole('button', { name: /save/i }).click();

  //Validate both Active and Closed statuses are visible
  const eventStatuses = await page.locator('[class*="StatusBadge"]').allTextContents();
  const visibleStatuses = eventStatuses.map(s => s.trim());
  expect(visibleStatuses).toContain('Active');
  expect(visibleStatuses).toContain('Closed');

  //Reopen dropdown and deselect Closed
  await page.getByRole('button', { name: 'Filters' }).click();
  if (await isChecked(closedCheckbox)) await closedCheckbox.click();
  await page.getByRole('button', { name: /save/i }).click();

  //Validate only Active events remain
  const filteredStatuses = await page.locator('[class*="StatusBadge"]').allTextContents();
  for (const status of filteredStatuses) {
    expect(status.trim()).toBe('Active');
  }
});
}); 