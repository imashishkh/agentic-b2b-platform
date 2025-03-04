import express from 'express';
import * as productController from '../controllers/productController';
import { authenticate, authorize } from '../../lib/auth/authServices';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getProductCategories);
router.get('/categories/:category/subcategories', productController.getProductSubcategories);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Protected routes
router.post('/', authenticate, authorize(['admin', 'manager']), productController.createProduct);
router.put('/:id', authenticate, authorize(['admin', 'manager']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin', 'manager']), productController.deleteProduct);

export default router;