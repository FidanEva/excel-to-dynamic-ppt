import React, { useEffect } from 'react';
import pptxgen from "pptxgenjs";
import { useData } from '../context/DataContext';

const PowerPointExport = () => {
  const { excelData } = useData();

  useEffect(() => {
    if (!excelData || !excelData.officialInstagram) return;

    const pptx = new pptxgen();

    // --- Title Slide
    const slideTitle = pptx.addSlide();
    slideTitle.addText("Social Media Data Report", {
      x: 1, y: 1, fontSize: 24, bold: true
    });

    // --- Instagram Table Slide
    const instaSlide = pptx.addSlide();
    instaSlide.addText("Instagram Data", { x: 0.5, y: 0.3, fontSize: 20 });

    const headers = Object.keys(excelData.officialInstagram[0]);

    const tableData = [
        headers,
      ...excelData.officialInstagram.map(post => ([
        { text: 'View Post', hyperlink: { url: post['Media URL'] } },
        post.Caption || '',
        post.Likes || '',
        post.Comments || '',
        new Date(post.Timestamp).toLocaleString()
      ]))
    ];

    instaSlide.addTable(tableData, {
      x: 0.5, y: 1, w: 9, h: 5,
      border: { pt: '1', color: '999999' },
      fontSize: 10
    });

    // --- Charts Slide (Optional)
    const chartSlide = pptx.addSlide();
    chartSlide.addText("Charts (Image-based)", { x: 0.5, y: 0.3, fontSize: 20 });

    // If your charts are rendered on screen using Chart.js or similar, capture them as base64 images
    const chartIds = ["barChartId", "lineChartId", "pieChartId"]; // these are DOM IDs
    let yPos = 1;

    Promise.all(chartIds.map(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const imageUrl = canvas.toDataURL("image/png");
        chartSlide.addImage({ data: imageUrl, x: 0.5, y: yPos, w: 4.5 });
        yPos += 3.5;
      }
    })).finally(() => {
      pptx.writeFile("DataReport.pptx");
    });

  }, [excelData]);

  return <div>Generating PowerPoint file...</div>;
};

export default PowerPointExport;
