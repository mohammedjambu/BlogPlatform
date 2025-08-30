const Post = require("../models/postModel");

module.exports.createPost = async (req, res) => {
  try {
    const { title, markdownContent, categories, author } = req.body;
    if (!title || !markdownContent) {
      return res
        .status(400)
        .json({ message: "Please provide a title and content for the post" });
    }
    const newPost = await Post.create({
      title,
      markdownContent,
      categories,
      author,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page.

    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit), // Calculate total pages.
      totalPosts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

module.exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
   
    const categoryName = req.params.categoryName;

    const posts = await Post.find({ categories: categoryName })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: `Invalid post ID Format: ${req.params.id}` });
    }

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: `Validation Error: ${req.params.id}` });
    }

    res
      .status(500)
      .json({ message: "Error Updating posts", error: error.message });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (deletedPost) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: `Invalid post ID format: ${req.params.id}` });
    }
    res
      .status(500)
      .json({ message: "Error Deleting posts", error: error.message });
  }
};
