import React, { createContext, useState, useContext } from 'react';

// Create context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

const DataProvider = ({ children }) => {
  // State for excel data
  const [excelData, setExcelData] = useState({});
  
  // State for processed chart data
  const [chartData, setChartData] = useState([]);
  
  // State for tracking file uploads
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Function to add new excel data
  const addExcelData = (newData, fileName) => {
    setExcelData(newData);
    setUploadedFiles(prev => [...prev, fileName]);
  };

  // Function to process data for charts
  const processChartData = (processedData) => {
    setChartData(processedData);
  };
  
  // Function to clear all data
  const clearAllData = () => {
    setExcelData([]);
    setChartData([]);
    setUploadedFiles([]);
  };
  
  // Value object to be provided to consumers
  const value = {
    excelData,
    chartData,
    uploadedFiles,
    addExcelData,
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