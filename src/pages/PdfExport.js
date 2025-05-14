
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
  const { chartData } = useData();
  const chartsRef = useRef(null);
  
  // PDF export settings
  const [pdfTitle, setPdfTitle] = useState('Data Visualization Report');
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Get selected page size dimensions
  const getSelectedPageSize = () => {
    return PAGE_SIZES.find(size => size.id === pageSize);
  };
  
  // Handle PDF title change
  const handleTitleChange = (event) => {
    setPdfTitle(event.target.value);
  };
  
  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };
  
  // Handle orientation change
  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };
  
  // Generate and download PDF
  const generatePDF = async () => {
    if (chartData.length === 0) {
      setExportError('No charts available to export. Please create charts first.');
      return;
    }
    
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    
    try {
      // Get page dimensions
      const selectedSize = getSelectedPageSize();
      const isLandscape = orientation === 'landscape';
      
      // Initialize PDF with selected page size and orientation
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: [
          isLandscape ? selectedSize.height : selectedSize.width,
          isLandscape ? selectedSize.width : selectedSize.height
        ]
      });
      
      // Add title to PDF
      pdf.setFontSize(18);
      pdf.text(pdfTitle, 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
      pdf.line(20, 35, pdf.internal.pageSize.getWidth() - 20, 35);
      
      // Set initial position for charts
      let yPosition = 50;
      
      // For each chart in the charts container
      if (chartsRef.current) {
        // Get all chart elements
        const chartElements = chartsRef.current.querySelectorAll('.chart-container');
        
        for (let i = 0; i < chartElements.length; i++) {
          const chart = chartElements[i];
          
          // Create a canvas from the chart element
          const canvas = await html2canvas(chart);
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate image width and height to fit in PDF
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          const imgWidth = pageWidth - 40; // 20mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Check if the image will fit on the current page
          if (yPosition + imgHeight + 30 > pageHeight) {
            pdf.addPage();
            yPosition = 20;
          }
          
          // Add chart title
          pdf.setFontSize(14);
          pdf.text(`${chartData[i].xAxis} vs ${chartData[i].yAxis}`, 20, yPosition);
          
          // Add chart image
          pdf.addImage(imgData, 'PNG', 20, yPosition + 10, imgWidth, imgHeight);
          
          // Update position for next chart
          yPosition += imgHeight + 30;
        }
        
        // Save PDF
        pdf.save(`${pdfTitle.replace(/\s+/g, '_')}.pdf`);
        
        setExportSuccess(true);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Render a specific chart type
  const renderChart = (chartData, index) => {
    switch (chartData.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[index % COLORS.length]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[index % COLORS.length]} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
            </AreaChart>
          </ResponsiveContainer>
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
      
      {chartData.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>No Charts Available</AlertTitle>
          Please create charts first before exporting to PDF.
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/charts')}
            >
              Create Charts
            </Button>
          </Box>
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              PDF Export Settings
            </Typography>
            
            <Grid container spacing={3}>
              {/* PDF Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="PDF Title"
                  value={pdfTitle}
                  onChange={handleTitleChange}
                  variant="outlined"
                />
              </Grid>
              
              {/* Page Size */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="page-size-label">Page Size</InputLabel>
                  <Select
                    labelId="page-size-label"
                    id="page-size"
                    value={pageSize}
                    label="Page Size"
                    onChange={handlePageSizeChange}
                  >
                    {PAGE_SIZES.map(size => (
                      <MenuItem key={size.id} value={size.id}>
                        {size.label} ({size.width}mm x {size.height}mm)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Orientation */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="orientation-label">Orientation</InputLabel>
                  <Select
                    labelId="orientation-label"
                    id="orientation"
                    value={orientation}
                    label="Orientation"
                    onChange={handleOrientationChange}
                  >
                    {ORIENTATIONS.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Export Button */}
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
            
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
              <Grid container spacing={3}>
                {chartData.map((chart, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card className="chart-container">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {chart.fileSource} - {chart.xAxis} vs {chart.yAxis}
                        </Typography>
                        {renderChart(chart, index)}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default PdfExport;