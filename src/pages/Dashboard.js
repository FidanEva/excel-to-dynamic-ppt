import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { uploadedFiles, chartData } = useData();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Excel to PDF Chart Generator
      </Typography>
      <Typography variant="body1" paragraph>
        Import Excel data, visualize it with custom charts, and export to PDF.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Upload Status */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Data Files
            </Typography>
            {uploadedFiles.length > 0 ? (
              <>
                <Typography variant="body1">
                  {uploadedFiles.length} file(s) uploaded
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {uploadedFiles.map((file, index) => (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                      • {file}
                    </Typography>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No files uploaded yet. Start by uploading Excel files.
              </Typography>
            )}
            <Button 
              variant="contained" 
              startIcon={<UploadFileIcon />}
              sx={{ mt: 'auto' }}
              onClick={() => navigate('/upload')}
            >
              Upload Files
            </Button>
          </Paper>
        </Grid>
        
        {/* Charts Status */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Visualizations
            </Typography>
            {chartData.length > 0 ? (
              <Typography variant="body1">
                {chartData.length} chart(s) created and ready for export
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No charts created yet. Go to the Charts page after uploading data.
              </Typography>
            )}
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<BarChartIcon />}
              sx={{ mt: 'auto' }}
              onClick={() => navigate('/charts')}
              disabled={uploadedFiles.length === 0}
            >
              Create Charts
            </Button>
          </Paper>
        </Grid>
        
        {/* Quick Help */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Getting Started
            </Typography>
            <Typography variant="body2" paragraph>
              Follow these steps:
            </Typography>
            <ol>
              <li>Upload Excel files with your data</li>
              <li>Customize and generate charts</li>
              <li>Export everything to PDF</li>
            </ol>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;