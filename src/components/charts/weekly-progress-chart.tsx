"use client";

import { useEffect, useRef } from "react";

interface WeeklyProgressChartProps {
  data: number[];
}

export default function WeeklyProgressChart({
  data,
}: WeeklyProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const maxValue = Math.max(...data, 1);

    // Draw bars
    const barWidth = (canvas.width - 60) / 7;

    days.forEach((day, index) => {
      const value = data[index] || 0;
      const barHeight = (value / maxValue) * (canvas.height - 60);
      const x = 30 + index * barWidth + barWidth * 0.1;
      const y = canvas.height - 30 - barHeight;
      const width = barWidth * 0.8;

      // Draw bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, "#3b82f6");
      gradient.addColorStop(1, "#1d4ed8");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, barHeight);

      // Draw day label
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(day, x + width / 2, canvas.height - 10);

      // Draw value label
      if (value > 0) {
        ctx.fillStyle = "#374151";
        ctx.font = "10px Inter";
        ctx.fillText(value.toString(), x + width / 2, y - 5);
      }
    });
  }, [data]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-48"
        style={{ maxWidth: "100%", height: "200px" }}
      />
    </div>
  );
}
