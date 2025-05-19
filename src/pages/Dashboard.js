import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Excel to PDF Chart Generator
      </Typography>
      <Typography variant="body1" paragraph>
        Import Excel data, visualize it with custom charts, and export to PDF.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
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

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate('/upload')}
            >
              Upload Files
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;