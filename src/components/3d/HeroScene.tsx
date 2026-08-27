"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic 3D hero background — pure canvas, no WebGL dependency.
 * Particles in projected 3D space + orbiting film rings + mouse parallax.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    type Particle = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      alpha: number;
    };

    const particles: Particle[] = [];
    const PARTICLE_COUNT = reduceMotion ? 40 : 120;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: (Math.random() - 0.5) * 1600,
          y: (Math.random() - 0.5) * 1000,
          z: Math.random() * 1200 + 200,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          vz: -0.2 - Math.random() * 0.4,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0.15 + Math.random() * 0.55,
        });
      }
    }

    function project(x: number, y: number, z: number, t: number) {
      const parallaxX = mouse.x * 80;
      const parallaxY = mouse.y * 50;
      const rotY = t * 0.08 + mouse.x * 0.15;
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const depth = rz + 800;
      const scale = 600 / Math.max(depth, 1);
      return {
        sx: w / 2 + (rx + parallaxX) * scale,
        sy: h / 2 + (y + parallaxY) * scale * 0.85,
        scale,
        depth,
      };
    }

    function drawRing(
      t: number,
      radius: number,
      tilt: number,
      speed: number,
      color: string
    ) {
      const points = 48;
      ctx!.beginPath();
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2 + t * speed;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius * tilt;
        const z = Math.sin(a) * radius * 0.35;
        const p = project(x, y, z + 400, t);
        if (i === 0) ctx!.moveTo(p.sx, p.sy);
        else ctx!.lineTo(p.sx, p.sy);
      }
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function drawFrame(t: number, ox: number, oy: number, oz: number, rot: number) {
      const halfW = 90;
      const halfH = 55;
      const corners = [
        [-halfW, -halfH, 0],
        [halfW, -halfH, 0],
        [halfW, halfH, 0],
        [-halfW, halfH, 0],
      ] as const;

      const cos = Math.cos(rot + t * 0.2);
      const sin = Math.sin(rot + t * 0.2);

      ctx!.beginPath();
      corners.forEach(([cx, cy, cz], i) => {
        const rx = cx * cos - cz * sin;
        const rz = cx * sin + cz * cos + oz;
        const p = project(rx + ox, cy + oy, rz, t);
        if (i === 0) ctx!.moveTo(p.sx, p.sy);
        else ctx!.lineTo(p.sx, p.sy);
      });
      ctx!.closePath();
      ctx!.strokeStyle = "rgba(225, 29, 72, 0.35)";
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      ctx!.fillStyle = "rgba(225, 29, 72, 0.04)";
      ctx!.fill();
    }

    let start = performance.now();

    function frame(now: number) {
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      ctx!.clearRect(0, 0, w, h);

      // soft vignette center glow
      const grd = ctx!.createRadialGradient(
        w / 2,
        h / 2,
        40,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.55
      );
      grd.addColorStop(0, "rgba(225, 29, 72, 0.06)");
      grd.addColorStop(0.45, "rgba(20, 20, 30, 0.15)");
      grd.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, w, h);

      if (!reduceMotion) {
        drawRing(t, 280, 0.35, 0.25, "rgba(255,255,255,0.08)");
        drawRing(t, 360, 0.55, -0.18, "rgba(225,29,72,0.12)");
        drawRing(t, 440, 0.25, 0.12, "rgba(255,255,255,0.05)");

        drawFrame(t, -220, -40, 200, 0.4);
        drawFrame(t, 240, 30, 280, -0.6);
        drawFrame(t, 0, 120, 350, 0.2);
      }

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          if (p.z < 50) {
            p.z = 1200 + Math.random() * 200;
            p.x = (Math.random() - 0.5) * 1600;
            p.y = (Math.random() - 0.5) * 1000;
          }
        }
        const proj = project(p.x, p.y, p.z, t * 0.15);
        if (proj.depth < 50) continue;
        const r = Math.max(0.4, p.size * proj.scale * 1.2);
        const a = Math.min(1, p.alpha * (1 - proj.depth / 1400));
        ctx!.beginPath();
        ctx!.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(245,245,245,${a})`;
        ctx!.fill();
      }

      // horizon line
      ctx!.strokeStyle = "rgba(255,255,255,0.04)";
      ctx!.beginPath();
      ctx!.moveTo(0, h * 0.62);
      ctx!.lineTo(w, h * 0.62);
      ctx!.stroke();

      rafRef.current = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      mouse.tx = (e.clientX / w) * 2 - 1;
      mouse.ty = (e.clientY / h) * 2 - 1;
    }

    function onTouch(e: TouchEvent) {
      if (!e.touches[0]) return;
      mouse.tx = (e.touches[0].clientX / w) * 2 - 1;
      mouse.ty = (e.touches[0].clientY / h) * 2 - 1;
    }

    resize();
    seed();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
