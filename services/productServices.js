const {db} = require('../config/firebase');
const { 
    collection, 
    addDoc, 
    getDoc, 
    doc, 
    setDoc, 
    deleteDoc, 
    getDocs, 
    query,
    where,
    orderBy,
    limit,
    startAfter
} = require('firebase/firestore');

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

// Get all products with pagination, sorting, and filtering
const getProducts = async ({ page = 1, limit: pageLimit = 10, skip = 0, sortBy = 'title', sortOrder = 'asc', title = '', category = '' }) => {
    try {
        let productsRef = collection(db, "products");
        let queryConstraints = [];

        // Add filters if provided
        if (title) {
            // Firebase doesn't support case-insensitive search directly
            // Using startsWith for title search
            queryConstraints.push(where('title', '>=', title));
            queryConstraints.push(where('title', '<=', title + '\uf8ff'));
        }

        if (category) {
            queryConstraints.push(where('category', '==', category));
        }

        // Add sorting
        if (sortBy) {
            queryConstraints.push(orderBy(sortBy, sortOrder));
        }

        // Calculate skip based on page and limit
        const calculatedSkip = (page - 1) * pageLimit;

        // Build the base query
        let q = query(productsRef, ...queryConstraints);

        // Apply skip and pagination
        if (calculatedSkip > 0) {
            const skipSnapshot = await getDocs(query(q, limit(calculatedSkip)));
            const lastVisible = skipSnapshot.docs[skipSnapshot.docs.length - 1];
            if (lastVisible) {
                q = query(q, startAfter(lastVisible), limit(pageLimit));
            }
        } else {
            q = query(q, limit(pageLimit));
        }

        // Get documents
        const querySnapshot = await getDocs(q);
        
        // Get total count (Note: This is a separate query)
        const totalSnapshot = await getDocs(collection(db, "products"));
        const total = totalSnapshot.size;

        // Transform data
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));        // Calculate pagination details
        const totalPages = Math.ceil(total / pageLimit);
        const currentSkip = (page - 1) * pageLimit;

        // Return paginated result
        return {
            products,
            pagination: {
                total,
                page,
                limit: pageLimit,
                skip: currentSkip,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            filters: {
                title,
                category
            },
            sorting: {
                sortBy,
                sortOrder
            }
        };
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
        const updatedDoc = await getDoc(productRef);
        return { id: updatedDoc.id, ...updatedDoc.data() };
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
    updateProduct,
    deleteProduct
};