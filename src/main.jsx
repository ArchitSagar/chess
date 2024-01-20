import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import HumanVsComputer from './pages/HumanVsComputer.jsx';
import Homepage from './pages/Homepage.jsx';
import HumanVsRandom from './pages/HumanVsRandom.jsx';
import Multiplayer from './pages/Multiplayer.jsx';
import PlayLocally from './pages/PlayLocally.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index element={<Homepage />} />
      <Route path="PLayLocally/:Piece" element={<PlayLocally />} />
      <Route path="HumanVsRandom/:Piece" element={<HumanVsRandom />} />
      <Route path="HumanVsComputer/:Piece" element={<HumanVsComputer />} />
      <Route path="Multiplayer/:gameId" element={<Multiplayer />} />

    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
