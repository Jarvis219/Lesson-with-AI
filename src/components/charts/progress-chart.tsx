"use client";

import { useEffect, useRef } from "react";

interface ProgressChartProps {
  data: any[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare data
    const scores = data.map((item) => item.score || 0);
    const maxScore = Math.max(...scores, 100);
    const minScore = Math.min(...scores, 0);

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (canvas.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw line chart
    if (scores.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();

      scores.forEach((score, index) => {
        const x = (canvas.width / (scores.length - 1)) * index;
        const y =
          canvas.height -
          ((score - minScore) / (maxScore - minScore)) * canvas.height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      ctx.fillStyle = "#3b82f6";
      scores.forEach((score, index) => {
        const x = (canvas.width / (scores.length - 1)) * index;
        const y =
          canvas.height -
          ((score - minScore) / (maxScore - minScore)) * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minScore + ((maxScore - minScore) / 5) * (5 - i);
      const y = (canvas.height / 5) * i;
      ctx.fillText(Math.round(value).toString(), 20, y + 4);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-sm">Chưa có dữ liệu</div>
          <div className="text-xs">
            Hoàn thành một số bài học để xem biểu đồ
          </div>
        </div>
      </div>
    );
  }

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
