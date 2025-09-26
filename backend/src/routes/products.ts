import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  } from '../controllers/productsController';

const router = Router();

// GET all products
router.get('/', getProducts);

// GET a single product by id
router.get('/:id', getProductById);

// POST create a new product
router.post('/', createProduct);

// PUT update a product
router.put('/:id', updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);


export default router;