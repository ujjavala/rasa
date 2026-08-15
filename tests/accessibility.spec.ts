import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const AAA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag2aaa',
  'wcag21a',
  'wcag21aa',
  'wcag21aaa',
  'wcag22a',
  'wcag22aa',
  'wcag22aaa',
  'best-practice',
];

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(AAA_TAGS).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test('landing page passes automated WCAG AAA rules', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoAxeViolations(page);
});

test('selected rasa experience passes automated WCAG AAA rules', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Madhura, sweet/i }).click();
  await expect(page.getByText(/Exploring Madhura/i)).toBeVisible();
  await expectNoAxeViolations(page);
});

test('all six selected rasa states pass automated WCAG AAA rules', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  for (const name of ['Madhura', 'Amla', 'Lavana', 'Katu', 'Tikta', 'Kashaya']) {
    await page.getByRole('button', { name: new RegExp(`${name},`, 'i') }).first().click();
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
  }
});

test('all field-note tabs pass automated WCAG AAA rules', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await page.getByRole('button', { name: /Madhura, sweet/i }).first().click();
  for (const tab of ['Dishes', 'Regions', 'Festivals', 'Spice Trail']) {
    await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
    await expectNoAxeViolations(page);
  }
});

test('keyboard journey can select and reset a rasa', async ({ page }) => {
  await page.goto('/');
  const sweet = page.getByRole('button', { name: /Madhura, sweet/i });
  await sweet.focus();
  await page.keyboard.press('Enter');
  await expect(sweet).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(sweet).toHaveAttribute('aria-pressed', 'false');
});

test('reduced motion removes non-essential animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const animationCount = await page.evaluate(() =>
    document.getAnimations().filter((animation) => animation.playState === 'running').length,
  );
  expect(animationCount).toBe(0);
});

test('content remains usable at 200 percent zoom', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /taste the map/i })).toBeVisible();
});

test('text spacing and narrow reflow do not cause document overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }';
    document.head.append(style);
  });
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
});

test('visible interactive targets meet the AAA 44 pixel target', async ({ page }) => {
  await page.goto('/');
  const undersized = await page.locator('a:visible, button:visible, select:visible, [role="tab"]:visible').evaluateAll((elements) =>
    elements
      .map((element) => ({ label: element.getAttribute('aria-label') ?? element.textContent?.trim(), rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
      .map(({ label, rect }) => ({ label, width: rect.width, height: rect.height })),
  );
  expect(undersized).toEqual([]);
});

test('guide commands respond without continuous idle animation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Madhura, sweet/i }).first().click();
  await page.getByRole('button', { name: /Scout/i }).click();
  await expect(page.getByText(/I found jaggery/i)).toBeVisible();
  await page.waitForTimeout(1100);
  const runningGuideAnimations = await page.locator('.tm-zone[data-selected="true"] .taste-guide__library-character').evaluate((element) =>
    element.getAnimations().filter((animation) => animation.playState === 'running').length,
  );
  expect(runningGuideAnimations).toBe(0);
});

test('manual motion control pauses decorative CSS animation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Pause motion/i }).click();
  await expect(page.locator('.shell')).toHaveAttribute('data-motion', 'paused');
  await expect(page.getByRole('button', { name: /Play motion/i })).toBeVisible();
});
