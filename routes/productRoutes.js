const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../services/productServices');
const { successResponse, errorResponse } = require('../utils/responseManager');


const { UploadImage, ReplaceImage } = require('../controller/imageController');

const router = express.Router();
// Create a new product
router.post('/newProduct', async (req, res) => {
    try {
        const productData = req.body;
        console.log(req.body);
        const image = req.files && req.files.image ? req.files.image : null;

   console.log('Received product data:', productData);
        console.log('Received image:', image);
        // Upload image if provided
        let imageUrl = null;
        if (image) {
            imageUrl = await UploadImage(image);
            console.log('Image uploaded successfully:', imageUrl);
            productData.imageUrl = imageUrl;
        }
        
        const newProduct = await createProduct(productData);
        successResponse(res, newProduct, 'Product created successfully', 201);
    } catch (error) {
        errorResponse(res, error, 'Error creating product');
    }
});

// Get all products
router.get('/getallProducts', async (req, res) => {
    try {
        const products = await getProducts();
        successResponse(res, products, 'Products fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching products');
    }
});

// Get a single product by ID
router.get('/getProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getProductById(productId);
        successResponse(res, product, 'Product fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching product');
    }
});

// Update product data
router.put('/updateProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productData = req.body;
        console.log('Received update data:', productData);

        const image = req.files && req.files.image ? req.files.image : null;
        console.log('Received image:', image);

         // Upload image if provided
        let imageUrl = null;
        if (image) {
            imageUrl = await UploadImage(image);
            console.log('Image uploaded successfully:', imageUrl);
            productData.imageUrl = imageUrl;
        }

        const updatedProduct = await updateProduct(productId, productData);
        successResponse(res, updatedProduct, 'Product updated successfully');
    } catch (error) {
        errorResponse(res, error, 'Error updating product');
    }
});


// Delete a product
router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await deleteProduct(productId);
        successResponse(res, deletedProduct, 'Product deleted successfully');
    } catch (error) {
        errorResponse(res, error, 'Error deleting product');
    }
});

module.exports = router;

