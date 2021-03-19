const express = require("express");
const router = express.Router();
const { authentication } = require("../../middleware/authentication");
//dev upload
const { upload } = require("../../middleware/uploadFile");
//production upload
const { cloudUpload } = require("../../middleware/cloudinaryUpload");

//controller register & login
const { register, login, checkAuth } = require("../controller/auth");
//router auth register & login
router.post("/register", register);
router.post("/login", login);
router.get("/auth", authentication, checkAuth);

//constroller users
const {
  read: loadUsers,
  detail: loadUser,
  update: updateUser,
} = require("../controller/users");

//router users
router.get("/users", loadUsers);
router.get("/user/:id", loadUser);
router.patch("/user/:id", authentication, cloudUpload("avatar"), updateUser);

//controller parentCards
const {
  read: getParentCards,
  parentCardsByUser,
  readOne: getParentCard,
  create: createParentCard,
  delete: deleteParentCard,
  updateContent: updateContentParentCard,
  updateThumbnail: updateThumbnailParentCard,
} = require("../controller/parentCards");

//router parentCards
router.get("/parentCards", authentication, getParentCards);
router.get("/parentCards/:uploadBy", authentication, parentCardsByUser);
router.get("/parentCard/:id", authentication, getParentCard);
router.post(
  "/post-parentCard",
  authentication,
  cloudUpload("thumbnailParentCard"),
  createParentCard
);
router.delete("/delete-parentCard/:id", authentication, deleteParentCard);
router.patch(
  "/updateContent-parentCard/:id",
  authentication,
  updateContentParentCard
);
router.patch(
  "/updateThumbnail-parentCard/:id",
  authentication,
  cloudUpload("thumbnailParentCard"),
  updateThumbnailParentCard
);

//controller childCards
const {
  read: getChildCards,
  readOne: getChildCard,
  create: createChildCard,
  delete: deleteChildCard,
  updateContent: updateContentChildCard,
  updateThumbnail: updateThumbnailChildCard,
} = require("../controller/childCards");

//router childCards
router.get("/childCards", authentication, getChildCards);
router.get("/childCard/:id", authentication, getChildCard);
router.post(
  "/post-childCard",
  authentication,
  cloudUpload("thumbnailChildCard"),
  createChildCard
);
router.delete("/delete-childCard/:id", authentication, deleteChildCard);
router.patch(
  "/updateContent-childCard/:id",
  authentication,
  updateContentChildCard
);
router.patch(
  "/updateThumbnail-childCard/:id",
  authentication,
  cloudUpload("thumbnailChildCard"),
  updateThumbnailChildCard
);
//controller relations
const {
  read: getRelations,
  create: createRelations,
  delete: deleteRelations,
} = require("../controller/cardRelations");

//router relations
router.get("/relations", authentication, getRelations);
router.post("/post-relations", authentication, createRelations);
router.delete(
  "/delete-relations/:UserId/:ParentCardId/:ChildCardId",
  authentication,
  deleteRelations
);

module.exports = router;
