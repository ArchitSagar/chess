import React from 'react'
import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function HumanVsRandom() {
    const [game, setGame] = useState(new Chess());
    const [currentTimeout, setCurrentTimeout] = useState(null);

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

        // Exit if the game is over
        if (game.game_over() || game.in_draw() || possibleMove.length === 0) return;

        // Select random move
        const randomIndex = Math.floor(Math.random() * possibleMove.length);

        // Play random move
        safeGameMutate((game) => {
        game.move(possibleMove[randomIndex]);
        });
    }

    // Perform an action when a piece is dropped by a user
    function onDrop(source, target) {
        let move = null;
        safeGameMutate((game) => {
        move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });
        });

        // Illegal move
        if (move == null) return false;

        // Valid move
        clearTimeout(currentTimeout);
        setCurrentTimeout(setTimeout(makeRandomMove, 200));
        
        return true;
    }

    return (
        <div style={{ margin: '3rem auto', maxWidth: '80vh', width: '80vw' }}>
        <Chessboard
            id="PlayVsRandom"
            position={game.fen()}
            onPieceDrop={onDrop}
            customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
        />
        <button
            id="button"
            onClick={() => {
            safeGameMutate((game) => {
                game.reset();
            });
            clearTimeout(currentTimeout);
            }}
        >
            reset
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
            undo
        </button>
        </div>
    );
}

export default HumanVsRandom