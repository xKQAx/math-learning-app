const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Ruta para completar una lección
router.post('/progress/complete', progressController.completeLesson);

// Ruta para reiniciar el progreso
router.post('/progress/reset', progressController.resetProgress);

module.exports = router;