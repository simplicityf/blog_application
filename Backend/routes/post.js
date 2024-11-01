const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/isAuth");
const {postController} = require("../controllers");
const validate = require("../validators/validate");
const {addPostValidator, updatePostValidator, postIdValidator} = require("../validators/post")

//Adding Post
router.post("/add-post", isAuth, addPostValidator, validate, postController.addPost);

//Updating Post
router.put("/:id", isAuth, updatePostValidator, postIdValidator, validate, postController.updatePost);

//Delete Post
router.delete("/:id", isAuth, postIdValidator, validate, postController.deletePost);

//Get All Posts
router.get("/", isAuth, postController.getPosts);

//Get Single Post by id
router.get("/:id", isAuth, postIdValidator, validate, postController.getPost);

module.exports = router;