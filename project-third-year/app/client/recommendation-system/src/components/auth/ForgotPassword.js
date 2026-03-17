import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
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
  0%, 100% { box-shadow: 0 40px 100px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.05); }
  50% { box-shadow: 0 40px 100px rgba(255,0,0,0.05); border-color: rgba(255,0,0,0.15); }
`;

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #050505;
  font-family: "Poppins", sans-serif;
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
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9)),
      url("https://i.pinimg.com/1200x/57/98/ef/5798efdd50ffc425d0713cca03342ce9.jpg") no-repeat center center/cover;
    animation: ${bgZoom} 25s ease-in-out infinite;
    z-index: 0;
  }

  @media (max-width: 992px) { display: none; }

  &::after {
    content: "";
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

  h1 { font-size: 5rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -4px; }
  span { color: #ff0000; text-shadow: 0 0 20px rgba(255,0,0,0.4); }
  p { color: rgba(255,255,255,0.6); font-size: 1.2rem; max-width: 480px; margin-top: 20px; line-height: 1.6; }
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f 0%, #050505 100%);
  border-left: 1px solid rgba(255,255,255,0.05);
  position: relative;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 60px 45px;
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 32px;
  animation:
    ${slideUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    ${cardGlow} 6s infinite ease-in-out;

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

  input {
    width: 100%;
    background: #000 !important;
    border: 1px solid #1a1a1a;
    padding: 18px 22px;
    border-radius: 16px;
    color: #fff !important;
    font-size: 1rem;
    transition: all 0.4s;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff;
      -webkit-box-shadow: 0 0 0px 1000px #000 inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder { color: #333; }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808 !important;
      box-shadow: 0 0 0 4px rgba(255,0,0,0.05);
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
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover { background: #fff; color: #000; transform: translateY(-4px); }
  &:disabled { background: #222; color: #555; cursor: not-allowed; }
`;

const LinkArea = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: #777;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    margin-left: 5px;
    &:hover { color: #ff0000; }
  }
`;

// --- SENT STATE ---
const SuccessBox = styled.div`
  text-align: center;
  padding: 20px 0;

  .icon {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  p {
    color: #555;
    font-size: 0.85rem;
    line-height: 1.7;
    margin-bottom: 30px;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      // Always show success — don't reveal if email exists (security)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <VisualSide>
        <BrandText>
          <h1>Stream<span>Hub</span></h1>
          <p>Regain access to your personalized 4K library in seconds.</p>
        </BrandText>
      </VisualSide>

      <FormSide>
        <Card>
          {!sent ? (
            <>
              <h2>Recover Access</h2>
              <p className="subtitle">Password Recovery Portal</p>

              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>

                <ActionButton type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </ActionButton>
              </form>

              <LinkArea>
                Remembered it?
                <Link to="/login">Back to Login</Link>
              </LinkArea>
            </>
          ) : (
            <>
              <h2>Check Inbox</h2>
              <p className="subtitle">Link Dispatched</p>
              <SuccessBox>
                <div className="icon">📬</div>
                <p>
                  If <strong style={{ color: "#fff" }}>{email}</strong> is registered,
                  a reset link has been sent. Check your inbox and spam folder.
                </p>
                <ActionButton as={Link} to="/login">
                  Back to Login
                </ActionButton>
              </SuccessBox>
            </>
          )}
        </Card>
      </FormSide>
    </PageContainer>
  );
};

export default ForgotPassword;