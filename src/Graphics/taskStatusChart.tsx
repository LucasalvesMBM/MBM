"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function TasksStatusChart() {
  const data = [
    { status: "Pendente", total: 5 },
    { status: "Em Progresso", total: 3 },
    { status: "Concluída", total: 2 },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tarefas por Status</h2>

      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" />
      </BarChart>
    </div>
  );
}
