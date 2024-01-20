import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';

function HumanVsRandom() {
  const { Piece } = useParams();
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [boardWrapperStyle, setBoardWrapperStyle] = useState({
    width: '80vw',
    maxWidth: '80vh',
    margin: '1rem auto',
  });


  useEffect(() => {
    return () => {
      if (Piece === 'black') {
        makeRandomMove();
      }
    };
  }, [Piece]);

  useEffect(() => {
    function handleResize() {
      const isSmallScreen = window.innerWidth <= 576;
      setBoardWrapperStyle({
        width: isSmallScreen ? '92vw' : '75vw',
        maxWidth: isSmallScreen ? '93vh' : '80vh',
        margin: '1rem auto',
      });
    }

    // Initial setup
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMove = game.moves();
    const randomIndex = Math.floor(Math.random() * possibleMove.length);

    safeGameMutate((game) => {
      game.move(possibleMove[randomIndex]);
    });

    checkGameOver();
  }

  function onDrop(source, target, piece) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: source,
        to: target,
        promotion: piece[1].toLowerCase() ?? 'q',
      });
    });

    if (move == null) return false;

    checkGameOver();
    clearTimeout(currentTimeout);
    setCurrentTimeout(setTimeout(makeRandomMove, 200));

    return true;
  }

  function checkGameOver() {
    if (game.game_over() || game.in_draw()) {
      setIsGameOver(true);
      setWinner(game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White');
    }
  }

  function handleNewGame() {
    setIsGameOver(false);
    setWinner(null);
    safeGameMutate((game) => {
      game.reset();
    });

    if (Piece === 'black') {
      makeRandomMove();
    }
  }

  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 overflow-hidden max-w-screen-lg w-full">
        <div className="flex justify-center" style={boardWrapperStyle}>
          <Chessboard
            id="PlayVsRandom"
            position={game.fen()}
            boardOrientation={Piece === 'black' ? 'black' : 'white'}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>
        {isGameOver && (
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
        <div className="flex justify-center mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleNewGame()}
          >
            New game
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              safeGameMutate((game) => {
                game.undo();
              });
              clearTimeout(currentTimeout);
            }}
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}

export default HumanVsRandom;
