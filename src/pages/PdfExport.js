import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import BarChartComponent from '../components/charts/BarChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
// Define colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// PDF page sizes
const PAGE_SIZES = [
  { id: 'a4', label: 'A4', width: 210, height: 297 },
  { id: 'letter', label: 'Letter', width: 215.9, height: 279.4 },
  { id: 'legal', label: 'Legal', width: 215.9, height: 355.6 }
];

// PDF orientations
const ORIENTATIONS = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' }
];

const PdfExport = () => {
  const navigate = useNavigate();
  const { reportData } = useData();
  const chartsRef = useRef(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Generate and download PDF
  const generatePDF = async () => {
    if (reportData.charts.length === 0) {
      setExportError('No charts available to export. Please add charts to your report first.');
      return;
    }
    
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    
    try {
      // Initialize PDF in landscape mode
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title page
      pdf.setFontSize(24);
      pdf.text(reportData.title || 'Data Visualization Report', 20, 40);
      
      pdf.setFontSize(16);
      pdf.text(`Generated on: ${reportData.date}`, 20, 50);
      
      pdf.setFontSize(12);
      pdf.text(`Total Charts: ${reportData.charts.length}`, 20, 60);
      
      // Group charts by dataset
      const chartsByDataset = reportData.charts.reduce((acc, chart) => {
        if (!acc[chart.datasetName]) {
          acc[chart.datasetName] = [];
        }
        acc[chart.datasetName].push(chart);
        return acc;
      }, {});

      // For each dataset
      for (const [datasetName, charts] of Object.entries(chartsByDataset)) {
        // Add dataset title page
        pdf.addPage();
        pdf.setFontSize(20);
        pdf.text(datasetName, 20, 30);
        
        // For each chart in the dataset
        for (const chart of charts) {
          // Add new page for each chart
          pdf.addPage();
          
          // Create a canvas from the chart element
          const chartElement = document.getElementById(`chart-${chart.id}`);
          if (!chartElement) continue;
          
          // Wait for the chart to be fully rendered
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const canvas = await html2canvas(chartElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          
          // Calculate image dimensions to fit on page
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          const imgWidth = pageWidth - 40; // 20mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Add chart title
          pdf.setFontSize(16);
          pdf.text(chart.title, 20, 20);
          
          // Add chart image
          pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
        }
      }
      
      // Save PDF
      pdf.save(`${reportData.title.replace(/\s+/g, '_') || 'report'}.pdf`);
      
      setExportSuccess(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Render chart based on type
  const renderChart = (chart) => {
    switch (chart.type) {
      case 'bar':
        return (
          <BarChartComponent 
            data={chart.data} 
            xAxisKey={chart.xAxisKey} 
            yAxisKey={chart.yAxisKey}
            title={chart.title}
          />
        );
      case 'line':
        return (
          <LineChartComponent 
            data={chart.data} 
            xAxisKey={chart.xAxisKey} 
            yAxisKey={chart.yAxisKey}
            title={chart.title}
          />
        );
      case 'pie':
        return (
          <PieChartComponent 
            data={chart.data} 
            nameKey={chart.xAxisKey} 
            valueKey={chart.yAxisKey}
            title={chart.title}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Export to PDF
      </Typography>
      
      {reportData.charts.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>No Charts Available</AlertTitle>
          Please add charts to your report before exporting to PDF.
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/charts')}
            >
              View Charts
            </Button>
          </Box>
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Preview
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Title: {reportData.title || 'Untitled Report'}
              </Typography>
              <Typography variant="subtitle1">
                Date: {reportData.date}
              </Typography>
              <Typography variant="subtitle1">
                Total Charts: {reportData.charts.length}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
              disabled={isExporting}
              fullWidth
              size="large"
            >
              {isExporting ? 'Generating PDF...' : 'Export to PDF'}
            </Button>
            
            {/* Success Message */}
            {exportSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                PDF exported successfully!
              </Alert>
            )}
            
            {/* Error Message */}
            {exportError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {exportError}
              </Alert>
            )}
          </Paper>
          
          {/* Preview of charts that will be included in PDF */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Charts to Include in PDF
            </Typography>
            
            <Box ref={chartsRef}>
              {Object.entries(reportData.charts.reduce((acc, chart) => {
                if (!acc[chart.datasetName]) {
                  acc[chart.datasetName] = [];
                }
                acc[chart.datasetName].push(chart);
                return acc;
              }, {})).map(([datasetName, charts]) => (
                <Box key={datasetName} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {datasetName}
                  </Typography>
                  <Grid container spacing={3}>
                    {charts.map((chart) => (
                      <Grid item xs={12} key={chart.id}>
                        <Box id={`chart-${chart.id}`}>
                          {renderChart(chart)}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default PdfExport;