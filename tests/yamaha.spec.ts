import { test, expect } from '@playwright/test';

test.describe('yamaha.best homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with the expected page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Yamaha Hi-Fi/i);
    await expect(page).toHaveURL(/yamaha\.best\/?$/);
  });

  test('main navigation exposes Home, Products, About, and Find a Dealer', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Products', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeVisible();

    const dealerLink = nav.getByRole('link', { name: /Find a Dealer/i });
    await expect(dealerLink).toBeVisible();
    await expect(dealerLink).toHaveAttribute('href', /usa\.yamaha\.com/);
  });

  test('hero headline is shown and "Shop Now" navigates to /products', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Sound Beyond Perfection', level: 1 })
    ).toBeVisible();

    const shopNow = page.getByRole('link', { name: 'Shop Now', exact: true }).first();
    const ourStory = page.getByRole('link', { name: 'Our Story', exact: true }).first();
    await expect(shopNow).toBeVisible();
    await expect(ourStory).toBeVisible();

    await shopNow.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('shop-by-category grid lists all five categories', async ({ page }) => {
    const categories = ['Amplifiers', 'Speakers', 'Network Receivers', 'Turntables', 'Headphones'];
    for (const name of categories) {
      await expect(
        page.getByRole('link', { name: new RegExp(`^${name}`, 'i') }).first()
      ).toBeVisible();
    }
  });

  test('newsletter section shows an email input and a Subscribe button', async ({ page }) => {
    const subscribe = page.getByRole('button', { name: /Subscribe/i }).first();
    await subscribe.scrollIntoViewIfNeeded();
    await expect(subscribe).toBeVisible();

    const emailInput = page
      .locator('input[type="email"], input[placeholder*="mail" i], input[name*="mail" i]')
      .first();
    await expect(emailInput).toBeVisible();

    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });
});
