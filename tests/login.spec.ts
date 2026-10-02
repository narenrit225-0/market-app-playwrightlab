import { test, expect, type Page } from '@playwright/test';

const ownerPhone = '0800000000';
const ownerPassword = 'uCrwVaBW39o_0G0Q5QwAVrqr';

function loginForm(page: Page) {
  return {
    phone: page.getByLabel('หมายเลขโทรศัพท์มือถือ'),
    password: page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร'),
    submit: page.getByRole('button', { name: 'เข้าสู่ระบบ' }),
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});


test('TC01 Login เจ้าของตลาดสำเร็จ', async ({ page }) => {
  const form = loginForm(page);

  await form.phone.fill(ownerPhone);
  await form.password.fill(ownerPassword);
  await form.submit.click();


  await expect(page.getByText('ยินดีต้อนรับ')).toBeVisible();
});

test('TC02 Login เจ้าของตลาดใส่เบอร์โทรผิด', async ({ page }) => {
  const form = loginForm(page);

  await form.phone.fill('0899999999');
  await form.password.fill(ownerPassword);
  await form.submit.click();


  await expect(page.getByRole('alert')).toBeVisible();
});

test('TC03 Login เจ้าของตลาดใส่ password ผิด', async ({ page }) => {
  const form = loginForm(page);

  await form.phone.fill(ownerPhone);
  await form.password.fill('wrong-password');
  await form.submit.click();

  await expect(page.getByRole('alert')).toBeVisible();
});

test('TC04 Login เจ้าของตลาด ไม่กรอกเบอร์โทรและรหัสผ่าน', async ({ page }) => {
  const form = loginForm(page);

  await form.submit.click();

  await expect.poll(() => form.phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await expect.poll(() => form.password.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับ' })).toBeVisible();
});

test('TC05 Login เจ้าของตลาด กรอกเบอร์โทรไม่ครบถ้วน (ไม่ครบ 10 หลัก)', async ({ page }) => {
  const form = loginForm(page);

  await form.phone.fill('0812345'); 
  await form.password.fill(ownerPassword);
  await form.submit.click();

  await expect(form.phone).toHaveValue('0812345');
  await expect.poll(() => form.phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับ' })).toBeVisible();
});

test('TC06 Login เจ้าของตลาด กรอกตัวอักษรในช่องเบอร์โทรศัพท์', async ({ page }) => {
  const form = loginForm(page);

  await form.phone.fill('abcdefghij');
  await form.password.fill(ownerPassword);
  await form.submit.click();

  await expect(form.phone).toHaveValue('abcdefghij');
  await expect.poll(() => form.phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับ' })).toBeVisible();
});
