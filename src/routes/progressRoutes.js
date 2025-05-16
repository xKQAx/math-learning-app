const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const isAuthenticated = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Ruta para completar una lección
router.post('/progress/complete', progressController.completeLesson);

// Ruta para reiniciar el progreso
router.post('/progress/reset', progressController.resetProgress);

router.post('/deleteLesson', isAuthenticated, async (req, res) => {
    console.log('Petición para eliminar lección:', req.body.lesson);
    const userId = req.session.user._id;
    const lesson = req.body.lesson;
    try {
        await User.findByIdAndUpdate(userId, { $pull: { completedLessons: lesson } });
        res.status(200).json({ message: 'Lección eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la lección' });
    }
});

module.exports = router;