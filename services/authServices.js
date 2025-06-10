const { auth } = require('../config/firebase');
const { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} = require('firebase/auth');

// Register new user
const registerUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, {
            displayName: name
        });

        return {
            uid: user.uid,
            email: user.email,
            displayName: name,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        // Handle specific Firebase errors
        let errorMessage = "Registration failed: ";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "Email is already registered";
                break;
            case 'auth/weak-password':
                errorMessage += "Password is too weak";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email address";
                break;
            default:
                errorMessage += error.message;
        }
        throw new Error(errorMessage);
    }
};

// Login user
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        // Handle specific Firebase errors
        let errorMessage = "Login failed: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += "No account found with this email";
                break;
            case 'auth/wrong-password':
                errorMessage += "Incorrect password";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email address";
                break;
            case 'auth/user-disabled':
                errorMessage += "Account has been disabled";
                break;
            case 'auth/too-many-requests':
                errorMessage += "Too many failed attempts. Please try again later";
                break;
            default:
                errorMessage += error.message;
        }
        throw new Error(errorMessage);
    }
};

// Logout user
const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, message: "Logged out successfully" };
    } catch (error) {
        throw new Error("Logout failed: " + error.message);
    }
};

// Reset password
const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Password reset email sent" };
    } catch (error) {
        let errorMessage = "Password reset failed: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += "No account found with this email";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email address";
                break;
            default:
                errorMessage += error.message;
        }
        throw new Error(errorMessage);
    }
};

// Update user profile
const updateUserProfile = async (displayName) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        await updateProfile(user, {
            displayName: displayName,
        });

        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        throw new Error("Profile update failed: " + error.message);
    }
};

// Get current user
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

// Check if user is authenticated
const isAuthenticated = async () => {
    try {
        const user = await getCurrentUser();
        return user !== null;
    } catch (error) {
        return false;
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    updateUserProfile,
    getCurrentUser,
    isAuthenticated
};