import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Download, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsDisplay = ({ queryResults, onDownload }) => {
  if (!queryResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <Info className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Results Yet</h3>
          <p className="text-gray-500">Configure your location and weather conditions to see analysis results.</p>
        </div>
      </div>
    );
  }

  const { location, conditions, probabilities, metadata } = queryResults;

  // Prepare chart data
  const chartData = {
    labels: conditions.map(condition => {
      const conditionNames = {
        'very-hot': 'Very Hot',
        'very-cold': 'Very Cold',
        'very-windy': 'Very Windy',
        'very-wet': 'Very Wet',
        'poor-air-quality': 'Poor Air Quality'
      };
      return conditionNames[condition] || condition;
    }),
    datasets: [
      {
        label: 'Probability (%)',
        data: probabilities,
        backgroundColor: probabilities.map(prob => {
          if (prob >= 70) return '#ef4444'; // Red for high probability
          if (prob >= 40) return '#f59e0b'; // Orange for medium probability
          return '#10b981'; // Green for low probability
        }),
        borderColor: probabilities.map(prob => {
          if (prob >= 70) return '#dc2626';
          if (prob >= 40) return '#d97706';
          return '#059669';
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weather Condition Probabilities',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  const getRiskLevel = (probability) => {
    if (probability >= 70) return { level: 'High', color: 'red', icon: AlertTriangle };
    if (probability >= 40) return { level: 'Medium', color: 'orange', icon: Info };
    return { level: 'Low', color: 'green', icon: CheckCircle };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <button
          onClick={() => onDownload(queryResults)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="mr-2" size={16} />
          Download Data
        </button>
      </div>

      {/* Location Summary */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Location Analysis</h3>
        <p className="text-blue-700">
          <strong>Location:</strong> {location.name}
        </p>
        <p className="text-blue-700">
          <strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
        <p className="text-blue-700">
          <strong>Analysis Date:</strong> {new Date(metadata.timestamp).toLocaleDateString()}
        </p>
      </div>

      {/* Chart Visualization */}
      <div className="mb-6">
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Detailed Analysis</h3>
        {conditions.map((condition, index) => {
          const probability = probabilities[index];
          const risk = getRiskLevel(probability);
          const RiskIcon = risk.icon;
          
          return (
            <div key={condition} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 capitalize">
                  {condition.replace('-', ' ')}
                </h4>
                <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium bg-${risk.color}-100 text-${risk.color}-800`}>
                  <RiskIcon className="mr-1" size={14} />
                  {risk.level} Risk
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Probability</span>
                    <span>{probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${risk.color}-500`}
                      style={{ width: `${probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {probability >= 70 
                  ? `High likelihood of ${condition.replace('-', ' ')} conditions. Consider alternative timing or locations.`
                  : probability >= 40 
                  ? `Moderate likelihood of ${condition.replace('-', ' ')} conditions. Monitor weather forecasts closely.`
                  : `Low likelihood of ${condition.replace('-', ' ')} conditions. Generally favorable for outdoor activities.`
                }
              </p>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Recommendations</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {probabilities.some(p => p >= 70) && (
            <li className="flex items-start">
              <AlertTriangle className="mr-2 text-red-500 mt-0.5" size={16} />
              High-risk conditions detected. Consider postponing outdoor activities or choosing alternative locations.
            </li>
          )}
          {probabilities.some(p => p >= 40 && p < 70) && (
            <li className="flex items-start">
              <Info className="mr-2 text-orange-500 mt-0.5" size={16} />
              Moderate-risk conditions present. Monitor weather forecasts and have contingency plans ready.
            </li>
          )}
          {probabilities.every(p => p < 40) && (
            <li className="flex items-start">
              <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
              Favorable conditions expected. Good time for outdoor activities with standard precautions.
            </li>
          )}
          <li className="flex items-start">
            <Info className="mr-2 text-blue-500 mt-0.5" size={16} />
            Always check real-time weather forecasts before finalizing outdoor plans.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay;
