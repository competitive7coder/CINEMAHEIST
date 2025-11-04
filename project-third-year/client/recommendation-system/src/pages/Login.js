import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ForgotPassword from "../components/auth/ForgotPassword";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      toast.success("Logged in successfully!", { position: "top-center" });
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Something went wrong! Please try again.";
      toast.error(errorMsg);
    }
  };

  const styles = `
    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      background-image: url('https://i.postimg.cc/dt7BF6gc/download-33.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 100vh;
      width: 100vw;
    }

    .login-box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      padding: 40px;
      transform: translate(-50%, -50%);
      background: transparent;
      backdrop-filter: blur(20px);
      box-shadow: 0 15px 25px rgba(0,0,0,.6);
      border-radius: 10px;
      transition: all 0.3s ease-out;
    }

    .login-box:hover {
      box-shadow: 0 0 5px #131515ff, 0 0 25px #000000ff;
      transform: translate(-50%, -50%) scale(1.02);
    }

    .login-box p:first-child {
      color: #fff;
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 1px;
      font-family: cursive;
    }

    .login-box .user-box {
      position: relative;
    }

    .login-box .user-box input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      margin-bottom: 30px;
      border: none;
      border-bottom: 1px solid #fff;
      background: transparent;
      outline: none;
    }

    .login-box .user-box label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      pointer-events: none;
      transition: .5s;
    }

    .login-box .user-box input:focus ~ label,
    .login-box .user-box input:valid ~ label {
      top: -20px;
      color: #fff;
      font-size: 12px;
    }

    /* 🌟 UPDATED BUTTON STYLES 🌟 */
    .login-box form button {
      position: relative;
      display: inline-block;
      padding: 10px 20px;
      font-weight: bold;
      color: #fff; /* ✅ White button text */
      font-size: 16px;
      text-decoration: none;
      text-transform: uppercase;
      overflow: hidden;
      transition: .5s;
      margin-top: 40px;
      letter-spacing: 3px;
      background: none;
      border: none;
      cursor: pointer;
    }

    .login-box button:hover {
      background: #ffffff;
      color: #000000;
      border-radius: 5px;
    }

    .login-box button span {
      position: absolute;
      display: block;
    }

    .login-box button span:nth-child(1) {
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ffffff);
      animation: btn-anim1 1.5s linear infinite;
    }

    @keyframes btn-anim1 {
      0% { left: -100%; }
      50%,100% { left: 100%; }
    }

    .login-box button span:nth-child(2) {
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, transparent, #ffffff);
      animation: btn-anim2 1.5s linear infinite;
      animation-delay: .375s;
    }

    @keyframes btn-anim2 {
      0% { top: -100%; }
      50%,100% { top: 100%; }
    }

    .login-box button span:nth-child(3) {
      bottom: 0;
      right: -100%;
      width: 100%;
      height: 3px;
      background: linear-gradient(270deg, transparent, #ffffff);
      animation: btn-anim3 1.5s linear infinite;
      animation-delay: .75s;
    }

    @keyframes btn-anim3 {
      0% { right: -100%; }
      50%,100% { right: 100%; }
    }

    .login-box button span:nth-child(4) {
      bottom: -100%;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(360deg, transparent, #ffffff);
      animation: btn-anim4 1.5s linear infinite;
      animation-delay: 1.125s;
    }

    @keyframes btn-anim4 {
      0% { bottom: -100%; }
      50%,100% { bottom: 100%; }
    }

    /* ✅ Brighten these texts */
    .login-box p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
      margin-top: 10px;
    }

    .login-box a.a2,
    .login-box span.a2 {
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .login-box a.a2:hover,
    .login-box span.a2:hover {
      color: #000;
      text-decoration: underline;
    }

    .error-message {
      color: #ff4d4d;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .login-box .user-box input:hover {
      border-bottom-color: #ffffff;
      transition: border-bottom-color 0.3s ease;
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="login-box">
        <p>Login</p>
        <form onSubmit={onSubmit}>
          <div className="user-box">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="user-box">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
            <label>Password</label>
          </div>

          {/* ✨ Animated Button */}
          <button type="submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
        </form>

        <p>
          Need an account?{" "}
          <Link to="/signup" className="a2">
            Sign Up!
          </Link>
        </p>

        <p>
          <span className="a2" onClick={() => setShowForgotModal(true)}>
            Forgot Password?
          </span>
        </p>
      </div>

      {showForgotModal && (
        <ForgotPassword onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
};

export default Login;
