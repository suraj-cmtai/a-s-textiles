const {db} = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query } = require('firebase/firestore');

// Create a new product in Firestore
const createProduct = async (productData) => {
    try{
        const docRef = await addDoc(collection(db, "products"), productData);
        return { id: docRef.id, ...productData };
    }
    catch (error) {
        throw new Error("Error creating product: " + error.message);
    }
}

// Get all products from Firestore
const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return products;
    } catch (error) {
        throw new Error("Error fetching products: " + error.message);
    }
}

// Get a single product by ID from Firestore
const getProductById = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        const productDoc = await getDoc(productRef);

        if (!productDoc.exists()) {
            throw new Error("Product not found");
        }

        return { id: productDoc.id, ...productDoc.data() };
    } catch (error) {
        throw new Error("Error fetching product: " + error.message);
    }
}


// Update product data in Firestore
const updateProduct = async (productId, productData) => {
    try {
        const productRef = doc(db, "products", productId);
        await setDoc(productRef, productData, { merge: true });
        return { id: productId, ...productData };
    } catch (error) {
        throw new Error("Error updating product: " + error.message);
    }
}


// Delete a product from Firestore
const deleteProduct = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
        return { id: productId };
    } catch (error) {
        throw new Error("Error deleting product: " + error.message);
    }
}
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductByEmail,
    getProductByPhone,
    updateProduct,
    deleteProduct
};