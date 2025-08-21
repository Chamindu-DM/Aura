const express = require('express');
const router = express.Router();

// A simple test route to ensure it works
router.get('/', (req, res) => {
    res.send('Services route is working!');
});

module.exports = router;