import express from 'express';
import { createRole, getAllRoles } from '../controllers/roleController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createRole);
router.get('/', getAllRoles);

export default router; 