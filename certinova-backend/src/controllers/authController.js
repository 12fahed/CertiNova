import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { organisation, email, password } = req.body;

    // Validation
    if (!organisation || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide organisation, email, and password',
      });
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const user = new User({
      organisation,
      email: normalizedEmail,
      password,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          organisation: user.organisation,
          email: user.email,
          organizationLogo: user.organizationLogo,
          eventTypes: user.eventTypes,
          referralSource: user.referralSource,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password for comparison)
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          organisation: user.organisation,
          email: user.email,
          organizationLogo: user.organizationLogo,
          eventTypes: user.eventTypes,
          referralSource: user.referralSource,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// @desc    Complete user onboarding
// @route   PUT /api/auth/onboarding
// @access  Public

export const completeOnboarding = async (req, res) => {
  try {
    const { email, fullName, organisation, organizationLogo, eventTypes, referralSource } =
      req.body;

    // Validation
    if (!email || !fullName || !organisation || !eventTypes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required onboarding information',
      });
    }

    // Find the user
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update onboarding information
    user.fullName = fullName.trim();
    user.organisation = organisation.trim();
    user.organizationLogo = organizationLogo || '';
    user.eventTypes = eventTypes;
    user.referralSource = referralSource || '';
    user.onboardingCompleted = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          organisation: user.organisation,
          organizationLogo: user.organizationLogo,
          eventTypes: user.eventTypes,
          referralSource: user.referralSource,
          onboardingCompleted: user.onboardingCompleted,
        },
      },
    });
  } catch (error) {
    console.error('Onboarding error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
