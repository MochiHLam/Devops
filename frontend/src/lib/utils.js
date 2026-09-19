/**
 * lib/utils.js — Shared frontend utilities
 */

/**
 * Format price: stored in thousands of VND
 * 500 → "500.000 ₫"
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price * 1000);

/**
 * Truncate text to n chars
 */
export const truncate = (str, n = 50) =>
  str?.length > n ? str.slice(0, n) + "…" : str;

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (dateStr, opts = {}) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opts,
  });

/**
 * Status label + Tailwind class mapping for orders
 */
export const ORDER_STATUS = {
  pending:   { label: "Chờ xác nhận", cls: "status-badge-pending" },
  confirmed: { label: "Đã xác nhận",  cls: "status-badge-confirmed" },
  shipping:  { label: "Đang giao",    cls: "status-badge-shipping" },
  delivered: { label: "Đã giao",      cls: "status-badge-delivered" },
  cancelled: { label: "Đã hủy",       cls: "status-badge-cancelled" },
};

export const PLACEHOLDER_IMG = "https://placehold.co/400x400/f5f5f5/aaa?text=No+Image";

export const CATEGORIES = [
  "Tất cả", "Điện tử", "Thời trang", "Nhà cửa",
  "Sách", "Thể thao", "Làm đẹp", "Thực phẩm", "Khác",
];
