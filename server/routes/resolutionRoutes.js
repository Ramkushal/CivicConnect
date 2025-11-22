const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Resolve an issue
// @route   POST /api/resolutions
// @access  Private (Officer only)
router.post('/', protect, authorize('officer'), async (req, res) => {
  const { issue_id, resolution_note, proof_image_url } = req.body;

  if (!issue_id || !resolution_note) {
    return res.status(400).json({ message: 'Please provide issue_id and resolution_note' });
  }

  try {
    // Get officer profile
    const officer = await prisma.officer.findUnique({
      where: { user_id: req.user.id },
    });

    if (!officer) {
      return res.status(404).json({ message: 'Officer profile not found' });
    }

    // Create resolution
    const resolution = await prisma.resolution.create({
      data: {
        issue_id: BigInt(issue_id),
        officer_id: officer.id,
        resolution_note,
        proof_image_url,
      },
    });

    // Update issue status to resolved
    await prisma.issue.update({
      where: { id: BigInt(issue_id) },
      data: { status: 'resolved' },
    });

    // Update assignment status to completed
    await prisma.assignment.updateMany({
      where: {
        issue_id: BigInt(issue_id),
        officer_id: officer.id,
        status: 'active',
      },
      data: { status: 'completed' },
    });

    // Update officer stats (increment solved count)
    const currentStats = officer.stats || { solved: 0, rating: 0 };
    const newSolvedCount = (currentStats.solved || 0) + 1;
    
    await prisma.officer.update({
      where: { id: officer.id },
      data: {
        stats: { ...currentStats, solved: newSolvedCount },
      },
    });

    // Notify the user
    req.io.emit(`issue_status_update_${issue_id}`, {
      status: 'resolved',
      message: 'Your issue has been resolved',
      resolution_note,
    });

    // BigInt fix
    const resolutionString = JSON.stringify(resolution, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    res.status(201).json(JSON.parse(resolutionString));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
