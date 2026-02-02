import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

// TODO: POST /api/auth/register - Register a new user
router.post('/register', async (req: Request, res: Response) => {
  // TODO: Get username, email, password from req.body
 try {
    const { username, email, password } = req.body

  // TODO: Validate input (all fields required)
  // If missing fields, return 400 with message
 if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
  // TODO: Check if user already exists (by email or username)
  // Use User.findOne({ where: { ... } })
  // If exists, return 400 with message "User already exists"
const existingUser = await User.findOne({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
  // TODO: Create the user
  // Remember: Password hashing happens in the model hook!
   const user = await User.create({
      username,
      email,
      password
    })
  // TODO: Generate JWT token
   const token = jwt.sign(
     { 
      id: user.id, 
      email: user.email, 
      username: user.username 
    },
     process.env.JWT_SECRET!,
     { expiresIn: '7d' }
   )

  // TODO: Return token and user data (exclude password!)
   return res.status (201).json({ 
    token, 
    user: { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    } 
});
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// TODO: POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
  // TODO: Get email and password from req.body
 try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
  // TODO: Find user by email
  // const user = await User.findOne({ where: { email } });
  // If not found, return 401 with message "Invalid credentials"
  const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  // TODO: Compare password with bcrypt
  // const isValid = await bcrypt.compare(password, user.password);
  // If not valid, return 401 with message "Invalid credentials"
  const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  // TODO: Generate JWT token (same as register)
 const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
  // TODO: Return token and user data
  return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Login failed' })
  }
});

// TODO: GET /api/auth/profile - Get current user profile (protected route)
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  // TODO: Get user from database using req.user.id
  try {
     const user = await User.findByPk(req.user!.id, {
     attributes: { exclude: ['password'] }
   });
   if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

  // TODO: Return user data
   return res.json(user)
     } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
});

export default router;
