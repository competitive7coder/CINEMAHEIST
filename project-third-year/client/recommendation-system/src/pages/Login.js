import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ForgotPassword from "../components/auth/ForgotPassword";
import styled, { keyframes } from "styled-components";

// --- ANIMATIONS ---
const bgZoom = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const cardGlow = keyframes`
  0%, 100% { box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4); border-color: rgba(255, 255, 255, 0.05); }
  50% { box-shadow: 0 40px 100px rgba(255, 0, 0, 0.05); border-color: rgba(255, 0, 0, 0.15); }
`;

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #050505;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`;

const VisualSide = styled.div`
  flex: 1.3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9)), 
                url('https://i.postimg.cc/dt7BF6gc/download-33.jpg') no-repeat center center/cover;
    animation: ${bgZoom} 25s ease-in-out infinite;
    z-index: 0;
  }
  
  @media (max-width: 992px) { display: none; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent, #050505);
    z-index: 1;
  }
`;

const BrandText = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  
  h1 { 
    font-size: 5rem; 
    font-weight: 900; 
    color: #fff; 
    margin: 0; 
    letter-spacing: -4px;
    text-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }
  span { color: #ff0000; text-shadow: 0 0 20px rgba(255, 0, 0, 0.4); }
  p { color: rgba(255,255,255,0.6); font-size: 1.2rem; max-width: 480px; margin-top: 20px; line-height: 1.6; }
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f 0%, #050505 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 60px 45px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  animation: ${slideUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1), ${cardGlow} 6s infinite ease-in-out;

  h2 { color: #fff; font-size: 2.4rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; }
  .subtitle { 
    color: #555; 
    margin-bottom: 45px; 
    font-size: 0.8rem; 
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 30px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.7rem;
    margin-bottom: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-left: 4px;
  }

  input {
    width: 100%;
    background: #000;
    border: 1px solid #1a1a1a;
    padding: 18px 22px;
    border-radius: 16px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &::placeholder { color: #333; }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808;
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.05), 0 10px 30px rgba(0,0,0,0.5);
      transform: translateY(-2px);
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 20px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(255, 255, 255, 0.1);
  }

  &:active { transform: translateY(-1px); }
`;

const LinkArea = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: #444;

  a, .forgot {
    color: #eee;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    margin-left: 5px;
    transition: 0.3s;
    border-bottom: 1px solid transparent;

    &:hover { 
      color: #ff0000; 
      border-bottom: 1px solid #ff0000;
    }
  }

  .forgot-block { 
    margin-top: 25px; 
    display: block; 
    font-size: 0.8rem;
    opacity: 0.6;
    &:hover { opacity: 1; }
  }
`;

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      toast.success("Identity Verified. Welcome.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Unauthorized Access");
    }
  };

  return (
    <PageContainer>
      <VisualSide>
        <BrandText>
          <h1>Stream<span>Hub</span></h1>
          <p>The next evolution of digital entertainment. Login to access your personalized 4K library.</p>
        </BrandText>
      </VisualSide>

      <FormSide>
        <LoginCard>
          <h2>Welcome back</h2>
          <p className="subtitle">Please enter your details to sign in.</p>
          
          <form onSubmit={onSubmit}>
            <InputGroup>
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="name@company.com"
                value={email} 
                onChange={onChange} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••"
                value={password} 
                onChange={onChange} 
                required 
              />
            </InputGroup>

            <ActionButton type="submit">Sign In</ActionButton>
          </form>

          <LinkArea>
            Don't have an account? <Link to="/signup">Sign up for free</Link>
            <div className="forgot-block">
              <span className="forgot" onClick={() => setShowForgotModal(true)}>
                Forgot your password?
              </span>
            </div>
          </LinkArea>
        </LoginCard>
      </FormSide>

      {showForgotModal && (
        <ForgotPassword onClose={() => setShowForgotModal(false)} />
      )}
    </PageContainer>
  );
};

export default Login;