import React from "react";
import { Link } from "react-router-dom"; // For navigation links

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Welcome to My Game Store
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Play some fun and exciting mini online games!
      </p>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Snake Game Card */}
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
          <img
            className="w-full h-48 object-cover"
            src="https://via.placeholder.com/400x300.png?text=Snake+Game"
            alt="Snake Game"
          />
          <div className="px-6 py-4">
            <h2 className="font-bold text-xl mb-2 text-blue-600">Snake Game</h2>
            <p className="text-gray-700 text-base">
              Play the classic Snake game! Guide the snake to eat food and grow, but avoid hitting the walls or the snake itself.
            </p>
          </div>
          <div className="px-6 py-4">
            <Link
              to="/snake"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Play Snake
            </Link>
          </div>
        </div>

        {/* Platformer Game Card */}
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
          <img
            className="w-full h-48 object-cover"
            src="https://via.placeholder.com/400x300.png?text=Platformer+Game"
            alt="Platformer Game"
          />
          <div className="px-6 py-4">
            <h2 className="font-bold text-xl mb-2 text-green-600">Platformer Game</h2>
            <p className="text-gray-700 text-base">
              Jump and run through levels filled with obstacles in this exciting platformer game. Reach the goal without dying!
            </p>
          </div>
          <div className="px-6 py-4">
            <Link
              to="/platformer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Play Platformer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
