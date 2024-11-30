const bcrypt = require('bcrypt');
const { Users } = require('../models');

// Login Controller
const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ raw: true, where: { username } });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      const error = new Error('Invalid username or password');
      error.status = 401; 
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

// Logout Controller
const Logout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {Login, Logout }