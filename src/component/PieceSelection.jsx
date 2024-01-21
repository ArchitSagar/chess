import React, { useState } from 'react';

const PieceSelection = ({ onSelect, onClose }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  const boxStyles = {
    base: 'border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-80 bg-stone-900 bg-opacity-70 shadow-box h-35 w-60 text-white text-center',
  };

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
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 ${boxStyles.base}`}>
      <h2 className="text-2xl mb-4 text-center ">Select Your Piece </h2>
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`p-4 rounded-md w-20 ${selectedPiece === 'white' ? 'bg-gray-700 text-white' : 'bg-teal-800'}`}
          onClick={() => handlePieceSelect('white')}
        >
          white
        </button>
        <button
          className={`p-4 rounded-md w-20 ${selectedPiece === 'black' ? 'bg-gray-700 text-white' : 'bg-teal-800'}`}
          onClick={() => handlePieceSelect('black')}
        >
          Black
        </button>
      </div>
      <div className="flex justify-center  m-6">
        <button
          className="mr-6 border-white bg-lime-500 p-2 rounded-md hover:bg-lime-600 focus:outline-none focus:ring focus:border-red-300"
          onClick={handleConfirm}
        >
          ✔
        </button>
        <button
          className=" bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 pl-3 pr-3"
          onClick={onClose}
        >
          ✘
        </button>
      </div>
    </div>
  );
};

export default PieceSelection;
