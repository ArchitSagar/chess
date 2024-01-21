import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import GameOverModal from '../component/GameOverModal';
import ChessBoard from '../component/ChessBoard';

function Multiplayer() {
  const { gameId } = useParams();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentUserPiece, setCurrentUserPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isGameOverVisible, setIsGameOverVisible] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const boxStyles = {
    base: 'border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-80 bg-slate-900 bg-opacity-80 shadow-box h-35 w-80 text-white text-center',
  };

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

          setIsCreator(currentMember?.creator || false);
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

  useEffect(() => {
    handleToggleSharePopup();
  }, []);

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

  function handleToggleSharePopup() {
    if (isSharePopupOpen) {
      setIsSharePopupOpen(false);
      setShareUrl('');
      setIsCopied(false);
    } else {
      const currentUrl = window.location.href;
      setShareUrl(currentUrl);
      setIsSharePopupOpen(true);
    }
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 overflow-hidden max-w-screen-lg w-full">
        <ChessBoard game={game} boardOrientation={boardOrientation} onDrop={onDrop} />

        {isCreator && (
          <div>
              {isSharePopupOpen && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${boxStyles.base}`}>
                  <p>Share Link:</p>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full p-2 mt-1 border rounded text-black"
                  />
                  <div className="flex justify-evenly mt-2">
                    <button onClick={handleCopyUrl} className="bg-lime-500 text-white py-1 px-2 rounded">
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleToggleSharePopup} className="bg-lime-500 text-white py-1 px-2 rounded">
                      Close
                    </button>
                  </div>
                </div>
            )}
          </div>
        )}

        {isGameOverVisible && (
          <GameOverModal winner={winner} handleNewGame={handleNewGame} />
        )}
      </div>
    </div>
  );
}

export default Multiplayer;
