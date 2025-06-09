const express = require('express');
const {
    createProductLead,
    getProductLeads,
    getProductLeadById,
    updateProductLead,
    deleteProductLead
} = require('../services/productLeadsServices');
const { successResponse, errorResponse } = require('../utils/responseManager');

const router = express.Router();
// Create a new productLead
router.post('/newProductLead', async (req, res) => {
    try {
        const productLeadData = req.body;
        const newProductLead = await createProductLead(productLeadData);
        successResponse(res, newProductLead, 'ProductLead created successfully', 201);
    } catch (error) {
        errorResponse(res, error, 'Error creating productLead');
    }
});

// Get all productLeads
router.get('/getallProductLeads', async (req, res) => {
    try {
        const productLeads = await getProductLeads();
        successResponse(res, productLeads, 'ProductLeads fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching productLeads');
    }
});

// Get a single productLead by ID
router.get('/getProductLead/:id', async (req, res) => {
    try {
        const productLeadId = req.params.id;
        const productLead = await getProductLeadById(productLeadId);
        successResponse(res, productLead, 'ProductLead fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching productLead');
    }
});


// Update productLead data
router.put('/updateProductLead/:id', async (req, res) => {
    try {
        const productLeadId = req.params.id;
        const productLeadData = req.body;
        const updatedProductLead = await updateProductLead(productLeadId, productLeadData);
        successResponse(res, updatedProductLead, 'ProductLead updated successfully');
    } catch (error) {
        errorResponse(res, error, 'Error updating productLead');
    }
});

// Delete a productLead
router.delete('/deleteProductLead/:id', async (req, res) => {
    try {
        const productLeadId = req.params.id;
        const deletedProductLead = await deleteProductLead(productLeadId);
        successResponse(res, deletedProductLead, 'ProductLead deleted successfully');
    } catch (error) {
        errorResponse(res, error, 'Error deleting productLead');
    }
});

module.exports = router;
