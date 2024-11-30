const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../utilis/auth');


router.get('/packages', isAuthenticated, (req, res) => {
    res.render('Packages/packages.pug')
})

module.exports = router; 