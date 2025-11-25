const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const { Device } = require('./models/Devices');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.PROXI_URI;

console.log('MongoDB URI:', MONGODB_URI ? 'Found' : 'Not found');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Found' : 'Not found');

if (!MONGODB_URI) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('Connected to MongoDB successfully with Mongoose');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', err.message);
    console.error('Please check:');
    console.error('1. Your internet connection');
    console.error('2. MongoDB Atlas cluster is running');
    console.error('3. IP address is whitelisted in MongoDB Atlas');
    console.error('4. Username and password are correct');
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// JWT Secret (in production, use a secure secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Add device route
app.post('/api/addDevices', [
  authenticateToken,
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  body('deviceName').notEmpty().withMessage('Device name is required'),
  body('deviceType').optional().isIn(['Temperature', 'Humidity', 'Irrigation', 'Lighting', 'Soil', 'Other']).withMessage('Invalid device type'),
  body('location').optional().isString().withMessage('Location must be a string')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { deviceId, deviceName, deviceType, location } = req.body;

    // Check if device already exists for this user
    const existingDevice = user.devices.find(device => device.deviceId === deviceId);
    if (existingDevice) {
      return res.status(400).json({ error: 'Device with this ID already exists' });
    }

    // Create new device
    const newDevice = {
      deviceId,
      deviceName,
      deviceType: deviceType || 'Other',
      location: location || 'Unknown',
      status: 'Offline',
      lastSeen: new Date()
    };

    user.devices.push(newDevice);
    await user.save();

    res.json({
      message: 'Device added successfully',
      device: newDevice
    });
  } catch (error) {
    console.error('Add device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's devices route
app.get('/api/devices', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Devices retrieved successfully',
      devices: user.devices
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific device by ID route
app.get('/api/devices/:deviceId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { deviceId } = req.params;
    const device = user.devices.find(d => d.deviceId === deviceId);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({
      message: 'Device retrieved successfully',
      device: device
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/api/devices/:deviceId/putTime", authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;

        const { screenTime } = req.body;
        const user = await User.findById(req.user.userId);
        const device = user.devices.find(d => d.deviceId === deviceId);

        device.screenTime = screenTime

        await user.save()
        res.json({
            message: "device updated",
            device: device
        })
    } catch (err) {
        console.error("error:" + err)
    }
})

app.get('/api/devices/:deviceId/getTime', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const { deviceId } = req.params;
        const device = user.devices.find(d => d.deviceId === deviceId);
        console.log(device)
        res.json({
            message: 'time retrieved successfully',
            time: device.screenTime
        })
    } catch (error) {
        console.error(error);
    }
})

// Update device status route
app.put('/api/devices/:deviceId/status', [
  authenticateToken,
  body('status').isIn(['Online', 'Offline', 'Maintenance']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { deviceId } = req.params;
    const { status } = req.body;

    const device = user.devices.find(d => d.deviceId === deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    device.status = status;
    device.lastSeen = new Date();
    await user.save();

    res.json({
      message: 'Device status updated successfully',
      device: device
    });
  } catch (error) {
    console.error('Update device status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get max time
app.get('/api/devices/:deviceId/getMaxTime', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const { deviceId } = req.params;
        const device = user.devices.find(d => d.deviceId === deviceId);
        console.log(device)
        res.json({
            message: 'time retrieved successfully',
            maxTime: device.maxTime
        })
    } catch(err) {
        console.log(err)
    }
})

// set max time
app.put('/api/devices/:deviceId/setMaxTime', authenticateToken, async (req, res) => {
    try {
        const {deviceId} = req.params
        const { maxTime } = req.body

        const user = await User.findById(req.user.userId);
        const device = user.devices.find(d => d.deviceId === deviceId);

        device.maxTime = maxTime
        await user.save()

        res.json({
            message: "device updated",
            device: device
        })

    } catch(err) {
        console.log(err)
    }
})

// Remove device route
app.delete('/api/devices/:deviceId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { deviceId } = req.params;
    const deviceIndex = user.devices.findIndex(d => d.deviceId === deviceId);

    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }

    user.devices.splice(deviceIndex, 1);
    await user.save();

    res.json({
      message: 'Device removed successfully'
    });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign up route
app.post('/api/signup', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('firstName').optional().isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName').optional().isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        ...(email ? [{ email }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Create user using Mongoose model
    const user = new User({
      username,
      password, // Will be hashed by pre-save middleware
      email,
      firstName,
      lastName
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user using the static method
    const user = await User.findByCredentials(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password using instance method
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile data',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token route
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
