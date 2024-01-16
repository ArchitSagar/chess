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
import HumanVsComputer from './HumanVsComputer';
import Homepage from './Homepage';
import HumanVsRandom from './HumanVsRandom';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index element={<Homepage />} />
      <Route path="HumanVsRandom" element={<HumanVsRandom />} />
      <Route path="HumanVsComputer" element={<HumanVsComputer />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
