import React, { createContext, useState, useContext } from 'react';

// Create context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Initial structure for all four datasets
const initialExcelData = {
  combinedSources: null,
  officialFacebook: null,
  officialInstagram: null,
  keywords: null
};

const DataProvider = ({ children }) => {
  // State for excel data
  const [excelData, setExcelData] = useState(initialExcelData);
  
  // State for report data
  const [reportData, setReportData] = useState({
    title: 'Data Visualization Report',
    date: new Date().toISOString().split('T')[0],
    charts: []
  });
  
  // State for tracking uploaded file names (optional)
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Function to add or update specific excel data type
  const addExcelData = (newData, type) => {
    if (!initialExcelData.hasOwnProperty(type)) {
      console.warn(`Unknown excel data type: "${type}"`);
      return;
    }

    setExcelData(prev => ({
      ...prev,
      [type]: newData
    }));

    if (!uploadedFiles.includes(type)) {
      setUploadedFiles(prev => [...prev, type]);
    }
  };

  const updateReportData = (newReportData) => {
    setReportData(prev => ({
      ...prev,
      ...newReportData
    }));
  };

  const processChartData = (charts) => {
    setReportData(prev => ({
      ...prev,
      charts
    }));
  };

  const clearAllData = () => {
    setExcelData(initialExcelData);
    setReportData({
      title: 'Data Visualization Report',
      date: new Date().toISOString().split('T')[0],
      charts: []
    });
    setUploadedFiles([]);
  };

  const value = {
    excelData,
    reportData,
    uploadedFiles,
    addExcelData,
    updateReportData,
    processChartData,
    clearAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
