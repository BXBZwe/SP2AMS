import React, { useState, useEffect } from 'react';
import { useAPI } from '../../ratemaintenance/apiContent';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import * as dfd from "danfojs";

export default function RoomStatus() {
  const { rooms, fetchRooms, refreshRooms } = useAPI();
  const [occupancyData, setOccupancyData] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0) {
      processOccupancyData(rooms);
    }
  }, [rooms]);

  const processOccupancyData = (rooms) => {
    let df = new dfd.DataFrame(rooms);
    let occupancyCounts = df['statusDetails'].apply(row => row?.occupancy_status).valueCounts();
    
    let chartData = occupancyCounts.index.map((status, i) => ({
      name: status,
      value: occupancyCounts.values[i]
    }));

    setOccupancyData(chartData);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div>
      Room Status Graph
      <PieChart width={400} height={400}>
        <Pie data={occupancyData} cx={200} cy={200} outerRadius={100} fill="#8884d8" dataKey="value" label>
          {occupancyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
