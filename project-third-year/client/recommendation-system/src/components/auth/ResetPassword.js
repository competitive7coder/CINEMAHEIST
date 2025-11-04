import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Fixed: Use /auth/reset-password instead of /reset-password
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to reset password.";
      toast.error(msg);
    } finally {
      setLoading(false);
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
      overflow: hidden;
    }

    .reset-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 15px 25px rgba(0,0,0,0.6);
      border-radius: 12px;
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      color: #fff;
    }

    .reset-container h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 20px;
      font-family: cursive;
    }

    .reset-container p {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 25px;
    }

    .form-group {
      position: relative;
      margin-bottom: 25px;
    }

    .form-group input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      border: none;
      border-bottom: 1px solid #fff;
      background: transparent;
      outline: none;
      letter-spacing: 1px;
    }

    .form-group label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      pointer-events: none;
      transition: 0.3s;
    }

    .form-group input:focus ~ label,
    .form-group input:valid ~ label {
      top: -18px;
      font-size: 12px;
      color: #f1f1f1;
    }

    button {
      width: 100%;
      padding: 12px;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.3s;
      letter-spacing: 1px;
    }

    button:hover {
      background: #000;
      color: #fff;
    }

    @media (max-width: 480px) {
      .reset-container {
        width: 90%;
        padding: 30px 20px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="reset-container">
        <h2>Reset Password</h2>
        <p>Enter and confirm your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
