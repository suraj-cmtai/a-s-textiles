const {db} = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query } = require('firebase/firestore');

// Create a new productLead in Firestore
const createProductLead = async (productLeadData) => {
    try{
        const docRef = await addDoc(collection(db, "productLeads"), productLeadData);
        return { id: docRef.id, ...productLeadData };
    }
    catch (error) {
        throw new Error("Error creating productLead: " + error.message);
    }
}

// Get all productLeads from Firestore
const getProductLeads = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "productLeads"));
        const productLeads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return productLeads;
    } catch (error) {
        throw new Error("Error fetching productLeads: " + error.message);
    }
}

// Get a single productLead by ID from Firestore
const getProductLeadById = async (productLeadId) => {
    try {
        const productLeadRef = doc(db, "productLeads", productLeadId);
        const productLeadDoc = await getDoc(productLeadRef);

        if (!productLeadDoc.exists()) {
            throw new Error("ProductLead not found");
        }

        return { id: productLeadDoc.id, ...productLeadDoc.data() };
    } catch (error) {
        throw new Error("Error fetching productLead: " + error.message);
    }
}

// Get a single productLead by email from Firestore
const getProductLeadByEmail = async (email) => {
    try {
    const productLeadsRef = collection(db, "productLeads");
    const q = query(productLeadsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("ProductLead not found");
    }

    // Assuming emails are unique, get the first match
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new Error("Error fetching productLead by email: " + error.message);
    }
}

// Get a single productLead by phone number from Firestore
const getProductLeadByPhone = async (phone) => {
    try {
        const productLeadsRef = collection(db, "productLeads");
        const q = query(productLeadsRef, where("phone", "==", phone));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("ProductLead not found");
        }

        // Assuming phone numbers are unique, get the first match
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new Error("Error fetching productLead by phone: " + error.message);
    }
}

// Update productLead data in Firestore
const updateProductLead = async (productLeadId, productLeadData) => {
    try {
        const productLeadRef = doc(db, "productLeads", productLeadId);
        await setDoc(productLeadRef, productLeadData, { merge: true });
        return { id: productLeadId, ...productLeadData };
    } catch (error) {
        throw new Error("Error updating productLead: " + error.message);
    }
}


// Delete a productLead from Firestore
const deleteProductLead = async (productLeadId) => {
    try {
        const productLeadRef = doc(db, "productLeads", productLeadId);
        await deleteDoc(productLeadRef);
        return { id: productLeadId };
    } catch (error) {
        throw new Error("Error deleting productLead: " + error.message);
    }
}
module.exports = {
    createProductLead,
    getProductLeads,
    getProductLeadById,
    getProductLeadByEmail,
    getProductLeadByPhone,
    updateProductLead,
    deleteProductLead
};