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

  useEffect(() => {
    
    return () => {
        if(Piece === 'black'){
            makeRandomMove();
          }
    }
  }, [Piece])
  

  // Let's perform a function on the game state
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // Movement of computer
  function makeRandomMove() {
    const possibleMove = game.moves();
    
    // Select random move
    const randomIndex = Math.floor(Math.random() * possibleMove.length);

    // Play random move
    safeGameMutate((game) => {
      game.move(possibleMove[randomIndex]);
    });

    // Check if the game is over after the computer's move
    checkGameOver();
  }

  // Perform an action when a piece is dropped by a user
  function onDrop(source, target, piece) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: source,
        to: target,
        promotion: piece[1].toLowerCase() ?? "q",
      });
    });

    // Illegal move
    if (move == null) return false;

    
    checkGameOver();
    clearTimeout(currentTimeout);
    setCurrentTimeout(setTimeout(makeRandomMove, 200));
   

    return true;
  }

  // Check if the game is over
  function checkGameOver() {
    if (game.game_over() || game.in_draw()) {
      setIsGameOver(true);
      setWinner(game.in_draw() ? 'Draw' : game.turn() === 'w' ? 'Black' : 'White');
    }
  }

  // Start a new game
  function handleNewGame() {
    setIsGameOver(false);
    setWinner(null);
    safeGameMutate((game) => {
      game.reset();
    });

    // Start with a random move if the computer plays white
    if (Piece === 'black') {
        console.log("newgame")
      makeRandomMove();
    }
  }

  return (
    <div style={{ margin: '3rem auto', maxWidth: '80vh', width: '80vw' }}>
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button id="button" onClick={() => handleNewGame()}>
          New game
        </button>
        <button
          id="button"
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
  );
}

export default HumanVsRandom;
