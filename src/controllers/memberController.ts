import { Request, Response, NextFunction } from 'express';
import Member from '../models/Member';
import Community from '../models/Community';
import Role from '../models/Role';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Add member to community
// @route   POST /v1/member
// @access  Private
export const addMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { community, user, role } = req.body;

        // Check if community exists
        const communityExists = await Community.findOne({ id: community });
        if (!communityExists) {
            return res.status(404).json({
                status: false,
                error: {
                    message: 'Community not found'
                }
            });
        }

        // Get Community Admin role ID
        const adminRole = await Role.findOne({ name: 'Community Admin' });
        if (!adminRole) {
            return res.status(500).json({
                status: false,
                error: {
                    message: 'Community Admin role not found'
                }
            });
        }

        // Check if user is Community Admin
        const member = await Member.findOne({
            community,
            user: req.user.id,
            role: adminRole.id
        });

        if (!member) {
            return res.status(403).json({
                status: false,
                error: {
                    message: 'NOT_ALLOWED_ACCESS'
                }
            });
        }

        // Check if role exists
        const roleExists = await Role.findOne({ id: role });
        if (!roleExists) {
            return res.status(404).json({
                status: false,
                error: {
                    message: 'Role not found'
                }
            });
        }

        // Check if user is already a member
        const existingMember = await Member.findOne({ community, user });
        if (existingMember) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'User is already a member of this community'
                }
            });
        }

        // Add member
        const newMember = await Member.create({
            community,
            user,
            role
        });

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: newMember.id,
                    community: newMember.community,
                    user: newMember.user,
                    role: newMember.role,
                    created_at: newMember.created_at
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove member from community
// @route   DELETE /v1/member/:id
// @access  Private
export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Find member
        const member = await Member.findOne({ id });
        if (!member) {
            return res.status(404).json({
                status: false,
                error: {
                    message: 'Member not found'
                }
            });
        }

        // Get Community Admin and Moderator role IDs
        const [adminRole, moderatorRole] = await Promise.all([
            Role.findOne({ name: 'Community Admin' }),
            Role.findOne({ name: 'Community Moderator' })
        ]);

        if (!adminRole || !moderatorRole) {
            return res.status(500).json({
                status: false,
                error: {
                    message: 'Required roles not found'
                }
            });
        }

        // Check if user is Community Admin or Community Moderator
        const userMember = await Member.findOne({
            community: member.community,
            user: req.user.id,
            role: { $in: [adminRole.id, moderatorRole.id] }
        });

        if (!userMember) {
            return res.status(403).json({
                status: false,
                error: {
                    message: 'NOT_ALLOWED_ACCESS'
                }
            });
        }

        // Remove member using deleteOne
        await Member.deleteOne({ id });

        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
}; 