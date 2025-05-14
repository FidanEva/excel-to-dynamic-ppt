import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import * as XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { styled } from '@mui/material/styles';

// Styled component for file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadFiles = () => {
  const navigate = useNavigate();
  const { uploadedFiles, addExcelData, clearAllData } = useData();
  const [error, setError] = useState(null);
  
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Clear previous errors
    setError(null);
    
    const file = files[0];
    
    // Check if file is an Excel file
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // Check if data is valid
        if (jsonData.length < 2) {
          setError('The Excel file contains insufficient data. Please ensure it has headers and at least one data row.');
          return;
        }
        // Add data to context
        addExcelData(jsonData, file.name);
      } catch (err) {
        console.error('Error reading Excel file:', err);
        setError('Failed to process the Excel file. Please check the file format and try again.');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const handleClearFiles = () => {
    clearAllData();
  };
  
  const handleContinue = () => {
    navigate('/charts');
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Excel Files
      </Typography>
      <Typography variant="body1" paragraph>
        Upload your Excel files containing the data you want to visualize.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Excel File
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".xlsx,.xls,.csv" />
          </Button>
          <Typography variant="body2" color="text.secondary">
            Supported formats: .xlsx, .xls, .csv
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        {uploadedFiles.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Uploaded Files
            </Typography>
            <List>
              {uploadedFiles.map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={fileName} />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearFiles}
              >
                Clear All Files
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
              >
                Continue to Charts
              </Button>
            </Box>
          </>
        )}
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Expected File Format
        </Typography>
        <Typography variant="body2" paragraph>
          For best results, please ensure your Excel files follow these guidelines:
        </Typography>
        <ul>
          <li>First row should contain column headers</li>
          <li>Data should be organized in columns</li>
          <li>Numeric values should not contain any text or special characters</li>
          <li>Dates should be in a consistent format</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default UploadFiles;