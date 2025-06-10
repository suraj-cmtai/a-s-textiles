const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    updateUserProfile,
    getCurrentUser,
    isAuthenticated
} = require('../services/authServices');
const { successResponse, errorResponse } = require('../utils/responseManager');

const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
        return errorResponse(res, new Error('Email, password, and name are required'), 'Validation failed', 400);
    }
    
    if (password.length < 6) {
        return errorResponse(res, new Error('Password must be at least 6 characters'), 'Validation failed', 400);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, new Error('Please provide a valid email address'), 'Validation failed', 400);
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return errorResponse(res, new Error('Email and password are required'), 'Validation failed', 400);
    }
    
    next();
};

const validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return errorResponse(res, new Error('Email is required'), 'Validation failed', 400);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, new Error('Please provide a valid email address'), 'Validation failed', 400);
    }
    
    next();
};

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userData = await registerUser(email, password, name);
        successResponse(res, userData, 'User registered successfully', 201);
    } catch (error) {
        const statusCode = error.message.includes('Email is already registered') ? 409 : 400;
        errorResponse(res, error, 'Registration failed', statusCode);
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await loginUser(email, password);
        
        // You might want to generate and send JWT token here
        // const token = generateJWT(userData.uid);
        // res.cookie('authToken', token, { httpOnly: true, secure: true });
        
        successResponse(res, userData, 'Login successful');
    } catch (error) {
        const statusCode = error.message.includes('No account found') || 
                          error.message.includes('Incorrect password') ? 401 : 400;
        errorResponse(res, error, 'Login failed', statusCode);
    }
});

// Logout user
router.post('/logout', async (req, res) => {
    try {
        const result = await logoutUser();
        
        // Clear any auth cookies/tokens if you're using them
        // res.clearCookie('authToken');
        
        successResponse(res, result, 'Logout successful');
    } catch (error) {
        errorResponse(res, error, 'Logout failed');
    }
});

// Reset password
router.post('/reset-password', validateEmail, async (req, res) => {
    try {
        const { email } = req.body;
        const result = await resetPassword(email);
        successResponse(res, result, 'Password reset email sent');
    } catch (error) {
        const statusCode = error.message.includes('No account found') ? 404 : 400;
        errorResponse(res, error, 'Password reset failed', statusCode);
    }
});

// Update user profile
router.put('/update-profile', async (req, res) => {
    try {
        const { displayName } = req.body;
        
        if (!displayName || displayName.trim() === '') {
            return errorResponse(res, new Error('Display name is required'), 'Validation failed', 400);
        }
        
        const userData = await updateUserProfile(displayName.trim());
        successResponse(res, userData, 'Profile updated successfully');
    } catch (error) {
        const statusCode = error.message.includes('No user logged in') ? 401 : 400;
        errorResponse(res, error, 'Profile update failed', statusCode);
    }
});

// Get current user info
router.get('/me', async (req, res) => {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return errorResponse(res, new Error('No user logged in'), 'Authentication required', 401);
        }
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        };
        
        successResponse(res, userData, 'User data retrieved successfully');
    } catch (error) {
        errorResponse(res, error, 'Failed to get user data');
    }
});

// Check authentication status
router.get('/status', async (req, res) => {
    try {
        const authenticated = await isAuthenticated();
        successResponse(res, { authenticated }, 'Authentication status retrieved');
    } catch (error) {
        errorResponse(res, error, 'Failed to check authentication status');
    }
});

// Refresh user data (useful after profile updates)
router.get('/refresh', async (req, res) => {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return errorResponse(res, new Error('No user logged in'), 'Authentication required', 401);
        }
        
        // Reload user to get fresh data
        await user.reload();
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        };
        
        successResponse(res, userData, 'User data refreshed successfully');
    } catch (error) {
        errorResponse(res, error, 'Failed to refresh user data');
    }
});

module.exports = router;