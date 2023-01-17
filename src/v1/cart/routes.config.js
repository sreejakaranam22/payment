const router = require("express").Router();
const { isAuthenticated } = require("../global/isAuthenticated");
const { isAdmin, isClient } = require("../global/hasAccess");
const cartController = require("./controllers/cart.controller");

router.delete(
  "/cart/remove-kit",
  [isAuthenticated, isClient],
  cartController.removeKit
);
router.post(
  "/cart/assign",
  [isAuthenticated, isClient],
  cartController.assignKit
);
router.post(
  "/cart/create",
  [isAuthenticated, isClient],
  cartController.createCart
);
router.post(
  "/cart/apply-coupon",
  [isAuthenticated, isClient],
  cartController.applyCoupon
);
router.get("/cart", [isAuthenticated, isClient], cartController.getCart);
// router.get("/products", productController.getProduct);
router.post("/coupon", [isAuthenticated, isAdmin], cartController.createCoupon);

module.exports = router;
