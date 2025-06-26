import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test('should navigate to the login page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Look for the login link in the navbar and wait for it to be visible
    const loginLink = page.getByRole('link', { name: /ingresar/i });
    await expect(loginLink).toBeVisible();
    
    // Click the link and wait for navigation
    await Promise.all([
      page.waitForURL(/.*login/),
      loginLink.click()
    ]);
    
    await expect(page.getByRole('heading', { name: /inicia sesión en podium/i })).toBeVisible();
  });

  test('should navigate to the register page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Look for the register link in the navbar and wait for it to be visible
    const registerLink = page.getByRole('link', { name: /registrarse/i });
    await expect(registerLink).toBeVisible();
    
    // Click the link and wait for navigation
    await Promise.all([
      page.waitForURL(/.*register/),
      registerLink.click()
    ]);
    
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
  });
});
