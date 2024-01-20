// UserForm.jsx

import React, { useState } from 'react';
import { auth } from './firebase';

export default function UserForm({ onSignIn }) {
  const [name, setName] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Wait for signInAnonymously to complete
      await auth.signInAnonymously();

      // If successful, set user name in local storage and notify the parent component
      localStorage.setItem('userName', name);

      // Notify the parent component about the sign-in
      onSignIn(name);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      // Handle the error if signInAnonymously fails
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url("src/assets/chessWalnutBg.jpg")' }}>
      <form className="user-form p-4 max-w-md mx-auto bg-white rounded-md shadow-md" onSubmit={handleSubmit} >
        <h1 className="text-2xl font-bold mb-4">Enter your name to start</h1>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <button
            className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
            type="submit"
          >
            Start
          </button>
        </div>
      </form>
    </div>
  );
}
