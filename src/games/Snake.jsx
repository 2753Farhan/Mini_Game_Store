import React, { useState, useEffect } from "react";

const boardSize = 20; // 20x20 grid

function Snake() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Snake starts in the middle
  const [food, setFood] = useState({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // Snake starts moving to the right
  const [gameOver, setGameOver] = useState(false);

  // Moves the snake every 200ms
  useEffect(() => {
    if (gameOver) return;

    const timerId = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(timerId);
  }, [snake, direction, gameOver]);

  // Moves the snake
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    // Check for collisions (with walls or itself)
    if (isCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      });
    } else {
      newSnake.pop(); // Remove the tail if not eating food
    }

    setSnake(newSnake);
  };

  // Checks if the snake runs into the walls or itself
  const isCollision = (head) => {
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) return true;

    // Check if snake hits itself
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) return true;
    }

    return false;
  };

  // Handles key presses to change the snake's direction
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Snake Game</h1>
      <div className="relative" style={{ width: `${boardSize * 20}px`, height: `${boardSize * 20}px`, border: "2px solid black", position: "relative" }}>
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500"
            style={{
              width: "20px",
              height: "20px",
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          ></div>
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            width: "20px",
            height: "20px",
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        ></div>
      </div>
      {gameOver && (
        <div className="mt-4 text-red-600">
          <h2 className="text-2xl font-semibold">Game Over!</h2>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default Snake;
