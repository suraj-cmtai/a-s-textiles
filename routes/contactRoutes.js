const express = require('express');
const {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../services/contactServices');
const { successResponse, errorResponse } = require('../utils/responseManager');

const router = express.Router();
// Create a new contact
router.post('/newContact', async (req, res) => {
    try {
        const contactData = req.body;
        const newContact = await createContact(contactData);
        successResponse(res, newContact, 'Contact created successfully', 201);
    } catch (error) {
        errorResponse(res, error, 'Error creating contact');
    }
});

// Get all contacts
router.get('/getallContacts', async (req, res) => {
    try {
        const contacts = await getContacts();
        successResponse(res, contacts, 'Contacts fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching contacts');
    }
});

// Get a single contact by ID
router.get('/getContact/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await getContactById(contactId);
        successResponse(res, contact, 'Contact fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching contact');
    }
});
// Get a single contact by email
router.get('/getContactByEmail/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const contact = await getContactByEmail(email);
        successResponse(res, contact, 'Contact fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching contact by email');
    }
});

// Get a single contact by phone
router.get('/getContactByPhone/:phone', async (req, res) =>{
    try {
        const phone = req.params.phone;
        const contact = await getContactByPhone(phone);
        successResponse(res, contact, 'Contact fetched successfully');
    } catch (error) {
        errorResponse(res, error, 'Error fetching contact by phone');
    }
});

// Update contact data
router.put('/updateContact/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactData = req.body;
        const updatedContact = await updateContact(contactId, contactData);
        successResponse(res, updatedContact, 'Contact updated successfully');
    } catch (error) {
        errorResponse(res, error, 'Error updating contact');
    }
});

// Delete a contact
router.delete('/deleteContact/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await deleteContact(contactId);
        successResponse(res, deletedContact, 'Contact deleted successfully');
    } catch (error) {
        errorResponse(res, error, 'Error deleting contact');
    }
});

module.exports = router;
