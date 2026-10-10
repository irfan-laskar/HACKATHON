import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'marketsphere_super_secret_jwt_key_2026_dev_secure';
    const decoded = jwt.verify(token, secret) as { id: string };

    let user: any;
    if (isMongooseReady()) {
      user = await User.findById(decoded.id);
    } else {
      user = inMemoryDB.users.find((u) => u._id === decoded.id);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: `Account is suspended. Reason: ${user.suspensionReason || 'Violation of community guidelines'}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'marketsphere_super_secret_jwt_key_2026_dev_secure';
      const decoded = jwt.verify(token, secret) as { id: string };

      let user: any;
      if (isMongooseReady()) {
        user = await User.findById(decoded.id);
      } else {
        user = inMemoryDB.users.find((u) => u._id === decoded.id);
      }

      if (user && !user.isSuspended) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not permitted to perform this action. Required: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};
