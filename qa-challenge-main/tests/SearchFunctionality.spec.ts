import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Grouping all the search-related tests together
test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Just making sure the main page has loaded by checking for the header
    await page.waitForSelector('//h1[text()="Rooming List Management: Events"]');
  });

  test('TC01: Search input is displayed', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search');
    // Let's check that the search box actually shows up and you can type in it
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test('TC02 & TC03: Typing filters event list based on input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search');

    // Typing slowly here to mimic a real user and to make sure any debounce logic works
    await searchInput.type('Acc', { delay: 100 });

    // We should see these events pop up since they match what we typed
    await expect(page.getByText('ACL Executive Accommodations')).toBeVisible();
    await expect(page.getByText('Ultra DJ Accommodations')).toBeVisible();

    // And this one shouldn't show up because it doesn't match
    await expect(page.getByText('ACL Artist Housing')).not.toBeVisible();
  });

  test('TC04: Searching for a non-existent event shows no results message', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search');

    // Typing something random that shouldn't match anything
    await searchInput.type('xyz', { delay: 100 });

    // Now we should see the empty state message
    await expect(page.getByText('No rooming lists found')).toBeVisible();

    // The "Import Data" button should still be there, just in case
    await expect(page.getByRole('button', { name: 'Import Data' })).toBeVisible();

    // Let's reload the page to make sure the list comes back
    await page.reload();
    // await page.waitForSelector("//h1[normalize-space()='Rooming List Management: Events']");
    await expect(page.locator('//h1[text()="Rooming List Management: Events"]')).toBeVisible();
  });
});
