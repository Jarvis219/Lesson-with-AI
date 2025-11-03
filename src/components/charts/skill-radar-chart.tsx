"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-600 mb-1">
          {payload[0].payload?.subject || "Skill"}
        </p>
        <p className="text-lg font-bold text-blue-600">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  const chartData = [
    { subject: "Vocabulary", A: data.vocab, fullMark: 100 },
    { subject: "Grammar", A: data.grammar, fullMark: 100 },
    { subject: "Listening", A: data.listening, fullMark: 100 },
    { subject: "Speaking", A: data.speaking, fullMark: 100 },
    { subject: "Reading", A: data.reading, fullMark: 100 },
    { subject: "Writing", A: data.writing, fullMark: 100 },
  ];

  // Check if there's any data
  const hasData = Object.values(data).some((value) => value > 0);

  if (!hasData) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-sm font-medium">No skill data yet</div>
          <div className="text-xs">
            Complete some lessons to see your skill levels
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#374151", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
