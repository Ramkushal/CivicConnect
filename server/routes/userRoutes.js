router.get('/profile', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_photo: true,
        created_at: true,
        // Include officer profile if they are an officer
        officerProfile: true
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          profile_photo: req.body.profile_photo || user.profile_photo,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profile_photo: true,
          created_at: true,
        },
      });

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
