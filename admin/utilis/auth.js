const isAuthenticated = (req, res, next) => {
    console.log(req.session.user,  'check')
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {isAuthenticated}