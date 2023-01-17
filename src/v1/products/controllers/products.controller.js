const Products = require("../models");
const { createProductValidator } = require("../validators");
const BadRequestError = require("../../../errors/bad-request");

/**
 * Update a healthkit product
 * @method PUT
 * @api /products/update
 * @access admin
 */
exports.updateProduct = async (req, res) => {
  const product = await Products.findOne({ _id: req.body.productId });
  if (!product) throw new BadRequestError("Invalid productId");

  const { error, value } = createProductValidator(req.body.product);
  if (error) throw new BadRequestError(error.message);

  await Products.findByIdAndUpdate(req.body.productId, value);

  return res.json({
    status: "success",
    message: "HealthKit updated",
  });
};

/**
 * Add a healthkit product
 * @method POST
 * @api /products/create
 * @access admin
 */
exports.createProduct = async (req, res) => {
  const { error, value } = createProductValidator(req.body);
  if (error) throw new BadRequestError(error.message);
  await Products.create(value);
  return res.status(201).json({
    status: "success",
    message: "New HealthKit created",
  });
};

/**
 * Get all healthkit product
 * @method GET
 * @api /products/get
 * @access public
 */
exports.getProducts = async (req, res) => {
  let products = null;
  if (req.user?.role === "admin") {
    products = await Products.find();
  } else {
    products = await Products.find(
      { is_active: true },
      { is_active: 0, quantity: 0 }
    );
  }

  return res.json({
    status: "success",
    message: "All HealthKits",
    data: products,
  });
};

/**
 * Get a healthkit product details
 * @method GET
 * @api /products/details
 * @access public
 */
exports.getProductDetails = async (req, res) => {
  const product = await Products.findById(req.query.productId);
  if (!product) throw new BadRequestError("Invalid productId");

  return res.json({
    status: "success",
    message: "All HealthKits",
    data: product,
  });
};

/**
 * delte a product
 * @method DELETE
 * @api /products/delete
 * @access admin
 */
exports.deleteProduct = async (req, res) => {
  const product = await Products.findOne({ _id: req.body.productId });

  if (!product) throw new BadRequestError("Invalid Product ID");
  product.is_active = false;

  await product.save();

  return res.json({
    status: "success",
    message: "Product Deleted",
  });
};
