const router = require('express').Router();
const auth = require('../middleware/auth');

// User Dashboard
// router.get('/user', auth, (req, res) => {
//     if (req.user.role !== 'user') {
//         return res.status(403).send('Access denied.');
//     }
//     res.json({ message: 'Welcome to the user dashboard!', user: req.user });
// });

// Admin Dashboard
router.get('/admin', auth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied.');
    }
    res.json({ message: 'Welcome to the admin dashboard!', user: req.user });
});

module.exports = router;
