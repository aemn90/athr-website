const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.TEST_URL || 'http://localhost:3000';
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'artifacts/desktop.png' });
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.equal(await page.locator('.project-card').count(), 3);
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => image.getAttribute('loading') !== 'lazy').every(image => image.complete && image.naturalWidth > 0)), true);
    await page.locator('.filter-button').nth(1).click();
    assert.equal(await page.locator('.project-card').count(), 2);
    await page.locator('.filter-button').nth(2).click();
    assert.equal(await page.locator('.project-card').count(), 1);
    await page.locator('.filter-button').nth(0).click();
    await page.locator('.work-section .text-link').click();
    assert.equal(await page.locator('.project-card').count(), 4);
    await page.locator('.project-card').first().click();
    assert.equal(await page.getByRole('dialog').count(), 1);
    assert.ok((await page.locator('.case-heading').innerText()).includes('نواة'));
    await page.screenshot({ path: 'artifacts/project-dialog.png' });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    await page.locator('.work-section .text-link').click();
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'artifacts/work.png' });
    await page.locator('.service-action').nth(1).click();
    assert.equal(await page.locator('select[name="service"]').inputValue(), 'web');
    await page.locator('input[name="name"]').fill('اختبار الموقع');
    await page.locator('.project-form input[name="email"]').fill('ui-test@athar.example');
    await page.locator('input[name="company"]').fill('Quality assurance');
    await page.locator('select[name="budget"]').selectOption('10k-25k');
    await page.locator('textarea[name="message"]').fill('طلب تجريبي للتحقق من حفظ المشروع وتكامل قاعدة البيانات.');
    await page.locator('input[name="consent"]').check();
    await page.locator('.form-submit').click();
    await page.locator('.form-success').waitFor();
    const reference = await page.locator('.request-reference strong').innerText();
    assert.match(reference, /^ATH-\d+$/);
    console.log('Project request saved:', reference);
    await page.keyboard.press('Escape');
    await page.locator('#newsletter-email').fill('ui-newsletter@athar.example');
    await page.locator('.newsletter-input button').click();
    await page.locator('.newsletter-success').waitFor();
    const quote = await page.locator('blockquote').innerText();
    await page.getByRole('button', { name: 'الرأي التالي', exact: true }).click();
    assert.notEqual(await page.locator('blockquote').innerText(), quote);
    await page.locator('.faq-list summary').first().click();
    assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
    await page.getByRole('button', { name: 'الخصوصية', exact: true }).click();
    assert.equal(await page.getByRole('dialog').count(), 1);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Switch to English', exact: true }).click();
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
    assert.ok((await page.locator('h1').innerText()).includes('Bold ideas.'));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: 'artifacts/english.png' });
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) console.log('Overflow elements:', await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && e.getBoundingClientRect().left >= 0).map(e => ({ class: e.className, right: e.getBoundingClientRect().right })).slice(0, 20)));
      assert.ok(overflow <= 1, `English overflow at ${width}: ${overflow}px`);
    }
    await page.getByRole('button', { name: 'التبديل إلى العربية', exact: true }).click();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 1, `Arabic overflow at ${width}: ${overflow}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: 'artifacts/mobile.png' });
    await page.getByRole('button', { name: 'فتح القائمة', exact: true }).click();
    assert.equal(await page.locator('#mobile-nav').isVisible(), true);
    await page.locator('#mobile-nav a[href="#services"]').click();
    assert.equal(await page.locator('#mobile-nav').count(), 0);
    const health = await page.request.get(`${base}/api/health`);
    assert.equal(health.status(), 200);
    const invalid = await page.request.post(`${base}/api/projects`, { data: { name: 'x', email: 'invalid' } });
    assert.equal(invalid.status(), 400);
    const malformed = await page.request.post(`${base}/api/newsletter`, { data: { email: 'invalid' } });
    assert.equal(malformed.status(), 400);
    assert.deepEqual(errors, []);
    console.log('PASS: portfolio filters, project dialog, service selection, saved inquiry, newsletter, testimonials, FAQ, privacy, both languages, mobile menu, five responsive widths, validation and health.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
