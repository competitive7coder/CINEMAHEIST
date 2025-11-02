import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../api";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Effect for the live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        toast.error("Please fill out all fields.");
        return;
    }
    setLoading(true);
    try {
      // const response = await axios.post("http://localhost:5000/api/feedback", formData);
      const response = await api.post(`/feedback`, formData);
      toast.success(response.data.message || "Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error("Sorry, something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
  };

  // All component styles are self-contained here
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

    .contact-container {
      font-family: 'Poppins', sans-serif;
      min-height: 100vh;
      background-color: #000000ff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 1rem;
      color: #fff;
    }

    .contact-card {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      width: 100%;
      max-width: 1100px;
      border-radius: 18px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      background: #1c1c1c;
      animation: fadeInUp 1.2s ease-in-out;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 992px) {
      .contact-card {
        grid-template-columns: 1fr;
      }
    }

    /* LEFT SIDE INFO */
    .contact-info {
      padding: 3rem;
background-image: linear-gradient(to right, #434343 0%, black 100%);      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .contact-info h2 {
      font-size: 2.3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #E5E7EB;
    }

    .contact-info p {
      font-size: 1rem;
      line-height: 1.7;
      color: #9CA3AF;
      margin-bottom: 2.5rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 1rem;
      color: #D1D5DB;
      transition: color 0.3s ease;
    }
    
    .info-item a {
        color: inherit;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .info-item:hover, .info-item:hover a {
      color: #868381;
    }

    .icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      color: #868381;
      width: 24px; /* Align icons */
    }

    /* RIGHT SIDE FORM */
    .form-section {
      padding: 3rem;
      background-image: linear-gradient(to left, #434343 0%, black 100%);

    .form-heading {
      font-size: 2.2rem;
      font-weight: 800;
      font-family: 'Poppins', sans-serif;
      margin-bottom: 2rem;
      color: #ccc7c7ff;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    input,
    textarea {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-left: 4px solid transparent;
      border-radius: 10px;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      padding: 12px 15px;
      margin-bottom: 1.2rem;
      outline: none;
      transition: all 0.3s ease;
    }

    input:focus,
    textarea:focus {
      border-left: 4px solid #868381;
      background: #333;
      box-shadow: 0 0 15px rgba(134, 131, 129, 0.2);
    }

    textarea {
      resize: none;
      height: 140px;
    }

    .button-row {
      display: flex;
      gap: 10px;
      margin-top: 1rem;
    }

    .btn {
      flex: 1;
      padding: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 8px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-send {
      background: #868381;
      color: #161515;
    }

    .btn-send:hover {
      background: transparent;
      border-color: #868381;
      color: #868381;
    }
    
    .btn-send:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-reset {
      background: transparent;
      border: 2px solid #868381;
      color: #868381;
    }

    .btn-reset:hover {
      background: #868381;
      color: #161515;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="contact-container">
        <div className="contact-card">
          {/* LEFT SECTION */}
          <div className="contact-info">
            <h2>Let's Connect</h2>
            <p>
              Have questions or feedback? We’d love to hear from you! Use the
              form or contact us directly below.
            </p>

            <div className="info-item">
              <i className="bi bi-geo-alt-fill icon"></i>
              <span>Howrah, West Bengal, India</span>
            </div>
            <div className="info-item">
              <i className="bi bi-envelope-fill icon"></i>
              <a href="mailto:ghorui.protyushraj@gmail.com">
                ghorui.protyushraj@gmail.com
              </a>
            </div>
            <div className="info-item">
              <i className="bi bi-telephone-fill icon"></i>
              <a href="tel:+919874592372">+91 9874592372</a>
            </div>
            <div className="info-item">
              <i className="bi bi-clock-fill icon"></i>
              <span>{currentTime} (IST)</span>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="form-section">
            <h3 className="form-heading">Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                required
              />
              <div className="button-row">
                <button type="submit" className="btn btn-send" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={handleReset} className="btn btn-reset">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;

