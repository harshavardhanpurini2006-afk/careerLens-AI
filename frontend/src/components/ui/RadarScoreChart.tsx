"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { RadarDataPoint } from "../../types";

interface RadarScoreChartProps {
  data: RadarDataPoint[];
  height?: number;
  candidateName?: string;
}

export function RadarScoreChart({
  data,
  height = 340,
  candidateName = "Candidate Evidence",
}: RadarScoreChartProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#bae6fd" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#1e293b", fontSize: 11, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderColor: "#bae6fd",
                borderRadius: "16px",
                fontSize: "12px",
                color: "#0f172a",
                boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.15)",
                backdropFilter: "blur(8px)",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
              formatter={(value) => <span className="text-slate-800 font-bold">{value}</span>}
            />
            <Radar
              name={candidateName}
              dataKey="candidateScore"
              stroke="#0284c7"
              fill="#0284c7"
              fillOpacity={0.4}
            />
            <Radar
              name="Target Benchmark"
              dataKey="benchmarkScore"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-500 font-medium mt-1 text-center">
        Empirical score derived from resume signals vs ideal recruiter benchmark
      </p>
    </div>
  );
}
