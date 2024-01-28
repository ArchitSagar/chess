# Elite Chess

Welcome to Elite Chess, your premier Chess Game Website! This project offers a diverse range of gameplay modes, providing a thrilling chess experience for players of all levels. Built using React.js, chess.js, and react-chessboard, Elite Chess delivers an immersive and enjoyable platform for chess enthusiasts.

## Features

- **Local Gameplay:** Enjoy a classic game of chess with a friend locally, taking turns on the same device.

- **Play vs Random Computer Move:** Challenge the computer to a casual game where it makes legal but random moves, adding a fun twist to the gameplay.

- **Play vs Computer:** Test your chess skills against the computer with three difficulty modes - Easy, Medium, and Hard. Each difficulty level corresponds to different depths in the game, providing a suitable challenge for players of all skill levels.

- **Multiplayer:** Engage in real-time multiplayer matches against friends or opponents. The multiplayer functionality is powered by Firebase, ensuring a seamless and reliable gaming experience.

## Technologies Used

- **React.js:** The frontend of the website is built using React.js, offering a dynamic and responsive user interface.

- **chess.js:** This library is employed to handle chess logic and move generation on the client side.

- **react-chessboard:** A React component designed for a visually appealing chessboard UI, enhancing the overall gaming experience.

- **Stockfish:** Utilizing the powerful open-source chess engine, Stockfish, for computer gameplay. It provides different difficulty levels by adjusting the depth of analysis.

- **Firebase:** The backend of the multiplayer feature is managed by Firebase, offering real-time database functionality to enable seamless and enjoyable multiplayer gameplay.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ArchitSagar/chess.git
   

Install dependencies:

    cd elite-chess
    npm install

Start

    npm run dev
    

Open your browser and navigate to http://localhost:3000 to access the Elite Chess Game Website.

### Configuration
For the multiplayer feature, you'll need to set up Firebase credentials. Follow these steps:

1. Create a Firebase project at Firebase Console.
2. Obtain your Firebase configuration (apiKey, authDomain, projectId, etc.).
3. Replace the placeholder values in the src/firebase/firebaseConfig.js file with your Firebase configuration.

```javascript

// src/firebase/firebaseConfig.js

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
// ...other config values
};

export default firebaseConfig;
```

### Contributing
Feel free to contribute to the project by opening issues or submitting pull requests. Your feedback and contributions are highly appreciated!

### License
This project is licensed under the MIT License. Feel free to use, modify, and distribute the code for your own purposes.

Happy gaming! 🌟
