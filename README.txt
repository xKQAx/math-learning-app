# Math Learning App

## Overview
The Math Learning App is an interactive web application designed to help first-grade students learn basic arithmetic skills, specifically focusing on simple addition and subtraction. The application incorporates engaging activities, visual aids, and interactive features to enhance the learning experience.

## Features
- **Home Page**: Introduction to the app and navigation to different sections.
- **Progress Tracking**: Allows users to view their learning progress and achievements.
- **Practice Exercises**: Interactive math problems for addition and subtraction.
- **Number Friends**: A fun, engaging feature that helps children learn numbers through games.
- **Subtraction Exercises**: Focused practice on subtraction problems, particularly with the number 5.
- **Differences Between Numbers**: Exercises that help children understand the concept of differences.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, and React.js for a dynamic user interface.
- **Backend**: Node.js with Express for server-side logic and API management.
- **Database**: Firebase or MongoDB for storing user data and progress.
- **Libraries**: 
  - p5.js or Phaser.js for creating interactive graphics.
  - Math.js for handling mathematical operations.

## Project Structure
```
math-learning-app
├── public
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── main.js
│   ├── images
│   └── index.html
├── src
│   ├── controllers
│   │   ├── homeController.js
│   │   ├── progressController.js
│   │   ├── practiceController.js
│   │   ├── numberFriendsController.js
│   │   ├── subtractionController.js
│   │   └── differencesController.js
│   ├── models
│   │   ├── userModel.js
│   │   └── progressModel.js
│   ├── views
│   │   ├── home.ejs
│   │   ├── progress.ejs
│   │   ├── practice.ejs
│   │   ├── numberFriends.ejs
│   │   ├── subtraction.ejs
│   │   └── differences.ejs
├── app.js
├── package.json
└── .gitignore
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd math-learning-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:3000` to access the application.

## Contribution
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
