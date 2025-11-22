const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @desc    Report a new issue
// @route   POST /api/issues
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { title, description, category, priority, latitude, longitude } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !description || !category || !latitude || !longitude) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        user_id: req.user.id,
        title,
        description,
        category,
        priority: priority || 'medium',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image_url,
        status: 'open',
      },
    });

    // Emit event to officers in the same ward (or general 'officers' room)
    // For simplicity, broadcasting to all for now, or a specific topic
    req.io.emit('issue_reported', issue);

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all issues (with filters)
// @route   GET /api/issues
// @access  Public
router.get('/', async (req, res) => {
  const { status, category, limit } = req.query;

  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;

  try {
    const issues = await prisma.issue.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { name: true, profile_photo: true },
        },
      },
    });

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: BigInt(req.params.id) },
      include: {
        user: {
          select: { name: true, profile_photo: true },
        },
        comments: {
          include: {
            user: { select: { name: true, profile_photo: true } },
          },
          orderBy: { created_at: 'desc' },
        },
        resolutions: {
          include: {
            officer: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (issue) {
      // BigInt serialization fix
      const issueString = JSON.stringify(issue, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      res.json(JSON.parse(issueString));
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Upvote an issue
// @route   PUT /api/issues/:id/upvote
// @access  Private
router.put('/:id/upvote', protect, async (req, res) => {
  try {
    const issue = await prisma.issue.update({
      where: { id: BigInt(req.params.id) },
      data: {
        upvotes: { increment: 1 },
      },
    });

    // BigInt serialization fix
    const issueString = JSON.stringify(issue, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    res.json(JSON.parse(issueString));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
