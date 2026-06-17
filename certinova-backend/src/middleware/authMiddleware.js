import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const userId = req.headers['x-auth-user-id'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication',
    });
  }
};
