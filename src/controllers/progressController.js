const ProgressModel = require('../models/progressModel');
const User = require('../models/userModel'); // Cambia '../models/User' a '../models/userModel'

// Function to get user progress
exports.getUserProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const progressData = await ProgressModel.findByUserId(userId);
        
        if (!progressData) {
            return res.status(404).json({ message: 'Progress data not found' });
        }
        
        res.status(200).json(progressData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving progress data', error });
    }
};

// Function to update user progress
exports.updateUserProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;
        
        const updatedProgress = await ProgressModel.updateProgress(userId, updatedData);
        
        if (!updatedProgress) {
            return res.status(404).json({ message: 'Progress data not found for update' });
        }
        
        res.status(200).json({ message: 'Progress updated successfully', updatedProgress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress data', error });
    }
};

const completeLesson = async (req, res) => {
    const { lessonId } = req.body;
    const userId = req.session.user._id; // ID del usuario logueado

    try {
        // Actualizar el progreso del usuario en la base de datos
        await User.findByIdAndUpdate(userId, {
            $addToSet: { completedLessons: lessonId } // Agrega la lección al progreso si no está ya
        });

        res.status(200).json({ message: 'Lección completada' });
    } catch (error) {
        console.error('Error al actualizar el progreso:', error);
        res.status(500).json({ message: 'Error al actualizar el progreso' });
    }
};

module.exports = { completeLesson };