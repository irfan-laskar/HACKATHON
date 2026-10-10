import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { inMemoryDB, isMongooseReady, MemoryUser } from '../services/dataStore';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'marketsphere_super_secret_jwt_key_2026_dev_secure';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

const sendAuthResponse = (user: any, statusCode: number, res: Response, message: string) => {
  const userId = user._id ? user._id.toString() : user.id;
  const token = generateToken(userId);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  };

  res.cookie('token', token, cookieOptions);

  const userSafe = {
    _id: userId,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    channelName: user.channelName,
    channelBanner: user.channelBanner,
    website: user.website,
    socialLinks: user.socialLinks || {},
    followersCount: user.followersCount || user.followers?.length || 0,
    followingCount: user.following?.length || 0,
    isVerified: user.isVerified || false,
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userSafe,
  });
};

// @route   POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, channelName, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const assignedRole = role === 'creator' ? 'creator' : 'user';

    if (isMongooseReady()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: assignedRole,
        channelName: channelName || (assignedRole === 'creator' ? `${name}'s Academy` : undefined),
        bio: bio || (assignedRole === 'creator' ? 'Educational Creator on MarketSphere' : 'Learner & Entrepreneur on MarketSphere'),
      });

      return sendAuthResponse(user, 201, res, 'Registration successful. Welcome to MarketSphere!');
    } else {
      const existing = inMemoryDB.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: MemoryUser = {
        _id: inMemoryDB.generateId(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole as 'user' | 'creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: bio || (assignedRole === 'creator' ? 'Educational Creator on MarketSphere' : 'Learner & Entrepreneur on MarketSphere'),
        channelName: channelName || (assignedRole === 'creator' ? `${name}'s Academy` : undefined),
        followersCount: 0,
        followers: [],
        following: [],
        isVerified: false,
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryDB.users.push(newUser);
      return sendAuthResponse(newUser, 201, res, 'Registration successful. Welcome to MarketSphere!');
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
};

// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongooseReady()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: `Your account is suspended. Reason: ${user.suspensionReason || 'Violation of terms.'}`,
        });
      }

      return sendAuthResponse(user, 200, res, 'Login successful.');
    } else {
      const user = inMemoryDB.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: `Your account is suspended. Reason: ${user.suspensionReason || 'Violation of terms.'}`,
        });
      }

      return sendAuthResponse(user, 200, res, 'Login successful.');
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed.' });
  }
};

// @route   POST /api/auth/logout
export const logout = (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  const userId = req.user._id ? req.user._id.toString() : req.user.id;

  if (isMongooseReady()) {
    const user = await User.findById(userId)
      .populate('following', 'name avatar role')
      .populate('followers', 'name avatar role');

    return res.status(200).json({ success: true, user });
  } else {
    const user = inMemoryDB.users.find((u) => u._id === userId);
    return res.status(200).json({ success: true, user });
  }
};

// @route   PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    const { name, bio, website, avatar, channelName, channelBanner, socialLinks } = req.body;

    if (isMongooseReady()) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(bio !== undefined && { bio }),
          ...(website !== undefined && { website }),
          ...(avatar && { avatar }),
          ...(channelName !== undefined && { channelName }),
          ...(channelBanner !== undefined && { channelBanner }),
          ...(socialLinks && { socialLinks }),
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, message: 'Profile updated.', user: updatedUser });
    } else {
      const user = inMemoryDB.users.find((u) => u._id === userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (website !== undefined) user.website = website;
      if (avatar) user.avatar = avatar;
      if (channelName !== undefined) user.channelName = channelName;
      if (channelBanner !== undefined) user.channelBanner = channelBanner;
      if (socialLinks) user.socialLinks = socialLinks;
      user.updatedAt = new Date();

      return res.status(200).json({ success: true, message: 'Profile updated.', user });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Profile update failed.' });
  }
};

// @route   POST /api/auth/become-creator
export const becomeCreator = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    const { channelName, bio } = req.body;

    if (isMongooseReady()) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          role: 'creator',
          channelName: channelName || `${req.user.name}'s Academy`,
          bio: bio || req.user.bio || 'Educational Creator on MarketSphere',
        },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Upgraded to Creator.', user });
    } else {
      const user = inMemoryDB.users.find((u) => u._id === userId);
      if (user) {
        user.role = 'creator';
        user.channelName = channelName || `${user.name}'s Academy`;
        if (bio) user.bio = bio;
      }
      return res.status(200).json({ success: true, message: 'Upgraded to Creator.', user });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Action failed.' });
  }
};

// @route   POST /api/auth/follow/:id
export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const targetUserId = String(req.params.id);
    const currentUserId = String(req.user._id ? req.user._id.toString() : req.user.id);

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    if (isMongooseReady()) {
      const targetUser = await User.findById(targetUserId);
      const currentUser = await User.findById(currentUserId);
      if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: 'User not found.' });

      const isFollowing = currentUser.following.some((id) => id.toString() === targetUserId);

      if (isFollowing) {
        currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
        targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
      } else {
        currentUser.following.push(targetUser._id as any);
        targetUser.followers.push(currentUser._id as any);
        targetUser.followersCount += 1;
      }

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        isFollowing: !isFollowing,
        followersCount: targetUser.followersCount,
      });
    } else {
      const targetUser = inMemoryDB.users.find((u) => u._id === targetUserId);
      const currentUser = inMemoryDB.users.find((u) => u._id === currentUserId);
      if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: 'User not found.' });

      const isFollowing = currentUser.following.includes(targetUserId);

      if (isFollowing) {
        currentUser.following = currentUser.following.filter((id) => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);
        targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
      } else {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        targetUser.followersCount += 1;
      }

      return res.status(200).json({
        success: true,
        isFollowing: !isFollowing,
        followersCount: targetUser.followersCount,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Follow failed.' });
  }
};
