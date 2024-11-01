const express = require("express");
const router = express.Router();
const {categoryController} = require("../controllers")
const validate = require("../validators/validate");
const {isAuth, isAdmin} = require("../middleware");
const{ addCategoryValidator, idVAlidator } = require("../validators/category");

// Add new category
router.post("/", isAuth, isAdmin, addCategoryValidator, validate, categoryController.addCategory);

//Update Category
router.put("/:id", isAuth, isAdmin, idVAlidator, validate, categoryController.updateCategory);

// Delete Category
router.delete("/:id", isAuth, isAdmin, categoryController.deleteCtegory);

// Get all categories
router.get("/", isAuth, categoryController.getCategories);

// Get single category by id

router.get("/:id", isAuth, idVAlidator, validate, categoryController.getCategory);

module.exports = router;