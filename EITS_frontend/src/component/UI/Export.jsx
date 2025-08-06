import { Button } from '@material-tailwind/react';
import React from 'react';

const DataExportOptions = ({ data }) => {
  const handleExport = (format) => {
    // Implement export logic here based on format
    if (format === 'csv') {
      exportToCSV(data);
    } else if (format === 'pdf') {
      exportToPDF(data);
    }
  };

  return (
    <div className="export-options">
      <div className='flex  gap-1'>
      <Button onClick={() => handleExport('csv')}>Export as CSV</Button>
      <Button onClick={() => handleExport('pdf')}>Export as PDF</Button>
      </div>
   
    </div>
  );
};

// Placeholder export functions
const exportToCSV = (data) => {
  console.log("Exporting data to CSV...", data);
};

const exportToPDF = (data) => {
  console.log("Exporting data to PDF...", data);
};

export default DataExportOptions;
