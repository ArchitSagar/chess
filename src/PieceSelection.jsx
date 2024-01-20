import React, { useState } from 'react';

const PieceSelection = ({ onSelect, onClose }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handlePieceSelect = (piece) => {
    setSelectedPiece(piece);
  };

  const handleConfirm = () => {
    if (selectedPiece) {
      onSelect(selectedPiece);
    }
    onClose();
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-700 p-8 rounded-lg shadow-lg w-80">
      <h2 className="text-2xl mb-4 text-center text-white">Select Your Piece </h2>
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`p-4 rounded-md w-20 ${selectedPiece === 'white' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
          onClick={() => handlePieceSelect('white')}
        >
          white
        </button>
        <button
          className={`p-4 rounded-md w-20 ${selectedPiece === 'black' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
          onClick={() => handlePieceSelect('black')}
        >
          Black
        </button>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-green-500 text-white p-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 w-15"
          onClick={handleConfirm}
        >
          ✔
        </button>
        <button
          className="ml-4 bg-red-500 text-white p-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 w-22"
          onClick={onClose}
        >
          ✘
        </button>
      </div>
    </div>
  );
};

export default PieceSelection;
