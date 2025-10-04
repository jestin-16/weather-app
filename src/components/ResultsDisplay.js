import React from 'react';
import { Download } from 'lucide-react';

function ResultsDisplay({ queryResults, onDownload, darkMode }) {
  // Debug: log the received data
  console.log('[ResultsDisplay] Received queryResults:', queryResults);

  // Validate: must be a non-empty array of objects with expected keys
  if (
    !Array.isArray(queryResults) ||
    queryResults.length === 0 ||
    typeof queryResults[0] !== 'object'
  ) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        <strong>Invalid Data Format</strong>
        <div className="text-xs mt-2 bg-gray-100 p-2 rounded">
          Debug info: {JSON.stringify(queryResults)}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-2xl font-bold mb-4">ML Weather Prediction</h2>
      <table className="min-w-full table-auto mb-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Pressure (hPa)</th>
            <th>Condition</th>
            <th>Confidence</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {queryResults.map((item, idx) => (
            <tr key={idx}>
              <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
              <td>{item.temperature ?? '-'}</td>
              <td>{item.humidity ?? '-'}</td>
              <td>{item.pressure ?? '-'}</td>
              <td>{item.condition ?? '-'}</td>
              <td>{item.confidence !== undefined ? (item.confidence * 100).toFixed(1) + '%' : '-'}</td>
              <td>{item.riskLevel ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => onDownload(queryResults)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Download className="mr-2" size={16} />
        Download Results
      </button>
    </div>
  );
}

export default ResultsDisplay;
