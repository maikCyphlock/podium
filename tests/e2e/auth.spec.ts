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

  test('should display register form with all required fields', async ({ page }) => {
    await page.goto('/register');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify the page title
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
    
    // Check for the back link
    await expect(page.getByRole('link', { name: /volver/i })).toBeVisible();
    
    // Verify form fields are present using their IDs
    await expect(page.getByLabel(/nombre completo/i)).toBeVisible();
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    
    // Verify the submit button
    await expect(page.getByRole('button', { name: /crear cuenta/i })).toBeVisible();
    
    // Verify terms and privacy links
    await expect(page.getByRole('link', { name: /términos de servicio/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /política de privacidad/i })).toBeVisible();
  });

  test('should display login form with all required fields', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify the page title
    await expect(page.getByRole('heading', { name: /inicia sesión en podium/i })).toBeVisible();
    
    // Verify form fields are present using their labels
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    
    // Verify the submit button
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
    
    // Verify the description text
    await expect(page.getByText(/ingresa tus credenciales para acceder a tu cuenta/i)).toBeVisible();
  });

  test('should navigate to register page from CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find and click the first "Comenzar Ahora" button in the hero section
    const heroCTAButton = page.getByRole('link', { name: /comenzar ahora/i }).first();
    await expect(heroCTAButton).toBeVisible();
    
    // Click the button and wait for navigation
    await Promise.all([
      page.waitForURL(/.*register/),
      heroCTAButton.click()
    ]);
    
    // Verify we're on the register page
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
    
    // Go back to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click the second "Comenzar Ahora" button in the CTA section
    const ctaSectionButton = page.getByRole('link', { name: /comenzar ahora/i }).nth(1);
    await expect(ctaSectionButton).toBeVisible();
    
    // Click the button and wait for navigation
    await Promise.all([
      page.waitForURL(/.*register/),
      ctaSectionButton.click()
    ]);
    
    // Verify we're on the register page again
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
  });
});
