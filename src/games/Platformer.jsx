import React, { useState, useEffect } from "react";

const gravity = 0.5;
const jumpForce = -10;
const speed = 5;

function Platformer() {
  const [player, setPlayer] = useState({ x: 50, y: 400, velocityY: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && !isJumping) {
        setIsJumping(true);
        setPlayer((prev) => ({ ...prev, velocityY: jumpForce }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowUp") {
        setIsJumping(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        updatePlayer();
        updateObstacles();
        checkCollision();
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [player, obstacles, gameOver]);

  const updatePlayer = () => {
    setPlayer((prev) => {
      let newY = prev.y + prev.velocityY;
      let newVelocityY = prev.velocityY + gravity;

      // Prevent the player from falling through the ground
      if (newY >= 400) {
        newY = 400;
        newVelocityY = 0;
      }

      return { ...prev, y: newY, velocityY: newVelocityY };
    });
  };

  const updateObstacles = () => {
    setObstacles((prevObstacles) => {
      let newObstacles = prevObstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - speed,
      }));

      // Remove obstacles that are off the screen
      newObstacles = newObstacles.filter((obstacle) => obstacle.x > -50);

      // Randomly add a new obstacle
      if (Math.random() < 0.02) {
        newObstacles.push({ x: 800, y: 400 - 20, width: 20, height: 20 });
      }

      return newObstacles;
    });
  };

  const checkCollision = () => {
    for (let obstacle of obstacles) {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + 20 > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + 20 > obstacle.y
      ) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setPlayer({ x: 50, y: 400, velocityY: 0 });
    setObstacles([]);
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Impossible Platformer</h1>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <button onClick={resetGame}>Restart</button>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "800px",
            height: "450px",
            border: "2px solid black",
            backgroundColor: "#add8e6",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${player.x}px`,
              top: `${player.y}px`,
              width: "20px",
              height: "20px",
              backgroundColor: "green",
            }}
          ></div>

          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${obstacle.x}px`,
                top: `${obstacle.y}px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
                backgroundColor: "red",
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Platformer;
