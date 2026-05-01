const Group = require('../models/Group');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { generateInviteCode } = require('../utils/helpers');

const createGroup = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const groupData = {
      name,
      description: description || '',
      type: type || 'public',
      admin: req.user._id,
      members: [{ user: req.user._id, joinedAt: new Date() }],
    };

    if (type === 'private') {
      groupData.inviteCode = generateInviteCode();
    }

    const group = await Group.create(groupData);

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { groups: group._id },
    });

    await Activity.create({
      user: req.user._id,
      type: 'create_group',
      data: { groupId: group._id, groupName: name },
    });

    const populated = await Group.findById(group._id)
      .populate('admin', 'name avatar')
      .populate('members.user', 'name avatar leetcodeUsername stats streak');

    res.status(201).json({ group: populated });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};

const getGroups = async (req, res) => {
  try {
    const { search, type } = req.query;
    const filter = {};

    if (type === 'my') {
      filter._id = { $in: req.user.groups };
    } else {
      filter.type = 'public';
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const groups = await Group.find(filter)
      .populate('admin', 'name avatar')
      .select('name description type members createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    const groupsWithCount = groups.map(g => ({
      ...g.toObject(),
      memberCount: g.members.length,
    }));

    res.json({ groups: groupsWithCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name avatar leetcodeUsername stats')
      .populate('members.user', 'name avatar leetcodeUsername stats streak');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      m => m.user._id.toString() === req.user._id.toString()
    );

    if (group.type === 'private' && !isMember) {
      return res.status(403).json({ message: 'Access denied. This is a private group.' });
    }

    res.json({ group });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group' });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.type === 'private') {
      return res.status(403).json({ message: 'Use invite code to join private groups' });
    }

    const alreadyMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.members.push({ user: req.user._id, joinedAt: new Date() });
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { groups: group._id },
    });

    await Activity.create({
      user: req.user._id,
      type: 'join_group',
      data: { groupId: group._id, groupName: group.name },
    });

    if (req.io) {
      req.io.to(`group:${group._id}`).emit('group:updated', {
        groupId: group._id,
        action: 'member_joined',
        userId: req.user._id,
        userName: req.user.name,
      });
    }

    res.json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join group' });
  }
};

const joinByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const group = await Group.findOne({ inviteCode: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    const alreadyMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.members.push({ user: req.user._id, joinedAt: new Date() });
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { groups: group._id },
    });

    await Activity.create({
      user: req.user._id,
      type: 'join_group',
      data: { groupId: group._id, groupName: group.name },
    });

    if (req.io) {
      req.io.to(`group:${group._id}`).emit('group:updated', {
        groupId: group._id,
        action: 'member_joined',
        userId: req.user._id,
        userName: req.user.name,
      });
    }

    res.json({ message: 'Joined group successfully', groupId: group._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join group' });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.admin.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot leave. Delete the group instead.' });
    }

    group.members = group.members.filter(
      m => m.user.toString() !== req.user._id.toString()
    );
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { groups: group._id },
    });

    await Activity.create({
      user: req.user._id,
      type: 'leave_group',
      data: { groupId: group._id, groupName: group.name },
    });

    if (req.io) {
      req.io.to(`group:${group._id}`).emit('group:updated', {
        groupId: group._id,
        action: 'member_left',
        userId: req.user._id,
      });
    }

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave group' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can delete the group' });
    }

    const memberIds = group.members.map(m => m.user);
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { groups: group._id } }
    );

    await Group.findByIdAndDelete(req.params.id);

    if (req.io) {
      req.io.to(`group:${group._id}`).emit('group:updated', {
        groupId: group._id,
        action: 'group_deleted',
      });
    }

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete group' });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  joinByCode,
  leaveGroup,
  deleteGroup,
};
