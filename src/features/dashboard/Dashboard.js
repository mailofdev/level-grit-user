import React, { useState, useRef, useEffect } from "react";
import {
  FaFire,
  FaWater,
  FaCheckCircle,
  FaTimes,
  FaCamera,
  FaShareAlt,
  FaAppleAlt,
  FaClock,
  FaBell,
} from "react-icons/fa";
import logo from "../../assets/images/ss1.png";
import { useNavigate } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";
import ImageRecognizer from "../../components/display/ImageRecognizer";

const Dashboard = () => {
   const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
const client = {
  "clientId": 9,
  "email": "hrishi@gmail.com",
  "fullName": "hrishi jadhav",
  "gender": "male",
    "phoneNumber": "9922328647",
    "dateOfBirth": "1995-04-28T05:30:00",
    "height": 165,
    "weight": 60,
    "targetWeight": 77,
    "goal": 0,
    "trainerId": "12345"
  };

  const trainer = {
  "clientId": 9,
  "email": "hrishi@gmail.com",
  "fullName": "hrishi jadhav",
  "gender": "male",
    "phoneNumber": "9922328647",
    "dateOfBirth": "1995-04-28T05:30:00",
    "height": 165,
    "weight": 60,
    "targetWeight": 77,
    "goal": 0,
    "trainerId": "12345"
  };
  const meals = [
    {
      name: "Meal 1 (Pre-Workout)",
      image:
        "https://media.self.com/photos/5fd796783fd930328ef43628/4:3/w_2240,c_limit/banana-peanut-butter.jpg",
      calories: 450,
      protein: 15,
      carbs: 60,
      fat: 18,
      completed: true,
    },
    {
      name: "Meal 2 (Breakfast)",
      image:
        "https://www.shutterstock.com/image-photo/milk-breakfast-two-glasses-oatmeal-260nw-1905708703.jpg",
      calories: 520,
      protein: 35,
      carbs: 25,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 3 (Lunch)",
      image:
        "https://www.subbuskitchen.com/wp-content/uploads/2014/07/NorthIndian-Lunch-Menu1_Final2.jpg",
      calories: 280,
      protein: 8,
      carbs: 18,
      fat: 22,
      completed: true,
    },
    {
      name: "Meal 4 (Evening Snack)",
      image:
        "https://i0.wp.com/www.shanazrafiq.com/wp-content/uploads/2022/02/Fruit-Yogurt-Salad-8.jpg?resize=1200%2C798&ssl=1",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 5 (Dinner)",
      image:
        "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/paneer-fried-rice-recipe.jpg",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: true,
    },
    {
      name: "Meal 6 (Before Bed)",
      calories: 625,
      protein: 42,
      carbs: 45,
      fat: 28,
      completed: false,
    },
  ];

  // Calculate totals dynamically
  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dashboardData = {
    user: { name: "Alex", streak: 12 },
    macros: {
      calories: { value: totals.calories, target: 2500 },
      protein: { value: totals.protein, target: 200 },
      carbs: { value: totals.carbs, target: 300 },
      fat: { value: totals.fat, target: 80 }, // you can adjust target
    },
    streakProgress: { current: 12, goal: 20 },
    meals,
    reminders: [
      {
        text: "Dinner reminder",
        time: "6:00 PM - Don't forget your protein!",
        type: "warning",
      },
      {
        text: "Time for your next glass of water",
        time: "4:00 PM - Time for your next glass of water",
        type: "info",
      },
    ],
    water: {
      current: 6,
      goal: 8,
    },
  };

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
          text: `I'm on a ${dashboardData.user.streak}-day fitness streak! 💪🔥`,
        });
      } catch (error) {
        console.error("Share failed", error);
      }
    } else {
      alert("Share not supported");
    }
  };

  const handleMealClick = async () => {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(stream);
        setShowCamera(true);
      } catch (err) {
        alert("Camera access denied");
      }
    } else {
      alert("Camera not supported");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL("image/png"));
      video.srcObject.getTracks().forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const completedMeals = dashboardData.meals.filter((m) => m.completed).length;
  const remainingMeals = dashboardData.meals.length - completedMeals;

  const CircularProgress = ({
    value,
    max,
    label,
    current,
    target,
    color = "success",
  }) => {
    const percentage = Math.round((current / target) * 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${
      (percentage / 100) * circumference
    } ${circumference}`;

    return (
      <div className="text-center">
        <div className="position-relative d-inline-block mb-2">
          <svg width="120" height="120" className="transform-rotate-neg90">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e9ecef"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={
                color === "success"
                  ? "#28a745"
                  : color === "info"
                  ? "#17a2b8"
                  : "#ffc107"
              }
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              style={{
                transition: "stroke-dasharray 0.3s ease",
              }}
            />
          </svg>
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="fw-bold fs-5">{percentage}%</div>
          </div>
        </div>
        <h6 className="mb-1 text-capitalize fw-semibold">{label}</h6>
        <small className="text-muted">
          {current} / {target}
        </small>
      </div>
    );
  };

  return (
    <div
      className="container-fluid px-3 py-4 bg-light min-vh-100"
      style={{ backgroundColor: "#fff !important" }}
    >
      {/* <img
            src={logo}
            alt="Level Grit Logo"
            style={{ height: "500px", width: "800px"}}
          /> */}
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          {/* Welcome Section */}
          <div
            className="rounded-4 shadow-sm mb-4 white-text"
            style={{
              background: "linear-gradient(90deg, #54d8a3 0%, #039a6c 100%)",
            }}
          >
            <div className="card-body text-center p-4 d-flex align-items-center justify-content-between">
              <div>
                <h3 className="white-text mb-3">
                  Welcome back, {dashboardData.user.name}! 👋
                </h3>
                <p className="white-text mb-3">
                  Keep pushing towards your goals every day
                </p>
              </div>
              <div className="px-3 py-2">
                <h1 className="fw-bold white-text">
                  {dashboardData.user.streak}
                </h1>
                <div className="white-text">
                  Days Streak <FaFire className="me-2 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Macros and Streak */}
          <div className="row mb-2 bg-gray">
            <div className="col-lg-8 mb-3">
              <div className="card rounded-4  shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="card-title mb-0 fw-bold">Today's Macros</h5>
                  </div>
                  <div className="row">
                    {Object.entries(dashboardData.macros).map(
                      ([key, value], index) => (
                        <div key={key} className="col-12 col-sm-3 mb-3">
                          <CircularProgress
                            current={value.value}
                            target={value.target}
                            label={key}
                            color={
                              index === 0
                                ? "success"
                                : index === 1
                                ? "info"
                                : "warning"
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-3">
              <div className="card rounded-4  shadow-sm h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div className="mb-3">
                    <FaFire className="text-warning fs-2 mb-2" />
                    <h6 className="fw-bold">Streak Progress</h6>
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    <h4 className="text-primary mb-3">
                      {dashboardData.streakProgress.current} /{" "}
                      {dashboardData.streakProgress.goal}
                      <small className="text-muted ms-1">days</small>
                    </h4>
                    <div className="progress mb-4" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-gradient"
                        style={{
                          width: `${
                            (dashboardData.streakProgress.current /
                              dashboardData.streakProgress.goal) *
                            100
                          }%`,
                          background:
                            "linear-gradient(90deg, #28a745, #20c997)",
                        }}
                      ></div>
                    </div>
                    <button
                      onClick={handleShare}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <FaShareAlt className="me-2" />
                      Share Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="card rounded-4 shadow-sm mb-4">
            <div className="card-body">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">Today's Meals</h5>
                <div>
                  <span className="text-success fw-semibold me-2">
                    {completedMeals} completed
                  </span>
                  <span className="text-danger fw-semibold">
                    {remainingMeals} remaining
                  </span>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="row g-3">
                {dashboardData.meals.map((meal, idx) => (
                  <div key={idx} className="col-12 col-md-4 col-lg-4">
                    <div
                      className={`h-100 rounded-4 p-3 position-relative ${
                        meal.completed
                          ? "br-light-green-2"
                          : "br-light-gray-dotted"
                      }`}
                      style={{
                        cursor: meal.completed ? "default" : "pointer",
                        pointerEvents: meal.completed ? "none" : "auto",
                      }}
                      onClick={handleMealClick}
                    >
                      {/* Checkmark */}
                      {/* {meal.completed && ( */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-semibold mb-1">{meal.name}</h6>
                        {meal.completed ? (
                          <FaCheckCircle className="text-success fs-5" />
                        ) : (
                          <FaCamera className="text-secondary fs-5" />
                        )}
                      </div>
                      {/* )} */}

                      {/* Meal Image / Upload */}
                      <div
                        className="rounded-3 overflow-hidden mb-2"
                        style={{ height: "120px" }}
                      >
                        {meal.image ? (
                          <div className="my-2">
                            <ImageRecognizer imageSrc={meal.image} mode="mobilenet" />
                          </div>
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center text-muted">
                            <FaCamera className="fs-2 mb-2" />
                            <small>Upload meal photo</small>
                          </div>
                        )}
                      </div>

                      {/* Meal Info */}
                      <p className="mb-1 small text-muted">
                        {meal.calories} calories
                      </p>
                      <div className="small text-muted">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reminders and Water Intake */}
          <div className="row mb-4">
            {/* Reminders */}
            <div className="col-lg-7 mb-3">
              <div className="rounded-4 shadow-sm p-3 h-100 bg-white">
                <div className="d-flex align-items-center mb-3">
                  <FaBell className="text-warning me-2 fs-5" />
                  <h6 className="mb-0 fw-bold">Reminders</h6>
                </div>

                {dashboardData.reminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className={`d-flex justify-content-between align-items-center rounded-3 p-3 mb-2 ${
                      reminder.type === "warning"
                        ? "bg-warning bg-opacity-25 border-start border-4 border-warning"
                        : "bg-primary bg-opacity-10 border-start border-4 border-primary"
                    }`}
                  >
                    <div>
                      <div className="fw-semibold">{reminder.text}</div>
                      <small className="text-muted">
                        <FaClock className="me-1" />
                        {reminder.time} – {reminder.note}
                      </small>
                    </div>
                    <button
                      className={`btn btn-sm ${
                        reminder.type === "warning"
                          ? "btn-link text-warning"
                          : "btn-link text-primary"
                      }`}
                    >
                      {reminder.type === "warning" ? "Snooze" : "Done"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Intake */}
            <div className="col-lg-5 mb-3">
              <div className="rounded-4 shadow-sm p-3 h-100 bg-white">
                <h6 className="fw-bold mb-3">Water Intake</h6>

                <div className="text-center mb-3">
                  <h3 className="text-primary mb-1">
                    {dashboardData.water.current}
                    <small className="text-muted fs-6">
                      {" "}
                      / {dashboardData.water.goal} glasses
                    </small>
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="progress mb-3" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{
                      width: `${
                        (dashboardData.water.current /
                          dashboardData.water.goal) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* Glass Circles */}
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  {Array.from({ length: dashboardData.water.goal }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className={`rounded-circle me-1 mb-1 ${
                          idx < dashboardData.water.current
                            ? "bg-primary"
                            : "bg-light border"
                        }`}
                        style={{ width: "22px", height: "22px" }}
                      ></div>
                    )
                  )}
                </div>

                {/* Add Glass Button */}
                <div className="text-center">
                  <button className="btn btn-success w-100 rounded-pill">
                    <FaWater className="me-2" />
                    Add Glass
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Diet Chart Button */}
          <div className="text-center mb-4">
            <button className="btn btn-success btn-sm rounded-pill shadow px-4 py-2 fw-semibold">
              <i className="bi bi-clipboard-check me-2"></i>
              View Diet Chart
            </button>
          </div>

 <button
  className="bg-white btn-sm p-2 d-flex align-items-center border-0 rounded-3 shadow-sm"
  onClick={() =>
    navigate(`/messages/${client.clientId}`, {
      state: { client, trainer },
    })
  }
>
  <FaMessage className="me-1" /> Message
</button>

          {/* Captured Image Preview */}

{capturedImage && (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-body text-center">
      <h5 className="card-title mb-3">Captured Image</h5>
      <img
        src={capturedImage}
        alt="Captured"
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: "400px" }}
      />
      {/* Image recognition */}
      <ImageRecognizer imageSrc={capturedImage} mode="coco-ssd" />
    </div>
  </div>
)}

        </div>
      </div>

      {/* Camera Overlay */}
     {showCamera && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999 }}
  >
    <div className="text-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded shadow-lg"
        style={{ maxWidth: "90vw", maxHeight: "60vh" }}
      />
      <div className="d-flex justify-content-center mb-2">
        <button
          onClick={handleCapture}
          className="btn btn-success btn-sm me-3"
        >
          <FaCamera className="me-2" /> Capture
        </button>
        <button
          onClick={handleCloseCamera}
          className="btn btn-danger btn-sm"
        >
          <FaTimes className="me-2" /> Close
        </button>
      </div>

      {/* Live detection */}
      <ImageRecognizer videoRef={videoRef} mode="coco-ssd" />
    </div>
    <canvas ref={canvasRef} style={{ display: "none" }} />
  </div>
)}

    </div>
  );
};

export default Dashboard;
