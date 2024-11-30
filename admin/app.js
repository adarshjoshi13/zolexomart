const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { Connection, Services } = require('./src/models');
const sessionMiddleware = require('./utilis/session');
const AuthRoutes = require('./src/routes/auth');
const ServicesRoutes = require('./src/routes/services');
const PackagesRoutes = require('./src/routes/packages');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT | 5000;

// Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessionMiddleware);


// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle home '/' route
app.get('/', async (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.use('/', AuthRoutes);
app.use('/', ServicesRoutes);
app.use('/', PackagesRoutes);

// Initialize the Database and Start Server
Connection().then(() => {
  try {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    next(err);
  }
});
