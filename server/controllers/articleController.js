import articleModel from "../models/article.model.js";
import imagekit from "../config/imagekit.js";

// ===== GET ALL ARTICLES =====
export const getAllArticles = async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    let query = articleModel.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const articles = await query;

    res.status(200).json({
      success: true,
      data: articles,
      total: articles.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET ARTICLE BY SLUG =====
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await articleModel.findOne({ slug: req.params.slug });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET ARTICLE BY ID (ADMIN) =====
export const getArticleById = async (req, res) => {
  try {
    const article = await articleModel.findById(req.params.id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CREATE ARTICLE (ADMIN) =====
export const createArticle = async (req, res) => {
  try {
    let imageUrl = "";

    // Handle file upload
    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: `article-${Date.now()}-${req.file.originalname}`,
        folder: "/articles",
      });
      imageUrl = uploadResult.url;
    } else if (req.body.image) {
      // Allow passing image URL directly if not uploading file
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Generate slug from title if not provided
    let slug = req.body.slug;
    if (!slug) {
      slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Ensure slug is unique
    let existingArticle = await articleModel.findOne({ slug });
    if (existingArticle) {
      slug = `${slug}-${Date.now()}`;
    }

    const articleData = {
      ...req.body,
      image: imageUrl,
      slug,
    };

    const newArticle = await articleModel.create(articleData);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: newArticle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE ARTICLE (ADMIN) =====
export const updateArticle = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    // Handle new file upload
    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: `article-${Date.now()}-${req.file.originalname}`,
        folder: "/articles",
      });
      imageUrl = uploadResult.url;
    }

    const updateData = {
      ...req.body,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // If title changed, maybe regenerate slug? 
    // Usually better to keep slug stable for SEO, unless explicitly requested to change.
    // We will allow manual slug update if provided in body.

    const updatedArticle = await articleModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== DELETE ARTICLE (ADMIN) =====
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await articleModel.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
