import React, { useState } from 'react';
import { Chess } from 'chess.js';
import GameOverModal from '../component/GameOverModal';
import ChessBoard from '../component/ChessBoard';

function PlayLocally() {
  const [game, setGame] = useState(new Chess());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
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

    setIsWhiteTurn(!isWhiteTurn);
    checkGameOver();

    return true;
  }

  function checkGameOver() {
    if (game.game_over() || game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
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
    setIsWhiteTurn(true);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 overflow-hidden max-w-screen-lg w-full">
      <ChessBoard game={game} isWhiteTurn={isWhiteTurn} onDrop={onDrop} />

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
            }}
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayLocally;
