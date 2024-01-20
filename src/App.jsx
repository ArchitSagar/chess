// App.jsx

import React, { useState } from 'react';
import UserForm from './UserForm';
import { Outlet } from 'react-router-dom';

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('userName'));

  const handleSignIn = (userName) => {
    // Set user name in local storage
    localStorage.setItem('userName', userName);

    // Set the user state
    setUser(userName);
  };

  return (
    <div>
      {!user ? (
        <UserForm onSignIn={handleSignIn} />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
