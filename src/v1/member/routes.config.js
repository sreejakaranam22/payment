const { isClient } = require("../global/hasAccess");
const { isAuthenticated } = require("../global/isAuthenticated");
const memberController = require("./controllers/member.controller");

const router = require("express").Router();

router.post(
  "/members/create",
  [isAuthenticated, isClient],
  memberController.addMember
);
router.get(
  "/members",
  [isAuthenticated, isClient],
  memberController.getMembers
);
router.get("/member", [isAuthenticated, isClient], memberController.getMember);
router.put(
  "/members/update",
  [isAuthenticated, isClient],
  memberController.updateMember
);
router.delete(
  "/members/delete",
  [isAuthenticated, isClient],
  memberController.deleteMembers
);

module.exports = router;
