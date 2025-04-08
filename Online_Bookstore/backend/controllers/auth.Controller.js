import { User } from "../models/userSchema.js";
import jwt from 'jsonwebtoken';

// Global token generation function
const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

export const register = async (req, res) => {
    try {
        const { username:name, email, password } = req.body;
        
        // Validate name length
        if (name.length < 3) {
            return res.status(400).json({ 
                message: 'Name must be at least 3 characters long' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address' 
            });
        }

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({  // 409 Conflict is more appropriate for existing resources
                message: 'Email already registered. Please use a different email.'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Generate profile image
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

        // Create and save user
        const user = new User({ 
            name, 
            email, 
            password, 
            profilePicture: profileImage 
        });

        console.log(user)
        
        await user.save();

        // Generate token for the new user
        const token = generateAuthToken(user._id);

        // Return success response with token and user data
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'An error occurred during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({  // 401 Unauthorized is more appropriate for auth failures
                message: 'Invalid email or password' 
            });
        }

        const isMatch = await user.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const token = generateAuthToken(user._id);

        res.json({ 
            message: 'Login successful',
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                profilePicture: user.profilePicture 
            } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'An error occurred during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};