import React, { useState } from 'react';
// import axios from 'axios'; // <-- OLD
import api from '../api'; // <-- NEW
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post('http://localhost:5000/api/auth/login', { // <-- OLD
      const res = await api.post('/auth/login', { // <-- NEW
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      toast.success('Logged in successfully!', { position: 'top-center' });
      navigate('/dashboard');
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || 'Something went wrong! Please try again.';
      toast.error(errorMsg);
    }
  };
 const styles = `
    /* From Uiverse.io by glisovic01 - Adapted for React */
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
  -webkit-backdrop-filter: blur(20px); 
  
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
  transition: all 0.3s ease-out;
}


    .login-box:hover {
      box-shadow: 0 0 5px #131515ff,
                  0 0 25px #000000ff;
      transform: translate(-50%, -50%) scale(1.02);
    }

    .login-box p:first-child {
      margin: 0 0 30px;
      padding: 0;
      color: #ffffffff;
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 1px;
      font-family:cursive;
    }

    .login-box .user-box {
      position: relative;
    }

    .login-box .user-box input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #ffffffff;
      margin-bottom: 30px;
      border: none;
      border-bottom: 1px solid #ffffffff;
      outline: none;
      background: transparent;
    }

    .login-box .user-box label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #ffffffff;
      pointer-events: none;
      transition: .5s;
    }

    .login-box .user-box input:focus ~ label,
    .login-box .user-box input:valid ~ label {
      top: -20px;
      left: 0;
      color: #ffffffff;
      font-size: 12px;
    }

    .login-box form button {
      position: relative;
      display: inline-block;
      padding: 10px 20px;
      font-weight: bold;
      color: #ffffffff;
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
      background: #ffffffff;
      color: #272727;
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
      background: linear-gradient(90deg, transparent, #000000ff);
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
      background: linear-gradient(180deg, transparent, #000000ff);
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
      height: 2px;
      background: linear-gradient(270deg, transparent, #fff);
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
      width: 2px;
      height: 100%;
      background: linear-gradient(360deg, transparent, #fff);
      animation: btn-anim4 1.5s linear infinite;
      animation-delay: 1.125s;
    }

    @keyframes btn-anim4 {
      0% { bottom: -100%; }
      50%,100% { bottom: 100%; }
    }

    .login-box p:last-child {
      color: #f7f7f7ff;
      font-size: 14px;
      font-weight: 500;
    }

    .login-box a.a2 {
      color: #fff;
      text-decoration: none;
            font-weight: 600;

    }

    .login-box a.a2:hover {
      background: transparent;
      color: #000000ff;
      border-radius: 5px;
    }

    .error-message {
      color: #ff4d4d;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .login-box .user-box input:hover {
      border-bottom-color: #000000ff;
      transition: border-bottom-color 0.3s ease;
    }

    .success-message {
      color: #4CAF50;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .login-box {
        width: 90%;
        padding: 30px 20px;
      }
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

          <button type="submit">
            <span></span><span></span><span></span><span></span>
            Submit
          </button>
        </form>

        <p>
          Need an account?{' '}
          <Link to="/signup" className="a2">
            Sign Up!
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;