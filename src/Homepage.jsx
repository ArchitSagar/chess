import React from 'react'
import { Link } from 'react-router-dom';


function Homepage() {
    const containerStyle = {
        backgroundImage: 'url("src/assets/chessWalnutBg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <>
        
        <div className="flex flex-col justify-center items-center h-screen w-screen" style={containerStyle}>
            <img className='h-40 w-40 mb-20' src="src/assets/chessPng.png" alt="chess" />
            <Link to="/HumanVsComputer" className="border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-20 bg-white bg-opacity-10 shadow-box h-35 w-60 text-white text-center">
                Multiplayer
            </Link>
            <Link to="/HumanVsComputer" className="border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-20 bg-white bg-opacity-10 shadow-box h-35 w-60 text-white text-center">
                Multiplayer
            </Link>
            <Link to="/HumanVsComputer" className="border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-20 bg-white bg-opacity-10 shadow-box h-35 w-60 text-white text-center">
                Multiplayer
            </Link>
            <Link to="/HumanVsComputer" className="border-2 border-solid border-white border-opacity-25 rounded-xl font-bold m-2 p-3 hover:bg-opacity-20 bg-white bg-opacity-10 shadow-box h-35 w-60 text-white text-center">
                Multiplayer
            </Link>
        </div>
    </>
    

  )
}

export default Homepage