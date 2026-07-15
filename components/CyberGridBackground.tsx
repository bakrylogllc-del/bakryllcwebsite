"use client";
import React, { useEffect, useRef } from "react";

export const CyberGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const config = {
      gridSize: 40,
      particleCount: 40,
      particleSpeedMin: 0.5,
      particleSpeedMax: 3,
      particleColors: ["#111111", "#C6B28A", "#55624A"],
      trailLength: 40, 
      backgroundColor: "#E6E2D6",
      rippleDuration: 2000,
      rippleMaxRadius: 200,
    };

    const occupiedLines = {
      horizontal: new Set<number>(),
      vertical: new Set<number>(),
    };

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";
    let animationId: number;
    let ripples: Ripple[] = [];
    
    let bgCanvas: HTMLCanvasElement | null = null;
    let bgCtx: CanvasRenderingContext2D | null = null;

    function createStaticGrid() {
      if (!canvas) return;
      if (!bgCanvas) {
        bgCanvas = document.createElement("canvas");
        bgCtx = bgCanvas.getContext("2d", { alpha: false });
      }
      if (!bgCtx) return;

      bgCanvas.width = canvas.width;
      bgCanvas.height = canvas.height;

      bgCtx.fillStyle = config.backgroundColor;
      bgCtx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = bgCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(85, 98, 74, 0.35)");
      gradient.addColorStop(1, "rgba(85, 98, 74, 0)");
      bgCtx.strokeStyle = gradient;
      bgCtx.lineWidth = 1;

      bgCtx.beginPath();
      for (let y = 0; y < canvas.height; y += config.gridSize) {
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(canvas.width, y);
      }
      for (let x = 0; x < canvas.width; x += config.gridSize) {
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, canvas.height);
      }
      bgCtx.stroke();
    }

    class Particle {
      color: string;
      speed: number;
      active: boolean = false;
      direction: "horizontal" | "vertical" = "horizontal";
      x: number = 0;
      y: number = 0;
      trail: { x: number; y: number }[] = [];

      constructor() {
        this.color = config.particleColors[Math.floor(Math.random() * config.particleColors.length)];
        this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
        this.reset();
      }

      update() {
        if (!canvas) return;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > config.trailLength) this.trail.shift();

        if (this.active) {
          if (this.direction === "horizontal") {
            this.x += this.speed;
            if (this.x > canvas.width) {
              this.active = false;
              occupiedLines.horizontal.delete(this.y);
            }
          } else {
            this.y += this.speed;
            if (this.y > canvas.height) {
              this.active = false;
              occupiedLines.vertical.delete(this.x);
            }
          }
        } else {
          const allTrailPointsOffScreen = this.trail.every(
            (point) =>
              (this.direction === "horizontal" && point.x > canvas.width) ||
              (this.direction === "vertical" && point.y > canvas.height)
          );
          if (allTrailPointsOffScreen) this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = i / this.trail.length;
          ctx.fillStyle = this.color === "#111111" ? `rgba(17, 17, 17, ${alpha})` : 
                          this.color === "#C6B28A" ? `rgba(198, 178, 138, ${alpha})` : 
                          `rgba(85, 98, 74, ${alpha})`;
          ctx.fillRect(point.x, point.y, 1.5, 1.5);
        }
      }

      findAvailableLine() {
        if (!canvas) return false;
        const maxAttempts = 20;
        let attempts = 0;

        while (attempts < maxAttempts) {
          if (Math.random() > 0.5) {
            const y = Math.round((Math.random() * canvas.height) / config.gridSize) * config.gridSize;
            if (!occupiedLines.horizontal.has(y)) {
              this.direction = "horizontal";
              this.x = 0;
              this.y = y;
              occupiedLines.horizontal.add(y);
              return true;
            }
          } else {
            const x = Math.round((Math.random() * canvas.width) / config.gridSize) * config.gridSize;
            if (!occupiedLines.vertical.has(x)) {
              this.direction = "vertical";
              this.x = x;
              this.y = 0;
              occupiedLines.vertical.add(x);
              return true;
            }
          }
          attempts++;
        }
        return false;
      }

      reset() {
        if (this.findAvailableLine()) {
          this.trail = [];
          this.active = true;
          this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
        } else {
          this.active = false;
          this.trail = [];
        }
      }
    }

    class Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      startTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = config.rippleMaxRadius;
        this.startTime = Date.now();
      }

      update() {
        const elapsed = Date.now() - this.startTime;
        this.radius = (elapsed / config.rippleDuration) * this.maxRadius;
      }

      draw() {
        if (!ctx) return;
        const alpha = Math.max(0, 1 - this.radius / this.maxRadius);
        ctx.strokeStyle = `rgba(17, 17, 17, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (Math.random() < 0.2) {
          ctx.fillStyle = `rgba(17, 17, 17, ${alpha})`;
          ctx.font = "14px monospace";
          const char = characters[Math.floor(Math.random() * characters.length)];
          ctx.fillText(
            char,
            this.x + (Math.random() - 0.5) * this.radius * 2,
            this.y + (Math.random() - 0.5) * this.radius * 2
          );
        }
      }

      isComplete() {
        return this.radius >= this.maxRadius;
      }
    }

    const particles = Array(config.particleCount).fill(null).map(() => new Particle());

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStaticGrid(); 
      occupiedLines.horizontal.clear();
      occupiedLines.vertical.clear();
      particles.forEach((particle) => particle.reset());
    };

    const animate = () => {
      if (!ctx || !bgCanvas || !canvas) return;
      ctx.drawImage(bgCanvas, 0, 0);
      particles.forEach((particle) => { particle.update(); particle.draw(); });
      ripples = ripples.filter((ripple) => !ripple.isComplete());
      ripples.forEach((ripple) => { ripple.update(); ripple.draw(); });
      animationId = requestAnimationFrame(animate);
    };

    const handleClick = (event: MouseEvent) => {
      ripples.push(new Ripple(event.clientX, event.clientY));
    };

    window.addEventListener("resize", resize);
    window.addEventListener("click", handleClick);
    
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};