const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Ruta para completar una lección
router.post('/progress/complete', progressController.completeLesson);

module.exports = router;