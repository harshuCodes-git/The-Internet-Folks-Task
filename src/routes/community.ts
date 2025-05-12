import express from 'express';
import {
    createCommunity,
    getAllCommunities,
    getCommunityMembers,
    getOwnedCommunities,
    getJoinedCommunities
} from '../controllers/communityController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createCommunity);
router.get('/', getAllCommunities);
router.get('/:id/members', protect, getCommunityMembers);
router.get('/me/owner', protect, getOwnedCommunities);
router.get('/me/member', protect, getJoinedCommunities);

export default router; 