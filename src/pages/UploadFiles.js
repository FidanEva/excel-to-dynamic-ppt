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
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
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
  const [errors, setErrors] = useState({});
  const [fileStatus, setFileStatus] = useState({
    combinedSources: { name: '', status: 'empty' },
    officialFacebook: { name: '', status: 'empty' },
    officialInstagram: { name: '', status: 'empty' },
    keywords: { name: '', status: 'empty' }
  });
  const fileLabels = {
    combinedSources: 'Combined Sources',
    officialFacebook: 'Official Facebook',
    officialInstagram: 'Official Instagram',
    keywords: 'Keywords'
  };
  

  const handleFileUpload = async (event, fileKey) => {
    const file = event.target.files[0];
    if (!file) return;

    setErrors(prev => ({ ...prev, [fileKey]: null }));

    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setErrors(prev => ({
        ...prev,
        [fileKey]: 'Please upload a valid Excel file (.xlsx, .xls, or .csv)'
      }));
      return;
    }

    try {
      const data = await readExcelFile(file);
      if (data.length < 2) {
        setErrors(prev => ({
          ...prev,
          [fileKey]: 'The Excel file contains insufficient data. Please ensure it has headers and at least one data row.'
        }));
        return;
      }

      addExcelData(data, fileKey);

      setFileStatus(prev => ({
        ...prev,
        [fileKey]: {
          name: file.name,
          status: 'success'
        }
      }));
    } catch (err) {
      console.error('Error reading Excel file:', err);
      setErrors(prev => ({
        ...prev,
        [fileKey]: 'Failed to process the Excel file. Please check the file format and try again.'
      }));
    }
  };


  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleClearFiles = () => {
    clearAllData();
    setFileStatus({
      combinedSources: { name: '', status: 'empty' },
      officialFacebook: { name: '', status: 'empty' },
      officialInstagram: { name: '', status: 'empty' },
      keywords: { name: '', status: 'empty' }
    });
    setErrors({});
  };


  const handleContinue = () => {
    const allFilesUploaded = Object.values(fileStatus).every(
      file => file.status === 'success'
    );

    if (!allFilesUploaded) {
      setErrors(prev => ({
        ...prev,
        general: 'Please upload all 4 Excel files before proceeding.'
      }));
      return;
    }

    navigate('/charts');
  };

  const renderFileUploadSection = (fileKey) => {
    const status = fileStatus[fileKey];
    const error = errors[fileKey];

    return (
      <Grid item xs={12} md={6} key={fileKey}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            {fileLabels[fileKey]}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Excel File
              <VisuallyHiddenInput 
                type="file" 
                onChange={(e) => handleFileUpload(e, fileKey)} 
                accept=".xlsx,.xls,.csv" 
              />
            </Button>
            
            {status.status === 'success' && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{status.name}</Typography>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
        </Paper>
      </Grid>
    );
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Excel Files
      </Typography>
      <Typography variant="body1" paragraph>
        Please upload all 4 Excel files to proceed with visualization.
      </Typography>
      
      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {errors.general}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {Object.keys(fileStatus).map((fileKey) => renderFileUploadSection(fileKey))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
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
      
      <Paper sx={{ p: 3, mt: 3 }}>
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