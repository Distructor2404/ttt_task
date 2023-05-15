import React, { useState } from 'react';
import axios from 'axios';
import Chart, { Ticks } from 'chart.js/auto';
import './index.css';


function App() {
  const [chartData, setChartData] = useState(null);

  function handleButtonClick() {
    axios.get('https://www.terriblytinytales.com/test.txt')
      .then(response => {
        const textContent = response.data;
        const wordArray = textContent.split(/\s+/);
        const wordFrequency = {};

        wordArray.forEach(word => {
          wordFrequency[word] = wordFrequency[word] ? wordFrequency[word] + 1 : 1;
        });

        const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
        const top20Words = sortedWords.slice(0, 20);
        
        const chartData = {
          labels: top20Words.map(word => word[0]),
          data: top20Words.map(word => word[1]),
        };

        setChartData(chartData);
      })
      .catch(error => {
        console.error('Error fetching text file:', error);
      });
  }

  function handleExportClick() {
    if (chartData) {
      const csvContent = 'data:text/csv;charset=utf-8,' + chartData.labels.join(',') + '\n' + chartData.data.join(',');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'histogram.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  React.useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Word Frequency',
            color:'white',
            data: chartData.data,
            backgroundColor: 'rgba(255, 187, 0, 1)',
            borderColor: 'rgba(255, 187, 0, 1)',
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              backgroundColor: 'rgba(209, 118, 0,1)',
              grid: {
                color:'rgba(255,255,255,1)'

              },
              ticks:{
                color:'white',
                size:50,
                
              },
              
            },
            x: {
              grid: {
                  color: 'rgba(255,255,255,1)',
                   borderColor: 'red'  // <-- this line is answer to initial question
      },
      ticks:{
        color:'white',
        size:50,
        
      },
            }
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className='container1'>

      <div className='container'>
        <div className='container2'>
        <p className='p1'>Please view the page in 100% page zoom setup</p>
      <button onClick={handleButtonClick} type="button" className='btn'>Submit</button>
      </div>
      <div className='container2'>
      {chartData && <button onClick={handleExportClick} type="button" className='btn'>Export</button>}
      </div>
      </div>
      <div className='container4'>
      <div className='container3'>
        <p>Click on Submit button to Get Chart for Top 20 Words with their Frequencies</p>
      {chartData && <canvas id="chart" width="200" height="125"></canvas>}
      </div>
      </div>
      
    </div>
  );
}

export default App;