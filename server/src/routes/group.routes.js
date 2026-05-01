const express = require('express');
const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  joinGroup,
  joinByCode,
  leaveGroup,
  deleteGroup,
} = require('../controllers/group.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { z } = require('zod');

const router = express.Router();

const groupSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['public', 'private']).optional(),
  challengeSettings: z.object({
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    target: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }).optional(),
});

router.post('/', authenticate, validate(groupSchema), createGroup);
router.get('/', authenticate, getGroups);
router.get('/:id', authenticate, getGroupById);
router.put('/:id', authenticate, validate(groupSchema), updateGroup);
router.post('/:id/join', authenticate, joinGroup);
router.post('/join/:code', authenticate, joinByCode);
router.post('/:id/leave', authenticate, leaveGroup);
router.delete('/:id', authenticate, deleteGroup);

module.exports = router;
