import { Request, Response, NextFunction } from 'express';
import { Snowflake } from '@theinternetfolks/snowflake';
import Community, { ICommunity } from '../models/Community';
import Member, { IMember } from '../models/Member';
import Role from '../models/Role';
import User from '../models/User';
import { Document } from 'mongoose';

interface AuthRequest extends Request {
    user?: any;
}

// Define types for populated documents
type PopulatedCommunity = Omit<ICommunity, 'owner'> & {
    owner: {
        id: string;
        name: string;
    };
};

type PopulatedMember = Omit<IMember, 'user' | 'role' | 'community'> & {
    user: {
        id: string;
        name: string;
    };
    role: {
        id: string;
        name: string;
    };
    community: {
        id: string;
        name: string;
        slug: string;
        owner: string;
        created_at: Date;
        updated_at: Date;
    };
};

// @desc    Create a community
// @route   POST /v1/community
// @access  Private
export const createCommunity = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if community with slug exists
        const communityExists = await Community.findOne({ slug });
        if (communityExists) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'Community with this name already exists'
                }
            });
        }

        // Create community
        const community = await Community.create({
            name,
            slug,
            owner: req.user.id
        });

        // Get Community Admin role
        const adminRole = await Role.findOne({ name: 'Community Admin' });
        if (!adminRole) {
            return res.status(500).json({
                status: false,
                error: {
                    message: 'Community Admin role not found'
                }
            });
        }

        // Add owner as Community Admin
        await Member.create({
            community: community.id,
            user: req.user.id,
            role: adminRole.id
        });

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.created_at,
                    updated_at: community.updated_at
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all communities
// @route   GET /v1/community
// @access  Public
export const getAllCommunities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const communities = await Community.find()
            .populate('owner', 'id name')
            .sort({ created_at: -1 })
            .lean() as unknown as PopulatedCommunity[];

        res.json({
            status: true,
            content: {
                meta: {
                    total: communities.length,
                    pages: 1,
                    page: 1
                },
                data: communities.map(community => ({
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: {
                        id: community.owner.id,
                        name: community.owner.name
                    },
                    created_at: community.created_at,
                    updated_at: community.updated_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get community members
// @route   GET /v1/community/:id/members
// @access  Private
export const getCommunityMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const members = await Member.find({ community: id })
            .populate('user', 'id name')
            .populate('role', 'id name')
            .sort({ created_at: -1 })
            .lean() as unknown as PopulatedMember[];

        res.json({
            status: true,
            content: {
                meta: {
                    total: members.length,
                    pages: 1,
                    page: 1
                },
                data: members.map(member => ({
                    id: member.id,
                    community: member.community,
                    user: {
                        id: member.user.id,
                        name: member.user.name
                    },
                    role: {
                        id: member.role.id,
                        name: member.role.name
                    },
                    created_at: member.created_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's owned communities
// @route   GET /v1/community/me/owner
// @access  Private
export const getOwnedCommunities = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const communities = await Community.find({ owner: req.user.id })
            .sort({ created_at: -1 });

        res.json({
            status: true,
            content: {
                meta: {
                    total: communities.length,
                    pages: 1,
                    page: 1
                },
                data: communities.map(community => ({
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.created_at,
                    updated_at: community.updated_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's joined communities
// @route   GET /v1/community/me/member
// @access  Private
export const getJoinedCommunities = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const members = await Member.find({ user: req.user.id })
            .populate({
                path: 'community',
                select: 'id name slug owner created_at updated_at'
            })
            .sort({ created_at: -1 })
            .lean() as unknown as PopulatedMember[];

        res.json({
            status: true,
            content: {
                meta: {
                    total: members.length,
                    pages: 1,
                    page: 1
                },
                data: members.map(member => ({
                    id: member.id,
                    community: {
                        id: member.community.id,
                        name: member.community.name,
                        slug: member.community.slug,
                        owner: member.community.owner,
                        created_at: member.community.created_at,
                        updated_at: member.community.updated_at
                    },
                    role: member.role,
                    created_at: member.created_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
}; 