import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Get token from cookies
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Return minimal user data
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: decoded.email
        // Add other non-sensitive fields as needed
      }
    });

  } catch (error) {
    // Handle expired/invalid tokens
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(200).json({ isAuthenticated: false });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(200).json({ isAuthenticated: false });
    }
    
    console.error('Session check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}