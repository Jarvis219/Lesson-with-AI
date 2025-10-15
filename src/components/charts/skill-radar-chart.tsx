"use client";

import { useEffect, useRef } from "react";

interface SkillRadarChartProps {
  data: {
    vocab: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    const skills = [
      { key: "vocab", label: "Từ vựng", color: "#3b82f6" },
      { key: "grammar", label: "Ngữ pháp", color: "#10b981" },
      { key: "listening", label: "Nghe", color: "#f59e0b" },
      { key: "speaking", label: "Nói", color: "#ef4444" },
      { key: "reading", label: "Đọc", color: "#8b5cf6" },
      { key: "writing", label: "Viết", color: "#ec4899" },
    ];

    // Draw grid circles
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw grid lines
    skills.forEach((_, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw data polygon
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();

    skills.forEach((skill, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const score = data[skill.key as keyof typeof data] || 0;
      const r = (radius / 100) * score;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    ctx.fillStyle = "#3b82f6";
    skills.forEach((skill, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const score = data[skill.key as keyof typeof data] || 0;
      const r = (radius / 100) * score;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#374151";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";

    skills.forEach((skill, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius + 20);
      const y = centerY + Math.sin(angle) * (radius + 20);

      ctx.fillText(skill.label, x, y + 4);
    });

    // Draw score labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px Inter";
    for (let i = 20; i <= 100; i += 20) {
      const x = centerX + 5;
      const y = centerY - (radius / 100) * i + 4;
      ctx.textAlign = "left";
      ctx.fillText(i.toString(), x, y);
    }
  }, [data]);

  return (
    <div className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-72"
        style={{ maxWidth: "300px", height: "300px" }}
      />
    </div>
  );
}
