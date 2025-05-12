import express from 'express';
import { addMember, removeMember } from '../controllers/memberController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, addMember);
router.delete('/:id', protect, removeMember);

export default router; 