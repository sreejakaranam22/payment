const router = require("express").Router();
const { isAdmin } = require("../global/hasAccess");
const { isAuthenticated } = require("../global/isAuthenticated");
const productController = require("./controllers/products.controller");

router.post(
  "/products/create",
  [isAuthenticated, isAdmin],
  productController.createProduct
);
router.delete(
  "/products/delete",
  [isAuthenticated, isAdmin],
  productController.deleteProduct
);
router.get("/products", productController.getProducts);
router.get("/products/details", productController.getProductDetails);
router.put(
  "/products/update",
  [isAuthenticated, isAdmin],
  productController.updateProduct
);

module.exports = router;
