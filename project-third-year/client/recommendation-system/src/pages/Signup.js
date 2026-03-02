import React, { useState } from 'react';
import api from '../services/api'; 
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import styled, { keyframes } from "styled-components";

// --- ANIMATIONS ---
const bgZoom = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
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
                url('https://i.pinimg.com/1200x/f0/73/8c/f0738c341ce5a66f6aeb8bc871fab013.jpg') no-repeat center center/cover;
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
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`;

const SignupCard = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 50px 45px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  animation: ${slideUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);

  h2 { color: #fff; font-size: 2.2rem; font-weight: 800; margin-bottom: 8px; }
  .subtitle { 
    color: #555; 
    margin-bottom: 35px; 
    font-size: 0.75rem; 
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.65rem;
    margin-bottom: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-left: 4px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  input {
    width: 100%;
    background: #000 !important; /* Force black background */
    border: 1px solid #1a1a1a;
    padding: 14px 20px;
    padding-right: 50px;
    border-radius: 12px;
    color: #fff !important; /* Force white text */
    font-size: 0.95rem;
    transition: all 0.4s;

    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff;
      -webkit-box-shadow: 0 0 0px 1000px #000 inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder {
      color: #333;
      opacity: 1; /* Ensure placeholder doesn't affect background */
    }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808 !important;
    }
  }
`;

const EyeButton = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff; /* Clearly visible on dark bg */
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 10;
  opacity: 0.6;
  transition: 0.3s;

  &:hover {
    color: #ff0000;
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 10px;

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-4px);
  }
  &:disabled { background: #222; color: #555; }
`;

const LoginText = styled.p`
  margin-top: 35px;
  text-align: center;
  color: #555;
  font-size: 0.9rem;
  
  a {
    color: #eee;
    text-decoration: none;
    font-weight: 700;
    margin-left: 5px;
    &:hover { color: #ff0000; }
  }
`;

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRetype, setShowRetype] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, retypePassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== retypePassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password, retypePassword });
            toast.success(res.data.msg || "Identity Created!"); 
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <FormSide>
                <SignupCard>
                    <h2>Initialize Identity</h2>
                    <p className="subtitle">Secure Registration Portal</p>
                    
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <label>Designation (Full Name)</label>
                            <input 
                              type="text" 
                              name="name" 
                              value={name || ""} 
                              onChange={onChange} 
                              placeholder="e.g., Alex Carter" 
                              required 
                            />
                        </InputGroup>
                        <InputGroup>
                            <label>Neural Link (Email)</label>
                            <input 
                              type="email" 
                              name="email" 
                              value={email || ""} 
                              onChange={onChange} 
                              placeholder="name@company.com" 
                              required 
                            />
                        </InputGroup>

                        <InputGroup>
                            <label>Access Key (Password)</label>
                            <div className="input-wrapper">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={password || ""} 
                                onChange={onChange} 
                                placeholder="••••••••" 
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

                        <InputGroup>
                            <label>Verify Access Key</label>
                            <div className="input-wrapper">
                              <input 
                                type={showRetype ? "text" : "password"} 
                                name="retypePassword" 
                                value={retypePassword || ""} 
                                onChange={onChange} 
                                placeholder="••••••••" 
                                required 
                              />
                              <EyeButton onClick={() => setShowRetype(!showRetype)}>
                                {showRetype ? (
                                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                              </EyeButton>
                            </div>
                        </InputGroup>

                        <ActionButton type="submit" disabled={loading}>
                            {loading ? "INITIALIZING..." : "REGISTER OPERATIVE"}
                        </ActionButton>
                    </form>

                    <LoginText>
                        Already registered operative? <Link to="/login">Sign In</Link>
                    </LoginText>
                </SignupCard>
            </FormSide>

            <VisualSide>
                <BrandText>
                  <h1>Stream<span>Hub</span></h1>
                  <p>Experience the peak of 4K streaming. Create your account to unlock premium features and cinematic quality.</p>
                </BrandText>
            </VisualSide>
        </PageContainer>
    );
};

export default Signup;