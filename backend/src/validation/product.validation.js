/**
 * validation/product.validation.js
 * Request validation for product endpoints
 */

const validateCreateProduct = (body) => {
  const errors = [];
  const { name, price, category } = body;

  if (!name || name.trim().length < 2)
    errors.push("Product name must be at least 2 characters");

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)
    errors.push("Price must be a positive number");

  const validCategories = ["Điện tử", "Thời trang", "Nhà cửa", "Sách", "Thể thao", "Làm đẹp", "Thực phẩm", "Khác"];
  if (!category || !validCategories.includes(category))
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);

  return errors;
};

const validateUpdateProduct = (body) => {
  const errors = [];
  const { price, stock } = body;

  if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0))
    errors.push("Price must be a positive number");

  if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0))
    errors.push("Stock must be a non-negative integer");

  return errors;
};

module.exports = { validateCreateProduct, validateUpdateProduct };
