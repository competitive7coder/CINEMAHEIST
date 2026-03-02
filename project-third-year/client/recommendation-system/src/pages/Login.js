import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ForgotPassword from "../components/auth/ForgotPassword";
import styled, { keyframes } from "styled-components";

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #0a0a0a;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`;

const VisualSide = styled.div`
  flex: 1.2;
  position: relative;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), 
              url('https://i.postimg.cc/dt7BF6gc/download-33.jpg') no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px;
  
  @media (max-width: 992px) { display: none; }

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, transparent, #0a0a0a);
  }
`;

const BrandText = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
  
  h1 { font-size: 4rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -2px; }
  span { color: #ff0000; }
  p { color: #ccc; font-size: 1.1rem; max-width: 400px; margin-top: 10px; line-height: 1.6; }
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d0d0d;
  border-left: 1px solid #222;
  position: relative;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  animation: ${slideUp} 0.8s ease-out;

  h2 { color: #fff; font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
  .subtitle { color: #666; margin-bottom: 40px; font-size: 0.95rem; }
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.85rem;
    margin-bottom: 8px;
    font-weight: 500;
    transition: 0.3s;
  }

  input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #333;
    padding: 14px 18px;
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #222;
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.1);
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: #cc0000;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 0, 0, 0.2);
  }

  &:active { transform: translateY(0); }
`;

const LinkArea = styled.div`
  margin-top: 30px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;

  a, .forgot {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    margin-left: 5px;
    transition: 0.2s;

    &:hover { color: #ff0000; }
  }

  .forgot-block { margin-top: 15px; display: block; }
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
      toast.success("Access Granted.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid Credentials");
    }
  };

  return (
    <PageContainer>
      {/* Left Panel */}
      <VisualSide>
        <BrandText>
          <h1>Stream<span>Hub</span></h1>
          <p>Unlimited movies, TV shows, and more. Experience the next generation of entertainment.</p>
        </BrandText>
      </VisualSide>

      {/* Right Panel  */}
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