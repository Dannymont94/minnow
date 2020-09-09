const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// searched path does not exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;