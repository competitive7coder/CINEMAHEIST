import React, { useState } from "react";
import api from "../services/api";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // "sending" | "success" | "error"

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const contacts = [
    { icon: "bi-envelope", label: "General Enquiries", value: "hello.streamhub@proton.me" },
    { icon: "bi-shield-exclamation", label: "DMCA / Copyright", value: "dmca.streamhub@proton.me" },
    { icon: "bi-bug", label: "Bug Reports", value: "bugs.streamhub@proton.me" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-hero {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 80px 20px 60px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .contact-hero::before {
          content: ''; position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%); width: 500px; height: 280px;
          background: radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.2);
          border-radius: 20px; padding: 6px 16px;
          font-size: 0.7rem; font-weight: 600; color: #e50914;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
        }
        .contact-hero h1 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700; color: #fff; margin-bottom: 12px; }
        .contact-hero h1 span { color: #e50914; }
        .contact-hero p { font-size: 0.88rem; color: rgba(255,255,255,0.38); max-width: 440px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

        .contact-container { max-width: 1000px; margin: 0 auto; padding: 60px 20px 80px; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

        /* Left side */
        .contact-info h2 { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .contact-info p { font-size: 0.82rem; color: rgba(255,255,255,0.35); line-height: 1.75; font-weight: 300; margin-bottom: 28px; }

        .contact-cards { display: flex; flex-direction: column; gap: 10px; }
        .contact-card {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          transition: border-color 0.2s;
        }
        .contact-card:hover { border-color: rgba(229,9,20,0.2); }
        .contact-card-icon {
          width: 36px; height: 36px;
          background: rgba(229,9,20,0.1);
          border: 1px solid rgba(229,9,20,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #e50914; font-size: 0.9rem; flex-shrink: 0;
        }
        .contact-card-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 3px; }
        .contact-card-value { font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.6); }

        .contact-response-note {
          margin-top: 20px; padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 0.72rem; color: rgba(255,255,255,0.25); line-height: 1.6; font-weight: 300;
        }

        /* Right side — form */
        .contact-form-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 28px;
        }
        .contact-form-title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 22px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .form-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.5px; color: rgba(255,255,255,0.35); text-transform: uppercase; }
        .form-input, .form-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: rgba(229,9,20,0.4);
          background: rgba(229,9,20,0.04);
        }
        .form-input::placeholder, .form-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .form-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

        .form-submit {
          width: 100%; padding: 12px;
          background: #e50914; border: none; border-radius: 9px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 6px;
        }
        .form-submit:hover:not(:disabled) { background: #ff1a1a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(229,9,20,0.3); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .form-status {
          margin-top: 14px; padding: 12px 16px;
          border-radius: 8px; font-size: 0.8rem; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .form-status.success { background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; }
        .form-status.error { background: rgba(229,9,20,0.08); border: 1px solid rgba(229,9,20,0.2); color: #ff6060; }

        @media (max-width: 600px) {
          .contact-hero { padding: 60px 16px 40px; }
          .contact-container { padding: 36px 16px 60px; }
          .contact-form-wrap { padding: 20px; }
        }
      `}</style>

      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-badge">✉️ Contact</div>
        <h1>Get in <span>Touch</span></h1>
        <p>Have a question, bug report, or copyright concern? We're here to help.</p>
      </div>

      <div className="contact-container">
        <div className="contact-grid">

          {/* Left — Contact Info */}
          <div className="contact-info">
            <h2>How can we help?</h2>
            <p>Use the form or email us directly. We read every message and respond within 48 hours.</p>

            <div className="contact-cards">
              {contacts.map((c, i) => (
                <div key={i} className="contact-card">
                  <div className="contact-card-icon"><i className={`bi ${c.icon}`} /></div>
                  <div>
                    <div className="contact-card-label">{c.label}</div>
                    <div className="contact-card-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-response-note">
              ⏱ We typically respond within <strong style={{color:"rgba(255,255,255,0.45)"}}>24–48 hours</strong>. For DMCA/copyright complaints, responses are sent within 48 hours as required by law.
            </div>
          </div>

          {/* Right — Form */}
          <div className="contact-form-wrap">
            <div className="contact-form-title">Send us a message</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    placeholder="Protyush"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  type="text"
                  name="subject"
                  placeholder="e.g. Movie not loading on Server 2"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  name="message"
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="form-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? <><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}} /> Sending...</>
                  : <><i className="bi bi-send" /> Send Message</>
                }
              </button>

              {status === "success" && (
                <div className="form-status success">
                  ✅ Message sent! We'll get back to you within 48 hours.
                </div>
              )}
              {status === "error" && (
                <div className="form-status error">
                  ❌ Something went wrong. Please email us directly at hello.streamhub@proton.me
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ContactUs;