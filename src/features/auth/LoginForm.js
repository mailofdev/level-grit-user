import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "./authThunks";
import { encryptToken } from "../../utils/crypto";
import DynamicForm from "../../components/forms/DynamicForm";
import logo from "../../assets/images/logo3.jpeg";
import Loader from "../../components/display/Loader";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = [
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true },
  ];

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (data) => {
  setErrorMessage("");
  setIsLoading(true);
  try {
    const resultAction = await dispatch(loginThunk(formData));

    setIsLoading(false);

    if (loginThunk.fulfilled.match(resultAction)) {
      // Login was successful
      const userInfo = resultAction.payload.userInfo;
      const encryptedUserData = encryptToken(JSON.stringify(userInfo));
      sessionStorage.setItem("user", JSON.stringify(encryptedUserData));
      navigate("/dashboard", { replace: true });
    } else {
      // Login failed
      const message = resultAction.payload || "Login failed. Please try again.";
      setErrorMessage(message);
    }
  } catch (error) {
    setIsLoading(false);
    const message = error?.message || String(error) || "Login failed. Please try again.";
    setErrorMessage(message);
  }
};


  const handleCancel = () => {
    setFormData({});
    setErrorMessage("");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
        padding: "20px"
      }}
    >
      {isLoading && <Loader fullScreen={true} text="Logging in..." color="#43a047" />}
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          border: "none"
        }}
      >
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Level Grit Logo"
            style={{ height: "100px", width: "100px", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        <h4 className="mb-4 text-center" style={{ color: "#2e7d32", fontWeight: "600" }}>
          Welcome Back!
        </h4>
        {errorMessage && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>
            {errorMessage}
          </div>
        )}
        <DynamicForm
          schema={schema}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          singleButtonInCenter={true}
          twoRowForm={false}
          buttonClass="btn btn-success w-100"
        />
        <div className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          {/* <p className="mb-1">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-success text-decoration-none fw-medium">
              Register
            </Link>
          </p> */}
          <p className="mb-0">
            <Link to="/reset-password" className="text-success text-decoration-none fw-medium">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
