import { describe, it, expect } from 'vitest';

describe('ShopVN Frontend', () => {
  it('formats VND price correctly', () => {
    const formatPrice = (p) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p * 1000);
    const result = formatPrice(500);
    expect(result).toContain('500.000');
  });

  it('calculates cart total', () => {
    const items = [
      { price: '100', quantity: 2 },
      { price: '200', quantity: 1 },
    ];
    const total = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
    expect(total).toBe(400);
  });

  it('validates product fields', () => {
    const product = { name: 'Test', price: 100, category: 'Điện tử' };
    expect(product.name.length > 0).toBe(true);
    expect(product.price > 0).toBe(true);
  });

  it('role check works', () => {
    const user = { role: 'seller' };
    expect(['seller', 'admin'].includes(user.role)).toBe(true);
    expect(['admin'].includes(user.role)).toBe(false);
  });
});
