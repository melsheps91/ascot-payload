import { test, expect } from '@playwright/test'

// Runs against the seeded content (`npm run seed`).
test.describe('Frontend', () => {
  test('homepage renders the hero', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/The Ascot Group/)
    await expect(page.locator('h1').first()).toHaveText('Fast paced, dynamic & ambitious.')
  })

  test('main menu links to every section', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const menu = page.getByRole('navigation', { name: 'Main' })
    for (const label of ['The Ascot Group', 'Portfolio', 'Andrew Scott', 'Community', 'Careers', 'News']) {
      await expect(menu.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('vacancies filter by keyword and link to the job', async ({ page }) => {
    await page.goto('http://localhost:3000/careers')

    await page.getByPlaceholder('Keywords').fill('researcher')
    const jobs = page.locator('.jobs .job')
    await expect(jobs).toHaveCount(1)
    await jobs.first().click()

    await expect(page.locator('h1')).toHaveText('Data Researcher')
    await expect(page.getByText('Apply for this role')).toBeVisible()
  })
})
