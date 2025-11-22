// @access  Public
router.get('/', async (req, res) => {
  try {
    const officers = await prisma.officer.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profile_photo: true,
          },
        },
      },
    });
    res.json(officers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new officer (Admin only)
// @route   POST /api/officers
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { name, email, password, department, designation, ward } = req.body;

  if (!name || !email || !password || !department || !designation || !ward) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Transaction to create User and Officer profile together
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create User
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'officer',
        },
      });

      // 2. Create Officer Profile
      const officer = await prisma.officer.create({
        data: {
          user_id: user.id,
          department,
          designation,
          ward,
          stats: { solved: 0, rating: 0 },
        },
      });

      return { user, officer };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
