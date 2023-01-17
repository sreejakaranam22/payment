const router = require("express").Router();
const { isClient } = require("../global/hasAccess");
const { isAuthenticated } = require("../global/isAuthenticated");
const addressController = require("./controllers/address.controller");

router.put(
  "/address/update",
  [isAuthenticated, isClient],
  addressController.updateAddress
);
router.delete(
  "/address/delete",
  [isAuthenticated, isClient],
  addressController.deleteAddress
);
router.post(
  "/address/create",
  [isAuthenticated, isClient],
  addressController.createAddress
);
router.get(
  "/addresses",
  [isAuthenticated, isClient],
  addressController.getAddresses
);
router.get(
  "/address",
  [isAuthenticated, isClient],
  addressController.getAddress
);

module.exports = router;
