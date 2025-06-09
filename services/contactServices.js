const {db} = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

// Create a new contact in Firestore
const createContact = async (contactData) => {
    try{
        const docRef = await addDoc(collection(db, "contacts"), contactData);
        return { id: docRef.id, ...contactData };
    }
    catch (error) {
        throw new Error("Error creating contact: " + error.message);
    }
}

// Get all contacts from Firestore
const getContacts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "contacts"));
        const contacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return contacts;
    } catch (error) {
        throw new Error("Error fetching contacts: " + error.message);
    }
}

// Get a single contact by ID from Firestore
const getContactById = async (contactId) => {
    try {
        const contactRef = doc(db, "contacts", contactId);
        const contactDoc = await getDoc(contactRef);

        if (!contactDoc.exists()) {
            throw new Error("Contact not found");
        }

        return { id: contactDoc.id, ...contactDoc.data() };
    } catch (error) {
        throw new Error("Error fetching contact: " + error.message);
    }
}


// Update contact data in Firestore
const updateContact = async (contactId, contactData) => {
    try {
        const contactRef = doc(db, "contacts", contactId);
        await setDoc(contactRef, contactData, { merge: true });
        return { id: contactId, ...contactData };
    } catch (error) {
        throw new Error("Error updating contact: " + error.message);
    }
}


// Delete a contact from Firestore
const deleteContact = async (contactId) => {
    try {
        const contactRef = doc(db, "contacts", contactId);
        await deleteDoc(contactRef);
        return { id: contactId };
    } catch (error) {
        throw new Error("Error deleting contact: " + error.message);
    }
}
module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};