// e2e/audio.spec.ts
import { test, expect } from '@playwright/test';

test('autoplay é bloqueado até gesto do usuário', async ({ page }) => {
  await page.goto('/');
  // Aguarda render do Player
  await expect(page.getByRole('button', { name: /play/i })).toBeVisible();

  // Sem clicar, AudioContext deve continuar suspenso
  const state = await page.evaluate(() => window.__mixer?.state);
  expect(state).toBe('suspended');
});

test('clique em Play chama resume() e inicia fontes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /play/i }).click();

  const state = await page.evaluate(() => window.__mixer?.state);
  const count = await page.evaluate(() => window.__mixer?.sourceCount ?? 0);

  expect(state).toBe('running');
  expect(count).toBeGreaterThan(0);
});

test('Stop para tudo e zera sources', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /play/i }).click();
  await page.getByRole('button', { name: /stop/i }).click();

  const count = await page.evaluate(() => window.__mixer?.sourceCount ?? -1);
  expect(count).toBe(0);
});

test('Slider altera ganho (ex.: rain)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /play/i }).click();

  const sliders = page.getByRole('slider');
  await sliders.nth(1).fill('0.25');

  const gains = await page.evaluate(() => window.__mixer?.gainsValues);
  expect(gains?.rain).toBeCloseTo(0.25, 2);
});
