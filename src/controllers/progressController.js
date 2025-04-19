const ProgressModel = require('../models/progressModel');

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