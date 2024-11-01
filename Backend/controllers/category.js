const { Category, User } = require("../models");

//Function for adding categories
const addCategory = async (req, res, next) => {
  try {
    const { _id } = req.user; // Get the user ID from the request
    const { title, desc, file } = req.body; // Get title and description from the request body

    const isCategoryExit = await Category.findOne({ title });

    // Check if a category with the given title already exists
    if (isCategoryExit) {
      res.code = 409;
      throw new Error("Category already exixts");
    }

    //Check if user exists
    const user = await User.findById({ _id });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    //Adding new category
    const newCategory = new Category({ title, desc, file, updatedBy: user.email });
    await newCategory.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Category added successfully",
        data: {newCategory, file},
      });
  } catch (error) {
    next(error);
  }
};

//Function for updating Categories
const updateCategory = async (req, res, next) => {
  try{
    const { id } = req.params;  // Extract category ID from URL parameters
    const { _id } = req.user;   // Extract user ID from request
    const { title, desc, file } = req.body;  // Extract title and description from the request body

    //Check if category exist
    const category = await Category.findById(id);
    if(!category){
      res.code = 404;
      throw new Error("Category not found");
    }

     // Check if a category with the same title already exists (excluding the current category)
     const isCategoryExist = await Category.findOne({ title });
     if (isCategoryExist && isCategoryExist._id.toString() !== category._id.toString()) {
       return res.status(400).json({
         code: 400,
         status: false,
         message: "Category with this title already exists",
       });
     }

     const user = await User.findById(_id);
 
    //Update the Category field
    category.title = title ? title : category.title; // Update title if provided, otherwise keep the old title
    category.desc = desc || category.desc; // Update description if provided
    category.file = file || category.file;
    category.updatedBy = user.email;  // Update user who made the change

    //Save updated category
    await category.save();
    res.status(200).json({code: 200, status: true, message:"Category updated successfully", data: category});
  } catch(error) {
    next(error);
  }
}

//Controller function of Deleting categories
const deleteCtegory = async (req, res, next) => {
  try {
    const { id } = req.params;  // Extract category ID from URL parameters

    //Search the category using the category ID
    const category = await Category.findById(id);

    //If category does not exists
    if(!category) {
      res.code = 404;
      throw new Error("Category not found")
    }

    //Deleting category if it exist
    await Category.findByIdAndDelete(id);

    res.status(200).json({code: 200, status: true, message: "Category Deleted Successfully"});
  } catch(error) {
    next(error);
  }
}

// Controller function to get categories with optional search and pagination
const getCategories = async (req, res, next) => {
  try {
    // Extract query string 'q', 'size', and 'page' from the request query parameters
    const { q, size, page } = req.query;

    // Initialize an empty query object (for search)
    let query = {};

    // Convert size and page to integers with default values (size: 10, page: 1)
    const sizeNumber = parseInt(size) || 10;
    const pageNumber = parseInt(page) || 1;

    // If 'q' exists, create a case-insensitive regular expression to search
    // in both 'title' and 'desc' fields of the Category collection
    if (q) {
      const search = new RegExp(q, 'i');  // 'i' flag makes the search case-insensitive
      // Use the $or operator to match either 'title' or 'desc' fields
      query = { $or: [{ title: search }, { desc: search }] };
    }

    // Get the total count of documents matching the query (for pagination)
    const total = await Category.countDocuments(query);

    // Calculate the total number of pages
    const pages = Math.ceil(total / sizeNumber);

    // Fetch categories based on the query, apply pagination and sorting
    const categories = await Category.find(query)
      .skip((pageNumber - 1) * sizeNumber) // Skip documents based on the page number
      .limit(sizeNumber)  // Limit the number of documents returned to the size
      .sort({ updatedAt: -1 });  // Sort by 'updatedAt' field in descending order

    // Respond with the fetched categories, total count, and pagination details
    res.status(200).json({
      code: 200,
      status: true,
      message: "Categories fetched successfully",
      data: categories,   // Fetched categories
      total,              // Total number of matching categories
      pages,              // Total number of pages
      currentPage: pageNumber // Current page number
    });
  } catch (error) {
    // Pass any errors to the next middleware (could be an error handler)
    next(error);
  }
};

//Controller Function for getting Single category
const getCategory = async (req, res, next) => {
  try{
    const { id } = req.params;  // Extract category ID from URL parameters
    
    //Search the category using the category ID
    const category = await Category.findById(id);
    
    //If category does not exists
    if(!category) {
      res.code = 404;
      throw new Error("Category not found")
    }
    
    //Respond with the fetched category
    res.status(200).json({code: 200, status: true, message: "Category fetched successfully", data: category});
  } catch(error) {
    next(error);
  }
}


module.exports = { addCategory, updateCategory, deleteCtegory, getCategories, getCategory };
