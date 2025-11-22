const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Assign an officer to an issue (Admin/Officer)
// @route   POST /api/assignments
// @access  Private
router.post('/', protect, authorize('admin', 'officer'), async (req, res) => {
  const { issue_id, officer_id } = req.body;

  if (!issue_id || !officer_id) {
    return res.status(400).json({ message: 'Please provide issue_id and officer_id' });
  }

  try {
    // Check if assignment already exists
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        issue_id: BigInt(issue_id),
        officer_id,
        status: 'active',
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ message: 'Officer already assigned to this issue' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        issue_id: BigInt(issue_id),
        officer_id,
        status: 'active',
      },
    });

    // Update issue status to in_progress
    await prisma.issue.update({
      where: { id: BigInt(issue_id) },
      data: { status: 'in_progress' },
    });

    // Notify the officer
    req.io.emit(`assignment_notification_${officer_id}`, {
      message: 'You have been assigned a new issue',
      issueId: issue_id.toString(),
    });

    // Notify the user (citizen) who reported the issue
    // We would need the user_id from the issue, but for now let's broadcast status update
    req.io.emit(`issue_status_update_${issue_id}`, {
      status: 'in_progress',
      message: 'An officer has been assigned to your issue',
    });

    // BigInt fix
    const assignmentString = JSON.stringify(assignment, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    res.status(201).json(JSON.parse(assignmentString));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get assignments for logged-in officer
// @route   GET /api/assignments/my-assignments
// @access  Private (Officer only)
router.get('/my-assignments', protect, authorize('officer'), async (req, res) => {
  try {
    // First get officer profile id
    const officer = await prisma.officer.findUnique({
      where: { user_id: req.user.id },
    });

    if (!officer) {
      return res.status(404).json({ message: 'Officer profile not found' });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        officer_id: officer.id,
        status: 'active',
      },
      include: {
        issue: {
          include: {
            user: { select: { name: true, profile_photo: true } },
          },
        },
      },
      orderBy: { assigned_at: 'desc' },
    });

    // BigInt fix
    const assignmentsString = JSON.stringify(assignments, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    res.json(JSON.parse(assignmentsString));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
