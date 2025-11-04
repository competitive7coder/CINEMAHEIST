import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset link sent!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-modal-container">
      <div className="forgot-modal-card">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Forgot Password</h2>
        <p className="subtitle">Enter your email to receive a reset link</p>

        <form onSubmit={handleForgotPassword}>
          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email address</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        /* === Modal Container === */
        .forgot-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px); /* ✅ Only blur, no dark overlay */
          background: transparent; /* ✅ Keep login background visible */
          z-index: 999;
        }

        /* === Card === */
        .forgot-modal-card {
          position: relative;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 45px 40px;
          width: 400px;
          color: #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          animation: scaleIn 0.3s ease-out;
        }

        /* === Close Button === */
        .close-btn {
          position: absolute;
          top: 12px;
          right: 18px;
          font-size: 22px;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
        }

        h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 30px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .input-box {
          position: relative;
        }

        .input-box input {
          width: 100%;
          padding: 12px 0;
          font-size: 16px;
          color: #fff;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          outline: none;
          transition: all 0.3s ease;
        }

        .input-box input:focus {
          border-bottom-color: #00aaff;
        }

        .input-box label {
          position: absolute;
          top: 12px;
          left: 0;
          color: #aaa;
          font-size: 15px;
          transition: 0.3s;
        }

        .input-box input:focus ~ label,
        .input-box input:valid ~ label {
          top: -10px;
          font-size: 12px;
          color: #00aaff;
        }

        button {
          background: #00aaff;
          border: none;
          padding: 12px 0;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 6px 20px rgba(0,170,255,0.3);
        }

        button:hover {
          background: #0090e0;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,170,255,0.5);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 480px) {
          .forgot-modal-card {
            width: 90%;
            padding: 35px 25px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
