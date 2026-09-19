/**
 * utils/response.js — Standardized API response helpers
 */

const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const created = (res, data) => success(res, data, 201);

const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};

const notFound = (res, message = "Resource not found") => error(res, message, 404);

const forbidden = (res, message = "Insufficient permissions") => error(res, message, 403);

const unauthorized = (res, message = "Not authenticated") => error(res, message, 401);

const badRequest = (res, message) => error(res, message, 400);

module.exports = { success, created, error, notFound, forbidden, unauthorized, badRequest };
