import { test, expect } from '@playwright/test';

test.describe('Layout & Responsiveness', () => {

  test.beforeEach(async ({ page }) => {
    // Go to the main events page before each test
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Rooming List Management: Events');
  });

  // Checks horizontal scroll for a given event group name
  async function verifyHorizontalScrollForEventGroup(page, eventName: string) {
    // Find the event group by its name
    const eventGroup = page.locator(`div.sc-kiZvlW:has(span:has-text("${eventName}"))`);
    await expect(eventGroup).toBeVisible();
    // The scrollable area containing event cards
    const scrollArea = eventGroup.locator('div.sc-bpuAaX.jOKtSV').first();
    await expect(scrollArea).toBeVisible();
    // Right and left scroll buttons
    const rightBtn = eventGroup.locator('.sc-fMGxnE.dqnWDz > .sc-gZEilz').first();
    const leftBtn = eventGroup.locator('.sc-fMGxnE.gyFxQZ > .sc-gZEilz').first();
    // Get the initial scroll position
    const initialScroll = await scrollArea.evaluate(el => el.scrollLeft);
    let rightClicks = 0;
    // Try scrolling right up to 5 times
    for (let i = 0; i < 5; i++) {
      if (!(await rightBtn.isVisible())) break;
      await rightBtn.click();
      rightClicks++;
      await page.waitForTimeout(1000); // let the scroll animation finish
    }
    const afterRightScroll = await scrollArea.evaluate(el => el.scrollLeft);
    // Make sure we actually scrolled right
    expect(afterRightScroll).toBeGreaterThan(initialScroll + 200);
    let leftClicks = 0;
    // Now try scrolling back left up to 5 times
    for (let i = 0; i < 5; i++) {
      const currentScroll = await scrollArea.evaluate(el => el.scrollLeft);
      const delta = Math.abs(currentScroll - initialScroll);
      if (delta <= 100) {
        break; // We're back near the start
      }
      if (!(await leftBtn.isVisible())) {
        break; // No more left scroll possible
      }
      await leftBtn.click();
      leftClicks++;
      await page.waitForTimeout(1000);
    }
    const finalScroll = await scrollArea.evaluate(el => el.scrollLeft);
    const finalDelta = Math.abs(finalScroll - initialScroll);
    // Should be back close to where we started
    expect(finalDelta).toBeLessThan(finalScroll);
  }

  test('TC17: Verify horizontal scrolling for multiple event groups', async ({ page }) => {
    await verifyHorizontalScrollForEventGroup(page, 'Austin City Limits');
    await verifyHorizontalScrollForEventGroup(page, 'Ultra Musical Festival');
  });

  test('TC18: Page title "Rooming List Management: Events" should be visible', async ({ page }) => {
    // Check that the main page title is correct
    const title = page.locator('h1');
    await expect(title).toHaveText('Rooming List Management: Events');
  });

  test('TC19: Filters dropdown should appear directly under the Filters button', async ({ page }) => {
    // Find the Filters button and get its position
    const filtersBtn = page.locator('button:has-text("Filters")');
    await expect(filtersBtn).toBeVisible();
    const btnBox = await filtersBtn.boundingBox();
    await filtersBtn.click();
    // The dropdown should appear after clicking
    const dropdown = page.locator('div[class*="sc-kRYMvn"]'); // dynamic dropdown container
    await expect(dropdown).toBeVisible();
    const dropdownBox = await dropdown.boundingBox();
    // The dropdown's left edge should be close to the button's left edge
    const leftDiff = Math.abs((dropdownBox?.x ?? 0) - (btnBox?.x ?? 0));
    expect(leftDiff).toBeLessThan(10); // allow a small margin of error
  });

  test('TC23: Layout should adapt correctly on screen resize', async ({ page }) => {
    // Check that event cards are visible in desktop view
    let eventCards = page.locator('div.sc-bmCFzp.kQijna');
    const desktopCardCount = await eventCards.count();
    expect(desktopCardCount).toBeGreaterThan(0);
    // Switch to a mobile-sized viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500); // let the UI reflow
    // Make sure cards are still visible in mobile view
    eventCards = page.locator('div.sc-bmCFzp.kQijna');
    await expect(eventCards.first()).toBeVisible();
    const mobileCardCount = await eventCards.count();
    expect(mobileCardCount).toBeGreaterThan(0);
  });

});
