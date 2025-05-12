import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Not authorized to access this route'
                }
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            const user = await User.findOne({ id: decoded.id });

            if (!user) {
                return res.status(401).json({
                    status: false,
                    error: {
                        message: 'User not found'
                    }
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Not authorized to access this route'
                }
            });
        }
    } catch (error) {
        next(error);
    }
}; 