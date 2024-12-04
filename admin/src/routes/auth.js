const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('login')
    }
});

router.post('/login', authController.Login);
router.get('/logout', authController.Logout);

module.exports = router;
