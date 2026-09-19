/**
 * utils/format.js — Shared formatting utilities
 */

/**
 * Format number as Vietnamese Dong
 * Note: price in DB is stored in thousands (500 = 500,000 VND)
 */
const formatVND = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price * 1000);
};

/**
 * Paginate an array (for mock/in-memory use)
 */
const paginate = (items, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);
  return {
    data,
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
  };
};

/**
 * Safe parse integer with fallback
 */
const safeInt = (val, fallback = 0) => {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Safe parse float with fallback
 */
const safeFloat = (val, fallback = 0) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
};

module.exports = { formatVND, paginate, safeInt, safeFloat };
