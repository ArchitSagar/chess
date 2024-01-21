import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import PieceSelection from '../component/PieceSelection';
import chessPng from '../assets/chessPng.png';
import "../App.css"

function Homepage() {
  const navigate = useNavigate();
  const { currentUser } = auth;
  const [selectedMode, setSelectedMode] = useState(null);
  const [showPieceSelection, setShowPieceSelection] = useState(false);
  const [gameId, setGameId] = useState(null);

  const buttonStyles = {
    base: 'border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-20 bg-white bg-opacity-10 shadow-box h-35 w-60 text-white text-center',
  };

  async function startOnlineGame(startingPiece) {
    const member = {
      uid: currentUser.uid,
      piece: startingPiece,
      name: localStorage.getItem('userName'),
      creator: true,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    };

    const game = {
      status: 'waiting',
      members: [member],
      gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
    };

    setGameId(game.gameId);

    await db.collection('games').doc(game.gameId).set(game);
    navigate(`/Multiplayer/${game.gameId}`);
  }

  const handlePlayClick = (mode) => {
    setSelectedMode(mode);
    setShowPieceSelection(true);
  };

  const handlePieceSelect = (selectedPiece) => {
    setShowPieceSelection(false);

    if (selectedMode === 'Multiplayer') {
      if (!gameId) {
        // Call startOnlineGame only if multiplayer mode is selected and gameId is not set
        startOnlineGame(selectedPiece);
      }
    } else {
      // Handle normal piece selection
      navigate(`/${selectedMode}/${selectedPiece}`);
    }
  };

  const handleClosePieceSelection = () => {
    setShowPieceSelection(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <img className='h-40 w-40 mb-20' src={chessPng} alt="chess" />
      <button className={buttonStyles.base} onClick={() => handlePlayClick('playLocally')}>
        Play Locally
      </button>
      <button className={buttonStyles.base} onClick={() => handlePlayClick('HumanVsComputer')}>
        Human vs Computer
      </button>
      <button className={buttonStyles.base} onClick={() => handlePlayClick('HumanVsRandom')}>
        User vs Random
      </button>
      <button className={buttonStyles.base} onClick={() => handlePlayClick('Multiplayer')}>
        Multiplayer
      </button>

      {showPieceSelection && (
        <PieceSelection
          onSelect={handlePieceSelect}
          onClose={handleClosePieceSelection}
        />
      )}
    </div>
  );
}

export default Homepage;

