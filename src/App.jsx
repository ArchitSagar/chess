// import './App.css';
import React from 'react'
import { Outlet } from "react-router-dom";
import UserForm from './UserForm'


export default function App() {
  const user = localStorage.getItem('userName');

  return (
    <div>
      {!user ? <UserForm /> : <Outlet />}
    </div>
  );
}

