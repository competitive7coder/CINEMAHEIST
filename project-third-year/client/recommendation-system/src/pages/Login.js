import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
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
    inset: 0;
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

  h2 { color: #fff; font-size: 2.4rem; font-weight: 800; margin-bottom: 8px; }
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
  margin-bottom: 25px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.7rem;
    margin-bottom: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    background: #000;
    border: 1px solid #1a1a1a;
    padding: 18px 22px;
    padding-right: ${props => props.hasIcon ? '50px' : '22px'};
    border-radius: 16px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.4s;

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808;
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.05);
      transform: translateY(-2px);
    }
  }
`;

const EyeButton = styled.div`
  position: absolute;
  right: 20px;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: 0.3s;
  &:hover { color: #ff0000; }
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
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-4px);
  }
  &:disabled {
    background: #222;
    color: #555;
    cursor: not-allowed;
  }
`;

const LinkArea = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;

  .signup-text {
    color: #777;
    a {
      color: #fff;
      text-decoration: none;
      font-weight: 700;
      margin-left: 5px;
      &:hover { color: #ff0000; }
    }
  }

  .forgot-block { 
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.03);
    
    .forgot-trigger {
      color: #555;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      gap: 10px;

      span {
        width: 6px; height: 6px;
        background: #ff0000;
        border-radius: 50%;
        box-shadow: 0 0 8px #ff0000;
      }
      &:hover { color: #fff; }
    }
  }
`;

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Sign In
  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      toast.success("Identity Verified. Access Granted.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password (API CALL)
  const onForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Security link dispatched to your Gmail.");
      setIsForgotView(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Email recovery failed.");
    } finally {
      setLoading(false);
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
        {!isForgotView ? (
          <LoginCard>
            <h2>Welcome back</h2>
            <p className="subtitle">Secure Authentication Portal</p>
            
            <form onSubmit={onLoginSubmit}>
              <InputGroup>
                <label>Email Address</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="name@company.com"
                    value={email || ""} 
                    onChange={onChange} 
                    required 
                  />
                </div>
              </InputGroup>

              <InputGroup hasIcon>
                <label>Password</label>
                <div className="input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="••••••••"
                    value={password || ""} 
                    onChange={onChange} 
                    required 
                  />
                  <EyeButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </EyeButton>
                </div>
              </InputGroup>

              <ActionButton type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Sign In"}
              </ActionButton>
            </form>

            <LinkArea>
              <span className="signup-text">
                Need an account? <Link to="/signup">Sign up now</Link>
              </span>
              <div className="forgot-block">
                <span className="forgot-trigger" onClick={() => setIsForgotView(true)}>
                  <span /> Forgot Password?
                </span>
              </div>
            </LinkArea>
          </LoginCard>
        ) : (
          <LoginCard>
            <h2>Recover Access</h2>
            <p className="subtitle">Enter your email to receive a reset link</p>
            
            <form onSubmit={onForgotSubmit}>
              <InputGroup>
                <label>Email Address</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@company.com"
                    value={email || ""} 
                    onChange={onChange}
                    required 
                  />
                </div>
              </InputGroup>

              <ActionButton type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </ActionButton>
            </form>

            <LinkArea>
              <div className="forgot-block">
                <span className="forgot-trigger" onClick={() => setIsForgotView(false)}>
                  <span /> Back to Login
                </span>
              </div>
            </LinkArea>
          </LoginCard>
        )}
      </FormSide>
    </PageContainer>
  );
};

export default Login;