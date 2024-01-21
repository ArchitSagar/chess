import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';
import GameOverModal from '../component/GameOverModal';
import ChessBoard from '../component/ChessBoard';


function HumanVsRandom() {
  const { Piece } = useParams();
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);


  useEffect(() => {
    return () => {
      if (Piece === 'black') {
        makeRandomMove();
      }
    };
  }, [Piece]);

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
      {console.log('Piece:', Piece)}
      <ChessBoard game={game} Piece={Piece} onDrop={onDrop} />

        {isGameOver && (
          <GameOverModal winner={winner} handleNewGame={handleNewGame} />
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
