import React, { useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Engine from "./engine.ts";
import './App.css';

function HumanVsComputer()  {
    const levels = {
        "Easy (500)": 2,
        "Medium (1500)": 8,
        "Hard (2000)": 18,
      };
      const engine = useMemo(() => new Engine(), []);
      const game = useMemo(() => new Chess(), []);
    
      const [gamePosition, setGamePosition] = useState(game.fen());
      const [stockfishLevel, setStockfishLevel] = useState(2);
    
      function findBestMove() {
        engine.evaluatePosition(game.fen(), stockfishLevel);
    
        engine.onMessage(({ bestMove }) => {
          if (bestMove) {
            // In latest chess.js versions you can just write ```game.move(bestMove)```
            game.move({
              from: bestMove.substring(0, 2),
              to: bestMove.substring(2, 4),
              promotion: bestMove.substring(4, 5),
            });
    
            setGamePosition(game.fen());
          }
        });
      }
    
      function onDrop(sourceSquare, targetSquare, piece) {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: piece[1].toLowerCase() ?? "q",
        });
        setGamePosition(game.fen());
    
        // illegal move
        if (move === null) return false;
    
        // exit if the game is over
        if (game.game_over() || game.in_draw()) return false;
    
        findBestMove();
    
        return true;
      }
    
      return (
        <div id="main" >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {Object.entries(levels).map(([level, depth]) => (
              <button id='button'
                key={level}
                style={{
                  backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
                }}
                onClick={() => setStockfishLevel(depth)}
              >
                {level}
              </button>
            ))}
          </div>
    
          <Chessboard
            id="PlayVsStockfish"
            position={gamePosition}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          />
          <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
          >
            <button
            id='button'
            onClick={() => {
              game.reset();
              setGamePosition(game.fen());
            }}
          >
            New game
          </button>
          <button
            id='button'
            onClick={() => {
              game.undo();
              game.undo();
              setGamePosition(game.fen());
            }}
          >
            Undo
          </button>
          </div>
          
        </div>
      );
};

export default HumanVsComputer;