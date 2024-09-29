import React, { useRef, useEffect } from 'react';

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
  const backgroundRef = useRef(null); // Background image reference

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let canvasWidth = window.innerWidth * 0.8;
    let canvasHeight = window.innerHeight * 0.8;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const canvasPosition = canvas.getBoundingClientRect();

    bubblePop1Ref.current = new Audio("/audio/bubbles-single1.wav");
    bubblePop2Ref.current = new Audio("/audio/bubbles-single2.wav");

    bubblePop1Ref.current.load();
    bubblePop2Ref.current.load();

    // Load the background image
    backgroundRef.current = new Image();
    backgroundRef.current.src = '/images/background.png'; // Path to the background image

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX - canvasPosition.left;
      mouseRef.current.y = event.clientY - canvasPosition.top;
    };

    const handleMouseDown = () => {
      userInteractedRef.current = true;
      mouseRef.current.click = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.click = false;
    };

    const resizeCanvas = () => {
      canvasWidth = window.innerWidth * 0.8;
      canvasHeight = window.innerHeight * 0.8;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    playerLeftRef.current = new Image();
    playerLeftRef.current.src = "/images/fish_swim_left.png";

    playerRightRef.current = new Image();
    playerRightRef.current.src = "/images/fish_swim_right.png";

    // Draw the background image
    function handleBackground() {
      ctx.drawImage(backgroundRef.current, 0, 0, canvas.width, canvas.height);
    }
      

    class Player {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.angle = 0;
      }

      update() {
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        this.angle = Math.atan2(dy, dx);
        if (mouseRef.current.x !== this.x) this.x -= dx / 20;
        if (mouseRef.current.y !== this.y) this.y -= dy / 20;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(playerLeftRef.current, 0, 0, this.spriteWidth, this.spriteHeight, -this.spriteWidth / 8, -this.spriteHeight / 8, this.spriteWidth / 4, this.spriteHeight / 4);
        ctx.restore();
      }
    }

    const player = new Player();

    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
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
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
      }
    }

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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Call handleBackground to draw the background before other elements
      handleBackground();

      handleBubbles();
      player.update();
      player.draw();

      ctx.font = "24px 'Press Start 2P', cursive"; // Use the gaming font with increased size
      ctx.fillStyle = 'black';
      ctx.fillText('Score: ' + scoreRef.current, 10, 50);

      gameFrameRef.current++;
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
<div >
  <div className="">
  <canvas ref={canvasRef} className="border-4 border-black flex justify-center items-center bg-gradient-to-b from-blue-500 via-blue-300 to-cyan-500" />
  </div>

</div>

  );
};

export default Bubble_Popper;
