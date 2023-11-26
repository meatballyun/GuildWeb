module.exports = {
    authenticated: (req, res, next) => {
        console.log('authenticated');
        if (req.isAuthenticated()) { return next() }
        res.status(401).json({ error: 'Unauthorized', message: 'User is not logged in' });
    }
}