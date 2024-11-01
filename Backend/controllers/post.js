const { File, Category, Post, User } = require("../models");

const addPost = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { title, desc, file, category } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ code: 404, status: false, message: "User not found" });
    }

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "File not found", });
      }
    }

        const isCategoryExist = await Category.findById(category);
        if (!isCategoryExist) {
          return res
            .status(404)
            .json({ code: 404, status: false, message: "Category not found" });
        }
     

    const newPost = new Post({ title, desc, file, category, updatedBy: _id });

    await newPost.save();

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Post have been posted successfully",
        data: newPost,
      });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { title, desc, file, category } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ code: 404, status: false, message: "User not found" });
    }

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "File not found" });
      }
    }

    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "Category not found" });
      }
    }

    const post = await Post.findById(id);
    if(!post) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "Category not found" });
    }

    post.title = title || post.title;
    post.desc = desc || post.desc;
    post.file = file || post.file;
    post.category = category || post.category;
    post.updatedBy = _id

    await post.save();

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Post have been updated successfully",
      });
  } catch (error) {
    next(error);
  }
};


const deletePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { _id } = req.user;

      const user = await User.findById(_id);
      if (!user) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "User not found" });
      }
  
  
      const post = await Post.findById(id);

      if(!post) {
          return res
            .status(404)
            .json({ code: 404, status: false, message: "Category not found" });
      }
  
  
      await Post.findByIdAndDelete(id);
  
      res
        .status(200)
        .json({
          code: 200,
          status: true,
          message: "Post have been Deleted successfully",
        });
    } catch (error) {
      next(error);
    }
  };
  

const getPosts = async (req, res, next) => {
    try {
      // Use req.query for query parameters (page, size, q)
      const { page = 1, size = 10, q } = req.query;
      
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(size) || 10;
  
      let query = {};
  
      // If 'q' is provided, build a search query using regex for title and desc
      if (q) {
        const search = new RegExp(q, 'i'); // Case-insensitive search
        query = { $or: [{ title: search }, { desc: search }] };
      }
  
      // Get total number of matching documents
      const total = await Post.countDocuments(query);
      const pages = Math.ceil(total / pageSize);
  
      // Retrieve posts with pagination and sort by updatedAt (descending)
      const posts = await Post.find(query).populate("file").populate("category").populate("updatedBy")
        .sort({ updatedAt: -1 }) // Sort by the most recent update (descending)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize); // Use pageSize for limiting posts per page
  
      // Send the response with posts, total, and pages information
      res.status(200).json({
        code: 200,
        status: true,
        message: "Post Page loaded successfully",
        data: { posts, total, pages }
      });
    } catch (error) {
      next(error);
    }
  };
  

const getPost = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    
    const user = await User.findById(_id);
    if (!user) {
      return res
       .status(404)
       .json({ code: 404, status: false, message: "User not found" });
        }
    
        const post = await Post.findById(id)
        .populate("file")           // Populates the 'file' field with related document data
        .populate("category")       // Populates the 'category' field with related document data
        .populate("updatedBy");     // Populates the 'updatedBy' field with related user data
    
    if(!post) {
      return res
       .status(404)
       .json({ code: 404, status: false, message: "Post not found" });
    }
    
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post loaded successfully",
      data: post
    });
    
  } catch (error) {
    next(error);
  }
    
}

module.exports = { addPost, updatePost, deletePost, getPosts, getPost };
