"use client";
import { useEffect, useRef } from "react";

export default function StarStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Track mouse position for interactive connections
    let mouse = { x: -1000, y: -1000 }; 
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseOut = () => {
      mouse = { x: -1000, y: -1000 };
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        // Slow, smooth drift
        this.vx = (Math.random() - 0.5) * 0.6; 
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        // Seamlessly bounce off the walls
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.8)"; // Tailwind cyan-400
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Dynamically calculate particle count based on screen size for performance
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000); 
      const limit = Math.min(numberOfParticles, 120); // Hard cap to prevent lag
      
      for (let i = 0; i < limit; i++) {
        particles.push(new Particle());
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // 1. Connect particles to each other
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If nodes are close, draw a cyan line between them
          if (distance < 120) {
            ctx.beginPath();
            // Opacity fades out as they get further apart
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 - distance / 800})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // 2. Connect particles to the user's mouse
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        // If mouse gets close to a node, draw a violet line and pull it slightly
        if (distanceMouse < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.25 - distanceMouse / 720})`; // Tailwind violet-400
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Subtle magnetic pull towards the cursor
          particles[i].x -= dxMouse * 0.015;
          particles[i].y -= dyMouse * 0.015;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Fixed to the background, won't block clicks to your actual website
      className="fixed inset-0 pointer-events-none opacity-70 z-0" 
      aria-hidden="true"
    />
  );
}