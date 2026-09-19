const { docClient, TABLE_NAME } = require("../config/dynamodb");
const { s3Client, BUCKET } = require("../config/s3");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const {
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// GET /api/products — list all (with optional category filter)
const listProducts = async (req, res) => {
  try {
    const { category, seller_id, search, limit = 50, lastKey } = req.query;

    let params = {
      TableName: TABLE_NAME,
      Limit: parseInt(limit),
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(
        Buffer.from(lastKey, "base64").toString()
      );
    }

    // Filter expressions
    const filters = [];
    const exprAttrNames = {};
    const exprAttrValues = {};

    if (category) {
      filters.push("category = :category");
      exprAttrValues[":category"] = category;
    }
    if (seller_id) {
      filters.push("seller_id = :seller_id");
      exprAttrValues[":seller_id"] = seller_id;
    }
    if (search) {
      exprAttrNames["#nm"] = "name";
      filters.push("contains(#nm, :search)");
      exprAttrValues[":search"] = search;
    }
    // Only show active products publicly
    filters.push("is_active = :is_active");
    exprAttrValues[":is_active"] = true;

    if (filters.length > 0) {
      params.FilterExpression = filters.join(" AND ");
      params.ExpressionAttributeValues = exprAttrValues;
      if (Object.keys(exprAttrNames).length > 0)
        params.ExpressionAttributeNames = exprAttrNames;
    }

    const result = await docClient.send(new ScanCommand(params));

    const response = { products: result.Items || [] };
    if (result.LastEvaluatedKey) {
      response.nextKey = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey)
      ).toString("base64");
    }

    res.json(response);
  } catch (err) {
    console.error("List products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { product_id: req.params.id } })
    );
    if (!result.Item) return res.status(404).json({ error: "Product not found" });
    res.json(result.Item);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// POST /api/products — seller only
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price || !category)
      return res.status(400).json({ error: "name, price, and category are required" });

    const product_id = uuidv4();
    const image_urls = [];

    // Upload images to S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `products/${product_id}/${uuidv4()}-${file.originalname}`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );
        const url = `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
        image_urls.push(url);
      }
    }

    const item = {
      product_id,
      name,
      description: description || "",
      price: parseFloat(price),
      stock: parseInt(stock || 0),
      category,
      image_urls,
      seller_id: req.user.id.toString(),
      seller_name: req.user.name || "",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    res.status(201).json(item);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// PUT /api/products/:id — seller owner or admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { product_id: id } })
    );
    if (!existing.Item) return res.status(404).json({ error: "Product not found" });

    // Only the seller who owns or admin can update
    if (
      req.user.role !== "admin" &&
      existing.Item.seller_id !== req.user.id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, description, price, stock, category, is_active } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    const exprParts = ["updated_at = :updated_at"];
    const exprValues = { ":updated_at": updates.updated_at };
    const exprNames = {};

    if (name !== undefined) { exprParts.push("#nm = :name"); exprNames["#nm"] = "name"; exprValues[":name"] = name; }
    if (description !== undefined) { exprParts.push("description = :desc"); exprValues[":desc"] = description; }
    if (price !== undefined) { exprParts.push("price = :price"); exprValues[":price"] = parseFloat(price); }
    if (stock !== undefined) { exprParts.push("stock = :stock"); exprValues[":stock"] = parseInt(stock); }
    if (category !== undefined) { exprParts.push("category = :cat"); exprValues[":cat"] = category; }
    if (is_active !== undefined) { exprParts.push("is_active = :active"); exprValues[":active"] = Boolean(is_active); }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { product_id: id },
        UpdateExpression: "SET " + exprParts.join(", "),
        ExpressionAttributeValues: exprValues,
        ...(Object.keys(exprNames).length > 0 && { ExpressionAttributeNames: exprNames }),
        ReturnValues: "ALL_NEW",
      })
    );

    res.json(result.Attributes);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { product_id: id } })
    );
    if (!existing.Item) return res.status(404).json({ error: "Product not found" });

    if (
      req.user.role !== "admin" &&
      existing.Item.seller_id !== req.user.id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { product_id: id } })
    );
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// GET /api/products/seller/mine — seller's own products
const myProducts = async (req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "seller_id = :sid",
        ExpressionAttributeValues: { ":sid": req.user.id.toString() },
      })
    );
    res.json({ products: result.Items || [] });
  } catch (err) {
    console.error("My products error:", err);
    res.status(500).json({ error: "Failed to fetch your products" });
  }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, myProducts };
