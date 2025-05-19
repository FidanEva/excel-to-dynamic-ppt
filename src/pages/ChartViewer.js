import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';

// Import chart components
import BarChartComponent from '../components/charts/BarChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';

const ChartViewer = () => {
  const navigate = useNavigate();
  const { excelData, processChartData } = useData();

  useEffect(() => {
    console.log("excelData", excelData)
    const isAnyDatasetMissing = Object.values(excelData).some(value => value === null);

    if (isAnyDatasetMissing) {
      navigate('/upload');
      return;
    }
  }, [excelData]);

  const handleExportPPT = () => {
    navigate('/export-ppt');
  };

  const renderInstagramTable = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Instagram Data
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Media URL</strong></TableCell>
                <TableCell><strong>Caption</strong></TableCell>
                <TableCell><strong>Likes</strong></TableCell>
                <TableCell><strong>Comments</strong></TableCell>
                <TableCell><strong>Timestamp</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excelData.officialInstagram.map((post, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={post["Media URL"]} target="_blank" rel="noopener">
                      View Post
                    </Link>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>{post.Caption}</TableCell>
                  <TableCell>{post.Likes}</TableCell>
                  <TableCell>{post.Comments}</TableCell>
                  <TableCell>{new Date(post.Timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderCharts = () => (
    <Grid container spacing={3}>
      {Object.entries(excelData).map(([datasetName, data]) => {
        if (!data || data.length === 0) return null;

        const headers = Object.keys(data[0]);
        const numericHeaders = headers.filter(header => 
          typeof data[0][header] === 'number' || !isNaN(data[0][header])
        );

        if (numericHeaders.length < 2) return null;

        return (
          <Grid item xs={12} key={datasetName}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {datasetName} Analysis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box id={`chart-${datasetName}-bar`}>
                      <BarChartComponent
                        data={data}
                        xAxisKey={headers[0]}
                        yAxisKey={numericHeaders[0]}
                        title={`${datasetName} - Bar Chart`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box id={`chart-${datasetName}-line`}>
                      <LineChartComponent
                        data={data}
                        xAxisKey={headers[0]}
                        yAxisKey={numericHeaders[0]}
                        title={`${datasetName} - Line Chart`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box id={`chart-${datasetName}-pie`}>
                      <PieChartComponent
                        data={data}
                        nameKey={headers[0]}
                        valueKey={numericHeaders[0]}
                        title={`${datasetName} - Pie Chart`}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Data Visualization
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SlideshowIcon />}
            onClick={handleExportPPT}
            sx={{ mr: 2 }}
          >
            Export to PowerPoint
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => navigate('/export')}
          >
            Export to PDF
          </Button>
        </Box>
      </Box>

      {/* {renderCharts()} */}
      <Divider sx={{ my: 4 }} />
      {renderInstagramTable()}
    </Box>
  );
};

export default ChartViewer;