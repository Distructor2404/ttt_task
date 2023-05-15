import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [words, setWords] = useState([]);
  const [data, setData] = useState([]);

  const handleSubmit = () => {
    fetch("https://www.terriblytinytales.com/test.txt")
      .then((response) => response.text())
      .then((text) => {
        const words = text.split(" ");
        const frequencies = words.reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
        const sortedFrequencies = Object.entries(frequencies)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);
        setWords(sortedFrequencies.map(([word, frequency]) => ({
          word,
          frequency,
        })));
      });
  };

  const handleExport = () => {
    const csv = data.map((row) => row.word + "," + row.frequency).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "histogram.csv";
    link.click();
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      <br />
      <h2>Histogram of the 20 most occurring words</h2>
      <canvas id="histogram"></canvas>
      <br />
      <button onClick={handleExport}>Export</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));