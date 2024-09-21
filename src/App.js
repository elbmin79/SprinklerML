import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './App.css'; // Import the CSS file for styling

function App() {
  const webcamRef = useRef(null);
  const [percentage, setPercentage] = useState(10);

  // Function to detect people using the model
  const detectPeople = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      const personPredictions = predictions.filter(
        (prediction) => prediction.class === 'person'
      );
      
      adjustPercentage(personPredictions);
    }
  };

  // Load the COCO-SSD model and start detecting
  useEffect(() => {
    const loadModel = async () => {
      const model = await cocoSsd.load();
      console.log('Model loaded.');
      setInterval(() => {
        detectPeople(model);
      }, 1000); // Run detection every second
    };
    loadModel();
  }, [detectPeople]); // Include detectPeople in the dependency array

  // Adjust the percentage based on detected people
  const adjustPercentage = (personPredictions) => {
    if (personPredictions.length === 1) {
      const person = personPredictions[0];
      const personSize = person.bbox[2] * person.bbox[3];

      // Simplify the percentage calculation for debugging purposes
      const minSize = 80000;  
      const maxSize = 130000; 

      const clampedSize = Math.max(minSize, Math.min(personSize, maxSize));
      const newPercentage = Math.round(
        10 + ((clampedSize - minSize) / (maxSize - minSize)) * 40
      );

      setPercentage(newPercentage);
    } else {
      setPercentage(10);
    }
  };

  return (
    <div className="App">
      <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: '60%', height: '60%', backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Webcam ref={webcamRef} audio={false} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ marginTop: '20px', fontSize: '24px' }}>
          Water Percentage: {percentage}%
        </div>
        
        {/* Sprinkler Graphic */}
        <div className="sprinkler">
          <div className="holes">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="hole"></div>
            ))}
          </div>
          <div className="water">
            {[...Array(10)].map((_, index) => {
              const sprayHeight = `${percentage * 4}px`; // Increase the height multiplier
              console.log(`Spray ${index} height: ${sprayHeight}`);
              return (
                <div
                  key={index}
                  className="spray"
                  style={{ height: sprayHeight }}
                ></div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
