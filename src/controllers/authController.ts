import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

// Generate JWT Token
const generateToken = (id: string): string => {
    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    };

    return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

// @desc    Register user
// @route   POST /v1/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'User already exists'
                }
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                },
                meta: {
                    access_token: token
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /v1/auth/signin
// @access  Public
export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Invalid credentials'
                }
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Invalid credentials'
                }
            });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                },
                meta: {
                    access_token: token
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /v1/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ id: req.user.id }).select('-password');

        res.json({
            status: true,
            content: {
                data: {
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                    created_at: user?.created_at
                }
            }
        });
    } catch (error) {
        next(error);
    }
}; 