import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';

// @desc    Create a role
// @route   POST /v1/role
// @access  Private
export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        // Check if role exists
        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'Role already exists'
                }
            });
        }

        // Create role
        const role = await Role.create({ name });

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: role.id,
                    name: role.name,
                    created_at: role.created_at,
                    updated_at: role.updated_at
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all roles
// @route   GET /v1/role
// @access  Public
export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await Role.find().sort({ created_at: -1 });

        res.json({
            status: true,
            content: {
                meta: {
                    total: roles.length,
                    pages: 1,
                    page: 1
                },
                data: roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    created_at: role.created_at,
                    updated_at: role.updated_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
}; 