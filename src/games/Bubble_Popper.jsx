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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
    const canvasPosition = canvas.getBoundingClientRect();

    // Create audio elements
    bubblePop1Ref.current = new Audio("/public/audio/bubbles-single1.wav");
    bubblePop2Ref.current = new Audio("/audio/bubbles-single2.wav");

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX - canvasPosition.left;
      mouseRef.current.y = event.clientY - canvasPosition.top;
    };

    const handleMouseDown = () => {
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
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 50;
      }

      update() {
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        if (mouseRef.current.x !== this.x) this.x -= dx / 20;
        if (mouseRef.current.y !== this.y) this.y -= dy / 20;
      }

      draw() {
        if (mouseRef.current.click) {
          ctx.lineWidth = 0.2;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const player = new Player();

    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
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
          console.log('collision');
          scoreRef.current++;
          // Play the appropriate sound
          if (bubblesArrayRef.current[i].sound === 'sound1') {
            bubblePop1Ref.current.play();
          } else {
            bubblePop2Ref.current.play();
          }
          bubblesArrayRef.current.splice(i, 1);
          i--;
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
      handleBubbles();
      player.update();
      player.draw();
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
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '4px solid black' }} />
    </div>
  );
};

export default Bubble_Popper;