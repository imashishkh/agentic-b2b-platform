import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import mongoose from 'mongoose';

// Get all products with filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      subCategory,
      manufacturerId,
      minPrice,
      maxPrice,
      currency = 'USD',
      search,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    if (manufacturerId) {
      filter.manufacturerId = new mongoose.Types.ObjectId(manufacturerId as string);
    }

    if (minPrice) {
      filter['price.amount'] = { $gte: Number(minPrice) };
    }

    if (maxPrice) {
      filter['price.amount'] = { ...filter['price.amount'], $lte: Number(maxPrice) };
    }

    if (currency) {
      filter['price.currency'] = currency;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort
    const sortOptions: any = {};
    sortOptions[sort as string] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('manufacturerId', 'name location.country');

    // Count total
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get a single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('manufacturerId', 'name description location contactInformation certifications');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create a new product
export const createProduct = async (req: Request & { user?: any }, res: Response) => {
  try {
    const productData: Partial<IProduct> = req.body;
    
    // Set manufacturer ID from authenticated user's company
    productData.manufacturerId = new mongoose.Types.ObjectId(req.user.companyId);
    
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update a product
export const updateProduct = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find product and check ownership
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user owns the product (is from the manufacturer company)
    if (product.manufacturerId.toString() !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find product and check ownership
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user owns the product
    if (product.manufacturerId.toString() !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    // Soft delete (set isActive to false)
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get related products
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Find products in same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true
    })
      .limit(Number(limit))
      .populate('manufacturerId', 'name');
    
    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message
    });
  }
};

// Get product categories
export const getProductCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(c => ({ category: c._id, count: c.count }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product categories',
      error: error.message
    });
  }
};

// Get product subcategories by category
export const getProductSubcategories = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    const subcategories = await Product.aggregate([
      { $match: { category, isActive: true } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories.map(s => ({ subCategory: s._id, count: s.count }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product subcategories',
      error: error.message
    });
  }
};