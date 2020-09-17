const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes');
const withAuth = require('../utils/auth');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes)

// searched path does not exist
router.use(withAuth, (req, res) => {
  res.status(404).redirect('/');
});

module.exports = router;