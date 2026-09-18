import React, { useEffect, useRef } from "react";

export default function ParticleEffect({ isDark }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2;
        this.radius = Math.random() * 3.5 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = Math.random() > 0.5 ? "#E85D3A" : "#F5A623";
        this.gravity = 0.12;
      }
      update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.alpha -= this.decay; if (this.radius > 0.1) this.radius -= 0.04; }
      draw(c) {
        c.save(); c.globalAlpha = this.alpha;
        c.shadowBlur = 8; c.shadowColor = this.color;
        c.fillStyle = this.color; c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2); c.fill(); c.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const p = particlesRef.current;
      for (let i = p.length - 1; i >= 0; i--) {
        p[i].update();
        if (p[i].alpha <= 0 || p[i].radius <= 0) p.splice(i, 1);
        else p[i].draw(ctx);
      }
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);

    window.triggerDopaParticles = (x, y) => {
      for (let i = 0; i < 25; i++) particlesRef.current.push(new Particle(x, y));
    };

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(id); delete window.triggerDopaParticles; };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" />;
}
