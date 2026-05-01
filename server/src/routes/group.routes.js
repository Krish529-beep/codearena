const express = require('express');
const {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  joinByCode,
  leaveGroup,
  deleteGroup,
} = require('../controllers/group.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { z } = require('zod');

const router = express.Router();

const createGroupSchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().max(500).optional(),
  type: z.enum(['public', 'private']).optional(),
});

router.post('/', authenticate, validate(createGroupSchema), createGroup);
router.get('/', authenticate, getGroups);
router.get('/:id', authenticate, getGroupById);
router.post('/:id/join', authenticate, joinGroup);
router.post('/join/:code', authenticate, joinByCode);
router.post('/:id/leave', authenticate, leaveGroup);
router.delete('/:id', authenticate, deleteGroup);

module.exports = router;
