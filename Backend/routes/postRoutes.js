const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const { protect } = require("../middleware");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router.get("/category/:categoryName", postController.getPostsByCategory);
router.get("/id/:id", postController.getPostById);

router.get("/:slug", postController.getPostBySlug);

router
  .route("/:id")
  .put(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
