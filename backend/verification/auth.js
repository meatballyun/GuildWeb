const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('authenticated');
        return next();
    } else {
        return res.status(401).json({ data: 'Unauthorized' });
    }
};

module.exports = authenticated;