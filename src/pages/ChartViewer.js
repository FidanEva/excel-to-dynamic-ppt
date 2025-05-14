
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Import chart components - these would be created separately
import BarChartComponent from '../components/charts/BarChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';

const ChartViewer = () => {
  const navigate = useNavigate();
  const { excelData, chartData, processChartData } = useData();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [availableColumns, setAvailableColumns] = useState([]);
  
  useEffect(() => {
    // If no data is uploaded, redirect to upload page
    if (excelData.length === 0) {
      navigate('/upload');
      return;
    }
    
    // Set default selected dataset to the first one
    if (excelData.length > 0 && selectedDataset === '') {
      setSelectedDataset(0);
      
      // Extract column headers from the first dataset
      const headers = Object.keys(excelData[0]);
      setAvailableColumns(headers);
      
      // Set default axes if columns are available
      if (headers && headers.length > 0) {
        setSelectedXAxis(0);
        setSelectedYAxis(headers.length > 1 ? 1 : 0);
      }
    }
  }, [excelData, navigate, selectedDataset]);
  
    const handleDatasetChange = (event) => {
        setSelectedDataset(event.target.value);

        const headers = Object.keys(excelData[0]);
        setAvailableColumns(headers);
        if (headers && headers.length > 0) {
            setSelectedXAxis(0);
            setSelectedYAxis(headers.length > 1 ? 1 : 0);
        }
    };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Change chart type based on tab
    const chartTypes = ['bar', 'line', 'pie'];
    setSelectedChartType(chartTypes[newValue]);
  };
  
  const handleXAxisChange = (event) => {
    setSelectedXAxis(event.target.value);
  };
  
  const handleYAxisChange = (event) => {
    setSelectedYAxis(event.target.value);
  };
  
  const createChart = () => {
    if (selectedDataset === '' || selectedXAxis === '' || selectedYAxis === '') {
      return;
    }
    
    // Get the data
const data = excelData; // now flat array of objects
const headers = availableColumns;

const chartData = data.map(row => ({
  [headers[selectedXAxis]]: row[headers[selectedXAxis]],
  [headers[selectedYAxis]]: row[headers[selectedYAxis]],
}));

    
    // Process and save chart data
    const newChart = {
      id: Date.now().toString(),
      type: selectedChartType,
      data: chartData,
      xAxisKey: headers[selectedXAxis],
      yAxisKey: headers[selectedYAxis],
      title: `${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart - ${headers[selectedYAxis]} by ${headers[selectedXAxis]}`
    };
    
processChartData([newChart]);
  };
  
  const renderChartPreview = () => {
    if (selectedDataset === '' || !excelData[selectedDataset]) {
      return (
        <Alert severity="info">
          Please select a dataset to visualize
        </Alert>
      );
    }
    
    if (selectedXAxis === '' || selectedYAxis === '') {
      return (
        <Alert severity="info">
          Please select X and Y axes for your chart
        </Alert>
      );
    }
    
    // Get the data
const data = excelData; // now flat array of objects
const headers = availableColumns;

const chartData = data.map(row => ({
  [headers[selectedXAxis]]: row[headers[selectedXAxis]],
  [headers[selectedYAxis]]: row[headers[selectedYAxis]],
}));

    
    // Render the appropriate chart type
    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChartComponent 
            data={chartData} 
            xAxisKey={headers[selectedXAxis]} 
            yAxisKey={headers[selectedYAxis]} 
          />
        );
      case 'line':
        return (
          <LineChartComponent 
            data={chartData} 
            xAxisKey={headers[selectedXAxis]} 
            yAxisKey={headers[selectedYAxis]} 
          />
        );
      case 'pie':
        return (
          <PieChartComponent 
            data={chartData} 
            nameKey={headers[selectedXAxis]} 
            valueKey={headers[selectedYAxis]} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chart Visualization
      </Typography>
      
      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Chart Controls
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Dataset</InputLabel>
              <Select
                value={selectedDataset}
                label="Dataset"
                onChange={handleDatasetChange}
              >
                {Object.values(excelData).map((dataset, index) => (
                  <MenuItem key={index} value={index}>
                    {dataset.fileName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Bar" />
              <Tab label="Line" />
              <Tab label="Pie" />
            </Tabs>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>X-Axis</InputLabel>
              <Select
                value={selectedXAxis}
                label="X-Axis"
                onChange={handleXAxisChange}
                disabled={!availableColumns.length}
              >
                {availableColumns.map((column, index) => (
                  <MenuItem key={index} value={index}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Y-Axis</InputLabel>
              <Select
                value={selectedYAxis}
                label="Y-Axis"
                onChange={handleYAxisChange}
                disabled={!availableColumns.length}
              >
                {availableColumns.map((column, index) => (
                  <MenuItem key={index} value={index}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              fullWidth
              onClick={createChart}
              disabled={selectedDataset === '' || selectedXAxis === '' || selectedYAxis === ''}
            >
              Add Chart
            </Button>
          </Paper>
        </Grid>
        
        {/* Chart Preview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Chart Preview
            </Typography>
            
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {renderChartPreview()}
            </Box>
          </Paper>
        </Grid>
        
        {/* Export Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              {chartData.length} chart(s) created
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => navigate('/export')}
              disabled={chartData.length === 0}
            >
              Export to PDF
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartViewer;