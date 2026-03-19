import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/feedback`, formData);
      toast.success(response.data.message || "Message transmission successful.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .cu-wrapper {
      min-height: 100vh;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      font-family: 'Inter', sans-serif;
    }

    /* Ambient background glow */
    .cu-wrapper::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(229, 9, 20, 0.15);
      filter: blur(120px);
      border-radius: 50%;
      top: 10%; right: 10%;
    }

    .cu-card {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      width: 100%;
      max-width: 1100px;
      min-height: 650px;
      background: rgba(15, 15, 15, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.8);
      z-index: 1;
    }

    @media (max-width: 900px) {
      .cu-card { grid-template-columns: 1fr; }
    }

    /* Side Pane: Branding & Info */
    .cu-info-pane {
      background: linear-gradient(160deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%);
      padding: 60px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.03);
    }

    .cu-info-pane h2 {
      font-size: 2.8rem;
      font-weight: 900;
      color: #fff;
      margin-bottom: 24px;
      letter-spacing: -2px;
      line-height: 1;
    }

    .cu-info-pane h2 span {
      background: linear-gradient(90deg, #e50914, #ff4d4d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cu-info-pane p {
      font-size: 1rem;
      color: #888;
      line-height: 1.6;
      margin-bottom: 60px;
    }

    .cu-contact-list { display: flex; flex-direction: column; gap: 32px; }

    .cu-item {
      display: flex;
      align-items: center;
      gap: 20px;
      color: #aaa;
      text-decoration: none;
      transition: 0.3s;
    }

    .cu-item:hover { color: #fff; transform: translateX(8px); }

    .cu-icon-box {
      width: 52px;
      height: 52px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: #e50914;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
    }

    /* Form Pane */
    .cu-form-pane { padding: 60px; display: flex; flex-direction: column; justify-content: center; }

    .cu-input-group { position: relative; margin-bottom: 30px; }

    .cu-input-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #555;
      margin-bottom: 10px;
      transition: 0.3s;
    }

    .cu-input-group input, .cu-input-group textarea {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(255,255,255,0.08);
      padding: 12px 0;
      color: #fff;
      font-size: 1.1rem;
      outline: none;
      transition: 0.4s;
    }

    .cu-input-group input:focus, .cu-input-group textarea:focus {
      border-bottom-color: #e50914;
    }

    .cu-input-group input:focus + label { color: #e50914; }

    .cu-submit-btn {
      margin-top: 20px;
      padding: 18px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 16px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    .cu-submit-btn:hover {
      background: #fff;
      color: #000;
      transform: scale(1.02);
      box-shadow: 0 20px 40px rgba(229, 9, 20, 0.2);
    }

    .cu-time-badge {
      margin-top: auto;
      font-size: 0.8rem;
      letter-spacing: 1px;
      color: #444;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cu-time-badge i { color: #e50914; }
  `;

  return (
    <div className="cu-wrapper">
      <style>{styles}</style>
      <div className="cu-card">
        {/* LEFT: Info */}
        <div className="cu-info-pane">
          <div>
            <h2>Connect with <span>Us</span></h2>
            <p>Our concierge team is standing by to assist you with any inquiries regarding the StreamHub experience.</p>

            <div className="cu-contact-list">
              <a href="mailto:ghorui.protyushraj@gmail.com" className="cu-item">
                <div className="cu-icon-box"><i className="bi bi-shield-lock" /></div>
                <div>
                  <small style={{display:'block', fontSize:'0.7rem', color:'#555'}}>DIRECT EMAIL</small>
                  <strong>ghorui.protyushraj@gmail.com</strong>
                </div>
              </a>

              <a href="tel:+919874592372" className="cu-item">
                <div className="cu-icon-box"><i className="bi bi-headset" /></div>
                <div>
                  <small style={{display:'block', fontSize:'0.7rem', color:'#555'}}>24/7 SUPPORT</small>
                  <strong>+91 9874592372</strong>
                </div>
              </a>

              <div className="cu-item">
                <div className="cu-icon-box"><i className="bi bi-broadcast" /></div>
                <div>
                  <small style={{display:'block', fontSize:'0.7rem', color:'#555'}}>HQ LOCATION</small>
                  <strong>Howrah, West Bengal</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="cu-time-badge">
            <i className="bi bi-activity" /> Global Ops Center: {currentTime} (IST)
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="cu-form-pane">
          <form onSubmit={handleSubmit}>
            <div className="cu-input-group">
              <label>Identifer</label>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="cu-input-group">
              <label>Communication</label>
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="cu-input-group">
              <label>Inquiry</label>
              <textarea name="message" placeholder="Describe your request..." value={formData.message} onChange={handleChange} required rows="4" />
            </div>
            
            <button type="submit" className="cu-submit-btn" disabled={loading}>
              {loading ? "TRANSMITTING..." : (
                <> INITIATE CONTACT <i className="bi bi-arrow-right-short" style={{fontSize:'1.5rem'}} /> </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;