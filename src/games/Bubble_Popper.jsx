import React, { useRef, useEffect, useState } from 'react';

const Bubble_Popper = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, click: false });
  const requestRef = useRef();
  const bubblesArrayRef = useRef([]);
  const gameFrameRef = useRef(0);
  const scoreRef = useRef(0);
  const bubblePop1Ref = useRef(null);
  const bubblePop2Ref = useRef(null);
  const userInteractedRef = useRef(false);
  const playerLeftRef = useRef(null);
  const playerRightRef = useRef(null);
  const backgroundRef = useRef(null);
  const bubbleImageRef = useRef(null);
  const enemyImageRef = useRef(null);
  const BG = useRef({
    x1: 0,
    x2: 0,
    y: 0,
    width: 0,
    height: 0,
  }).current;
  const gameSpeed = 2;
  const enemiesRef = useRef([]);

  const [gameState, setGameState] = useState('notStarted');
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set a fixed canvas size for better game functionality
    const canvasWidth = 800;
    const canvasHeight = 600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const canvasPosition = canvas.getBoundingClientRect();

    bubblePop1Ref.current = new Audio("/audio/bubbles-single1.wav");
    bubblePop2Ref.current = new Audio("/audio/bubbles-single2.wav");
    bubblePop1Ref.current.load();
    bubblePop2Ref.current.load();

    backgroundRef.current = new Image();
    backgroundRef.current.src = '/images/background.png';

    enemyImageRef.current = new Image();
    enemyImageRef.current.src = '/images/enemy_sprite.png'

    BG.x2 = canvasWidth;
    BG.width = canvasWidth;
    BG.height = canvasHeight;

    playerLeftRef.current = new Image();
    playerLeftRef.current.src = "/images/fish_swim_right.png";
    playerRightRef.current = new Image();
    playerRightRef.current.src = "/images/fish_swim_left.png";

    bubbleImageRef.current = new Image();
    bubbleImageRef.current.src = "/images/bubble_pop.png"

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current.x = (event.clientX - rect.left) * scaleX;
      mouseRef.current.y = (event.clientY - rect.top) * scaleY;
    };

    const handleMouseDown = () => {
      userInteractedRef.current = true;
      mouseRef.current.click = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.click = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    class Player {
      constructor() {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.radius = 40;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.angle = 0;
      }

      update() {
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        this.angle = Math.atan2(dy, dx);
        if (mouseRef.current.x !== this.x) this.x -= dx / 15;
        if (mouseRef.current.y !== this.y) this.y -= dy / 15;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
          this.angle > -Math.PI/2 && this.angle < Math.PI/2 ? playerRightRef.current : playerLeftRef.current,
          0, 0, this.spriteWidth, this.spriteHeight,
          -this.spriteWidth / 10, -this.spriteHeight / 10,
          this.spriteWidth / 5, this.spriteHeight / 5
        );
        ctx.restore();
      }
    }

    class Bubble {
      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + 100;
        this.radius = 40;
        this.speed = Math.random() * 5 + 2;
        this.distance = 0;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
      }

      update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        const imageSize = this.radius * 2.6;
        ctx.drawImage(bubbleImageRef.current, this.x - imageSize / 2, this.y - imageSize / 2, imageSize, imageSize);
      }
    }

    function handleGameOver() {
      setGameState('ended');
      setFinalScore(scoreRef.current);
      cancelAnimationFrame(requestRef.current);
    }

    class Enemy {
      constructor() {
        this.x = canvasWidth + 200;
        this.y = Math.random() * (canvasHeight - 150) + 90;
        this.radius = 50;
        this.speed = Math.random() * 3 + 3;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
      }

      draw() {
        ctx.drawImage(
          enemyImageRef.current,
          this.frameX * this.spriteWidth,
          this.frameY * this.spriteHeight,
          this.spriteWidth,
          this.spriteHeight,
          this.x - 60,
          this.y - 45,
          this.spriteWidth / 4,
          this.spriteHeight / 4
        );
      }

      update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {
          this.x = canvasWidth + 200;
          this.y = Math.random() * (canvasHeight - 150) + 90;
          this.speed = Math.random() * 3 + 3;
        }
        if (gameFrameRef.current % 5 == 0) {
          this.frame++;
          if (this.frame >= 12) this.frame = 0;
          if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
            this.frameX = 0;
          } else {
            this.frameX++;
          }

          if (this.frame < 3) this.frameY = 0;
          else if (this.frame < 7) this.frameY = 1;
          else if (this.frame < 11) this.frameY = 2;
          else this.frameY = 0;
        }
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + player.radius) {
          handleGameOver();
        }
      }
    }

    const player = new Player();

    const handleBackground = () => {
      BG.x1 -= gameSpeed;
      BG.x2 -= gameSpeed;
      if (BG.x1 <= -BG.width) BG.x1 = BG.width;
      if (BG.x2 <= -BG.width) BG.x2 = BG.width;
      ctx.drawImage(backgroundRef.current, BG.x1, BG.y, BG.width, BG.height);
      ctx.drawImage(backgroundRef.current, BG.x2, BG.y, BG.width, BG.height);
    };

    function handleBubbles() {
      if (gameFrameRef.current % 50 === 0) {
        bubblesArrayRef.current.push(new Bubble());
      }
      for (let i = 0; i < bubblesArrayRef.current.length; i++) {
        bubblesArrayRef.current[i].update();
        bubblesArrayRef.current[i].draw();

        if (bubblesArrayRef.current[i].distance < bubblesArrayRef.current[i].radius + player.radius) {
          if (!bubblesArrayRef.current[i].counted) {
            if (userInteractedRef.current) {
              if (bubblesArrayRef.current[i].sound === 'sound1') {
                bubblePop1Ref.current.play().catch(e => console.error("Error playing sound:", e));
              } else {
                bubblePop2Ref.current.play().catch(e => console.error("Error playing sound:", e));
              }
            }
            scoreRef.current++;
            bubblesArrayRef.current[i].counted = true;
            bubblesArrayRef.current.splice(i, 1);
            i--;
          }
        }
      }
      for (let i = 0; i < bubblesArrayRef.current.length; i++) {
        if (bubblesArrayRef.current[i].y < 0 - bubblesArrayRef.current[i].radius * 2) {
          bubblesArrayRef.current.splice(i, 1);
          i--;
        }
      }
    }

    function handleEnemies() {
      if (enemiesRef.current.length < Math.floor(scoreRef.current / 20) + 1) {
        enemiesRef.current.push(new Enemy());
      }
      
      for (let i = 0; i < enemiesRef.current.length; i++) {
        enemiesRef.current[i].update();
        enemiesRef.current[i].draw();
        
        if (enemiesRef.current[i].x < -enemiesRef.current[i].radius * 2) {
          enemiesRef.current[i] = new Enemy();
        }
      }
    }

    const animate = () => {
      if (gameState !== 'playing') return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      handleBackground();
      handleBubbles();
      player.update();
      player.draw();
      handleEnemies();
      ctx.font = "24px 'Press Start 2P', cursive";
      ctx.fillStyle = 'black';
      ctx.fillText('Score: ' + scoreRef.current, 10, 50);
      gameFrameRef.current++;
      requestRef.current = requestAnimationFrame(animate);
    };

    if (gameState === 'playing') {
      animate();
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
   
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    initializeGame();
    requestAnimationFrame(animate);
  };

  const restartGame = () => {
    startGame();
  };

  const initializeGame = () => {
    scoreRef.current = 0;
    bubblesArrayRef.current = [];
    enemiesRef.current = [];
    gameFrameRef.current = 0;
    
    // Reinitialize the background slider
    BG.x1 = 0;
    BG.x2 = BG.width;
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <canvas ref={canvasRef} className="border-4 border-black bg-gradient-to-b from-blue-500 via-blue-300 to-cyan-500" />
      
      {gameState === 'notStarted' && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded"
          onClick={startGame}
        >
          Start Game
        </button>
      )}

      {gameState === 'ended' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg text-center">
          <h2 className="text-2xl mb-2">Game Over!</h2>
          <p className="mb-4">Your score: {finalScore}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={restartGame}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Bubble_Popper;