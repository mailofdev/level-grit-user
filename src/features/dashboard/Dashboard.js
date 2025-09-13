import React, { useState, useRef, useEffect } from "react";
import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaCheese,
  FaShareAlt,
  FaUtensils,
  FaCamera,
  FaTimes
} from "react-icons/fa";

const Dashboard = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Attach video stream when it changes
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Fitness Streak",
          text: "I'm on a 12-day fitness streak! 💪🔥 Track your progress too!",
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  const handleMealClick = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setShowCamera(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied or not available.");
      }
    } else {
      alert("Camera not supported on this device.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      // Convert to image URL
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);

      // Stop video stream after capturing
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div className="container p-4" style={{ backgroundColor: "#59c0e5", minHeight: "100vh" }}>
      
      {/* Welcome Section */}
      <div className="bg-light rounded p-3 mb-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <h4>Welcome Back, Rohan 👋</h4>
          <button className="btn btn-outline-info btn-sm mt-2">📊 Feedback on Progress</button>
        </div>
        <div className="text-center mt-3 mt-md-0">
          <h5>🔥 12 Day Streak</h5>
        </div>
      </div>

      {/* Macros and Streak */}
      <div className="row mb-4 g-3">
        
        <div className="col-md-8">
          <div className="bg-light rounded p-3 shadow-sm">
            <h5 className="mb-3">Today's Macros</h5>
            <div className="row text-center">
              <div className="col-6 col-md-3 mb-3 mb-md-0">
                <FaFire size={24} className="text-danger mb-1" />
                <h6>Calories</h6>
                <p>500 / 2000</p>
              </div>
              <div className="col-6 col-md-3 mb-3 mb-md-0">
                <FaDrumstickBite size={24} className="text-success mb-1" />
                <h6>Protein</h6>
                <p>50gm / 150gm</p>
              </div>
              <div className="col-6 col-md-3 mb-3 mb-md-0">
                <FaBreadSlice size={24} className="text-warning mb-1" />
                <h6>Carbs</h6>
                <p>100gm / 200gm</p>
              </div>
              <div className="col-6 col-md-3">
                <FaCheese size={24} className="text-primary mb-1" />
                <h6>Fat</h6>
                <p>20gm / 50gm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-light rounded p-3 shadow-sm text-center">
            <h6>Streak Progress</h6>
            <p>12 Days</p>
            <input type="range" className="form-range" min="0" max="12" value="12" readOnly />
            <button onClick={handleShare} className="btn btn-info btn-sm mt-3"><FaShareAlt /> Share</button>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-light rounded p-3 mb-4 shadow-sm">
        <h5 className="mb-3">Today's Meals</h5>
        <div className="d-flex flex-wrap justify-content-around">
          {["M1", "M2", "M3", "M4", "M5", "M6"].map((meal, index) => (
            <div
              key={index}
              className="bg-white rounded p-3 text-center shadow-sm mb-3"
              style={{ width: "100px", cursor: "pointer" }}
              onClick={handleMealClick}
            >
              <FaUtensils size={20} className="mb-1 text-secondary" />
              <h6>{meal}</h6>
            </div>
          ))}
        </div>
      </div>

      {/* Diet Chart Button */}
      <div className="text-center mb-4">
        <button className="btn btn-light btn-lg px-4 shadow-sm">📋 View Diet Chart</button>
      </div>

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="text-center mb-4">
          <h5>Captured Image</h5>
          <img src={capturedImage} alt="Captured" className="img-fluid rounded shadow-sm" style={{ maxHeight: "300px" }} />
        </div>
      )}

      {/* Camera Overlay */}
      {showCamera && (
        <div className="camera-overlay position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-75">
          <video ref={videoRef} autoPlay playsInline style={{ maxWidth: "90%", maxHeight: "70%" }} />
          <div className="mt-3">
            <button onClick={handleCapture} className="btn btn-primary mx-2"><FaCamera /> Capture</button>
            <button onClick={handleCloseCamera} className="btn btn-secondary mx-2"><FaTimes /> Close</button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
