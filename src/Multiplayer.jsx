import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';
import { auth, db } from './firebase';

function Multiplayer() {
  const { gameId } = useParams();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentUserPiece, setCurrentUserPiece] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isGameOverVisible, setIsGameOverVisible] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      const fetchGameData = async () => {
        if (!user) {
          console.error('User is not signed in. Please handle this case accordingly.');
          // Redirect the user to the sign-in page or take appropriate action
          return;
        }
        console.log('User is signed in:', user.uid); // Log the user's UID

        setCurrentUserUid(user.uid);

        const snapshot = await db.collection('games').doc(gameId).get();

        if (snapshot.exists) {
          const gameData = snapshot.data();
          const fen = gameData.fen;

          setGame(new Chess(fen));

          const currentMember = gameData.members.find((member) => member.uid === user.uid);

          if (!currentMember) {
            // If the user is not already a member, add them as a member
            const newMember = {
              uid: user.uid,
              name: localStorage.getItem('userName'),
              piece: gameData.members[0].piece === 'white' ? 'black' : 'white',
              // Additional member data if needed
            };

            await db.collection('games').doc(gameId).update({
              members: [...gameData.members, newMember],
            });

            setCurrentUserPiece(newMember.piece);

            const orientation = newMember?.piece === 'white' ? 'white' : 'black';
            setBoardOrientation(orientation);

            console.log('User added as a member');
          } else {
            setCurrentUserPiece(currentMember.piece || null);

            const orientation = currentMember?.piece === 'white' ? 'white' : 'black';
            setBoardOrientation(orientation);
          }
        } else {
          console.error(`Document with ID ${gameId} does not exist.`);
        }
      };

      fetchGameData();
    });

    const unsubscribeGame = db.collection('games').doc(gameId).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const gameData = snapshot.data();
        const fen = gameData.fen;
        setGame(new Chess(fen));

        // Check if the game is over
        if (gameData.isGameOver) {
          setIsGameOver(true);
          setWinner(gameData.winner);
          setIsGameOverVisible(true); // Set the visibility state
        } else {
          setIsGameOver(false);
          setWinner(null);
          setIsGameOverVisible(false); // Reset the visibility state
        }
      } else {
        console.error(`Document with ID ${gameId} does not exist.`);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeGame();
    };
  }, [gameId, currentUserPiece, boardOrientation]);

  function onDrop(source, target, piece) {
    // Check if the move is valid
    const move = game.move({ from: source, to: target, promotion: piece[1].toLowerCase() ?? 'q' });

    if (move === null) {
      console.log('Invalid move');
      return 'snapback'; // Snap back the dragged piece if the move is invalid
    }

    // Check if the piece being moved belongs to the current user
    const isCurrentUserPiece =
      (currentUserPiece === 'white' && game.get(target)?.color === 'w') ||
      (currentUserPiece === 'black' && game.get(target)?.color === 'b');

    console.log('currentUserPiece:', currentUserPiece);
    console.log('Piece color on target square:', game.get(target)?.color);

    if (!isCurrentUserPiece) {
      console.log('You can only move your own pieces!');
      return 'snapback'; // Snap back the dragged piece if it doesn't belong to the current user
    }

    // Update the Firebase document with the new FEN
    const updatedFen = game.fen();
    db.collection('games')
      .doc(gameId)
      .update({ fen: updatedFen,})
      .then(() => console.log('Update successful'))
      .catch((error) => console.error('Error updating game data:', error));

    // Set the new game state
    setGame(new Chess(updatedFen));

    checkGameOver();

    console.log('Calling checkGameOver...');
    return true;
  }

  function checkGameOver() {
    console.log('Checking game over...');
    console.log('Is game over:', game.game_over());
    console.log('Is draw:', game.in_draw());
    console.log('Is stalemate:', game.in_stalemate());
    console.log('Is threefold repetition:', game.in_threefold_repetition());

    if (game.game_over() || game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
      console.log('Game over!');
      setIsGameOver(true);
      setWinner(game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White');
      setIsGameOverVisible(true); // Set the visibility state
      
      
      const updatedFen = game.fen();
      db.collection('games')
        .doc(gameId)
        .update({ fen: updatedFen, isGameOver: true, winner: game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White' })
        .then(() => console.log('Update successful'))
        .catch((error) => console.error('Error updating game data:', error));
    }
  }

  function handleNewGame() {
    // Reset the game state
    setGame(new Chess());
    setIsGameOver(false);
    setWinner(null);
    setIsGameOverVisible(false); // Reset the visibility state

    // Update the Firebase document to start a new game
    db.collection('games')
      .doc(gameId)
      .update({ fen: new Chess().fen(), isGameOver: false, winner: null, status: 'waiting' })
      .then(() => console.log('New game started'))
      .catch((error) => console.error('Error updating game data:', error));
  }

  return (
    <div style={{ margin: '3rem auto', maxWidth: '80vh', width: '80vw' }}>
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
  );
}

export default Multiplayer;
