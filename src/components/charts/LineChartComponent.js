
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LineChartComponent = ({ data, xAxisKey, yAxisKey, title }) => {
  // Check if data is available
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No data available for visualization
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {title && (
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 1 }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            label={{ value: xAxisKey, position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: yAxisKey, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={yAxisKey} 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChartComponent;