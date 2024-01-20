import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';

function Multiplayer() {
  const { gameId } = useParams();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentUserPiece, setCurrentUserPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isGameOverVisible, setIsGameOverVisible] = useState(false);
  const [boardWrapperStyle, setBoardWrapperStyle] = useState({
    width: '80vw',
    maxWidth: '80vh',
    margin: '1rem auto',
  });


  useEffect(() => {
    function handleResize() {
      const isSmallScreen = window.innerWidth <= 576;
      setBoardWrapperStyle({
        width: isSmallScreen ? '92vw' : '75vw',
        maxWidth: isSmallScreen ? '93vh' : '80vh',
        margin: '1rem auto',
      });
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      const fetchGameData = async () => {
        if (!user) {
          return;
        }

        const snapshot = await db.collection('games').doc(gameId).get();

        if (snapshot.exists) {
          const gameData = snapshot.data();
          const fen = gameData.fen;

          setGame(new Chess(fen));

          const currentMember = gameData.members.find((member) => member.uid === user.uid);

          if (!currentMember) {
            const newMember = {
              uid: user.uid,
              name: localStorage.getItem('userName'),
              piece: gameData.members[0].piece === 'white' ? 'black' : 'white',
            };

            await db.collection('games').doc(gameId).update({
              members: [...gameData.members, newMember],
            });

            setCurrentUserPiece(newMember.piece);

            const orientation = newMember?.piece === 'white' ? 'white' : 'black';
            setBoardOrientation(orientation);
          } else {
            setCurrentUserPiece(currentMember.piece || null);

            const orientation = currentMember?.piece === 'white' ? 'white' : 'black';
            setBoardOrientation(orientation);
          }
        }
      };

      fetchGameData();
    });

    const unsubscribeGame = db.collection('games').doc(gameId).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const gameData = snapshot.data();
        const fen = gameData.fen;
        setGame(new Chess(fen));

        if (gameData.isGameOver) {
          setWinner(gameData.winner);
          setIsGameOverVisible(true);
        } else {
          setIsGameOverVisible(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeGame();
    };
  }, [gameId, currentUserPiece, boardOrientation]);

  function onDrop(source, target, piece) {
    const move = game.move({ from: source, to: target, promotion: piece[1].toLowerCase() ?? 'q' });

    if (move === null) {
      return 'snapback';
    }

    const isCurrentUserPiece =
      (currentUserPiece === 'white' && game.get(target)?.color === 'w') ||
      (currentUserPiece === 'black' && game.get(target)?.color === 'b');

    if (!isCurrentUserPiece) {
      return 'snapback';
    }

    const updatedFen = game.fen();
    db.collection('games')
      .doc(gameId)
      .update({ fen: updatedFen })
      .then(() => console.log('Update successful'))
      .catch((error) => console.error('Error updating game data:', error));

    setGame(new Chess(updatedFen));

    checkGameOver();

    return true;
  }

  function checkGameOver() {
    if (game.game_over() || game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
      setWinner(game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White');
      setIsGameOverVisible(true);

      const updatedFen = game.fen();
      db.collection('games')
        .doc(gameId)
        .update({ fen: updatedFen, isGameOver: true, winner: game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White' })
        .then(() => console.log('Update successful'))
        .catch((error) => console.error('Error updating game data:', error));
    }
  }

  function handleNewGame() {
    setGame(new Chess());
    setWinner(null);
    setIsGameOverVisible(false);

    db.collection('games')
      .doc(gameId)
      .update({ fen: new Chess().fen(), isGameOver: false, winner: null, status: 'waiting' })
      .then(() => console.log('New game started'))
      .catch((error) => console.error('Error updating game data:', error));
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 overflow-hidden max-w-screen-lg w-full">
        <div className="flex justify-center" style={boardWrapperStyle}>
        <Chessboard
        id="MultiplayerChessboard"
        position={game.fen()}
        boardOrientation={boardOrientation}
        onPieceDrop={onDrop}
        draggable={{
          enabled: currentUserPiece !== null,
          dropOffBoard: 'trash',
          showGhost: true,
        }}
      />

        </div>
      

      {isGameOverVisible && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 border-2 border-black shadow-lg z-50">
          <p className="mb-4 text-2xl font-bold">Game Over!</p>
          <p className="mb-4">Winner: {winner}</p>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleNewGame()}
          >
            New Game
          </button>
        </div>
      )}
    </div>
    </div>
  );
}

export default Multiplayer;
