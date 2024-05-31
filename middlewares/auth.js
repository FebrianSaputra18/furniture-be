const jwt = require('jsonwebtoken');
const User = require('../app/user/model');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization');

  console.log('Authorization header:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'faketoken'); // Replace with your secret key
    console.log('Decoded token:', decoded);
    req.user = decoded.user;

    // Verifikasi token dengan yang ada di database
    const user = await User.findById(req.user.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
