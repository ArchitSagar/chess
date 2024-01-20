import React, { useMemo, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams } from 'react-router-dom';
import Engine from "./engine.ts";

function HumanVsComputer() {
  const { Piece } = useParams();
  const levels = {
    "Easy (500)": 1,
    "Medium (1500)": 4,
    "Hard (2000)": 18,
  };
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [boardWrapperStyle, setBoardWrapperStyle] = useState({
    width: '80vw',
    maxWidth: '80vh',
    margin: '1rem auto',
  });

  useEffect(() => {
    console.log(`Selected piece: ${Piece}`);
    if (Piece === 'black') {
      findBestMove();
    } else {
      setGamePosition(game.fen());
    }
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

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setGamePosition(game.fen());
        checkGameOver();
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

    if (move === null) return false;

    checkGameOver();
    findBestMove();

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
    game.reset();
    const selectedPiece = Piece || 'white';

    
    if (selectedPiece === 'black') {
      findBestMove(); 
    } else {
      setGamePosition(game.fen());
    } 
 }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-2 overflow-hidden max-w-screen-lg w-full">
        <div className='flex justify-center mb-2'>
        {Object.entries(levels).map(([level, depth]) => (
          <button
          className="px-4 py-2 text-white rounded m-2"
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
        
      <div className="flex justify-center" style={boardWrapperStyle}>
          <Chessboard
            id="PlayVsComputer"
            position={gamePosition}
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
        <div className="flex justify-center mt-2 space-x-4">
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

export default HumanVsComputer;
