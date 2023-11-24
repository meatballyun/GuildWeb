module.exports = {
    authenticated: (req, res, next) => {
        console.log('authenticated');
        if (req.isAuthenticated()) { return next() }
        req.flash('warning_msg', '請先登入才能此用')
        res.redirect('http://localhost:3001/login')
    }
}