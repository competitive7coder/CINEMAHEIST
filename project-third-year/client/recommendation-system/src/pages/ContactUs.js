import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { BsChatDots, BsSendFill } from "react-icons/bs";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [focused, setFocused] = useState(null);
  const canvasRef = useRef(null);

  // Live IST clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let resizeTimer;
    const ro = new ResizeObserver((entries) => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const entry = entries[0];
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
      }, 100);
    });
    ro.observe(canvas);

    // Safe defaults  ResizeObserver fires immediately and corrects these
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,9,20,${p.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/feedback/send", formData);
      toast.success(response.data.msg || "Message chala gya mere pas ");
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch (error) {
      toast.error("Kuch der bad try karo");
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    {
      icon: "bi-envelope-at",
      label: "General Enquiries",
      value: "hello.CinemaHeist@proton.me",
      href: "mailto:hello.CinemaHeist@proton.me",
    },
    {
      icon: "bi-shield-check",
      label: "DMCA / Copyright",
      value: "dmca.CinemaHeist@proton.me",
      href: "mailto:dmca.CinemaHeist@proton.me",
    },
    {
      icon: "bi-bug",
      label: "Bug Reports",
      value: "bugs.CinemaHeist@proton.me",
      href: "mailto:bugs.CinemaHeist@proton.me",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        fontFamily: "'Poppins', sans-serif",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cu-page {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 20px; position: relative; z-index: 1;
        }
        .cu-header { text-align: center; margin-bottom: 52px; }
        .cu-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(229,9,20,0.08); border: 1px solid rgba(229,9,20,0.18);
          border-radius: 30px; padding: 6px 18px;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #e50914; margin-bottom: 18px;
        }
        .cu-header h1 {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900; letter-spacing: -2px;
          color: #fff; line-height: 1.05; margin-bottom: 14px;
        }
        .cu-header h1 em {
          font-style: normal;
          background: linear-gradient(90deg, #e50914, #ff6b6b);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cu-header p { font-size: 0.9rem; color: rgba(255,255,255,0.35); max-width: 400px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

        .cu-grid {
          display: grid; grid-template-columns: 360px 1fr;
          gap: 20px; width: 100%; max-width: 1040px;
        }
        @media (max-width: 900px) { .cu-grid { grid-template-columns: 1fr; max-width: 560px; } }

        .cu-info {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px 28px;
          display: flex; flex-direction: column;
        }
        .cu-info-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.18); margin-bottom: 20px; }
        .cu-info-items { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .cu-info-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 14px; border-radius: 12px;
          text-decoration: none; color: inherit;
          transition: all 0.2s; border: 1px solid transparent;
        }
        a.cu-info-item:hover { background: rgba(229,9,20,0.06); border-color: rgba(229,9,20,0.15); transform: translateX(4px); }
        .cu-info-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          background: rgba(229,9,20,0.08); border: 1px solid rgba(229,9,20,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: #e50914; font-size: 0.95rem;
        }
        .cu-info-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 2px; }
        .cu-info-val { font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cu-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 18px 0; }
        .cu-clock { display: flex; align-items: center; gap: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.18); }
        .cu-clock-dot { width: 6px; height: 6px; background: #e50914; border-radius: 50%; animation: cu-blink 1.2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes cu-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .cu-form-panel {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 34px 32px;
        }
        .cu-form-heading { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 5px; letter-spacing: -0.5px; }
        .cu-form-sub { font-size: 0.76rem; color: rgba(255,255,255,0.25); margin-bottom: 26px; font-weight: 300; }
        .cu-field { margin-bottom: 18px; }
        .cu-field-label {
          display: block; font-size: 0.62rem; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 7px; transition: color 0.2s;
        }
        .cu-field-label.active { color: #e50914; }
        .cu-field-required { color: #e50914; }
        .cu-input, .cu-textarea {
          width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 11px 15px; color: #fff;
          font-family: 'Poppins', sans-serif; font-size: 0.86rem; outline: none; transition: all 0.2s;
        }
        .cu-input:focus, .cu-textarea:focus {
          border-color: rgba(229,9,20,0.4); background: rgba(229,9,20,0.03);
          box-shadow: 0 0 0 3px rgba(229,9,20,0.06);
        }
        .cu-input::placeholder, .cu-textarea::placeholder { color: rgba(255,255,255,0.16); }
        .cu-textarea { resize: vertical; min-height: 128px; line-height: 1.65; }
        .cu-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 500px) { .cu-field-row { grid-template-columns: 1fr; } }

        .cu-btn {
          width: 100%; margin-top: 6px; padding: 13px 20px;
          background: #e50914; border: none; border-radius: 10px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          cursor: pointer; transition: all 0.22s;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          position: relative; overflow: hidden;
        }
        .cu-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .cu-btn:hover::before { transform: translateX(100%); }
        .cu-btn:hover:not(:disabled) { background: #ff1a1a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229,9,20,0.3); }
        .cu-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .cu-btn-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: cu-spin 0.75s linear infinite; }
        @keyframes cu-spin { to { transform: rotate(360deg); } }

        .cu-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 50px 20px; gap: 14px;
          animation: cu-fadeIn 0.4s ease;
        }
        @keyframes cu-fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cu-success-icon { width: 62px; height: 62px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.7rem; }
        .cu-success h3 { font-size: 1.05rem; font-weight: 800; color: #fff; }
        .cu-success p { font-size: 0.8rem; color: rgba(255,255,255,0.32); font-weight: 300; line-height: 1.65; max-width: 260px; }
        .cu-success-back { margin-top: 6px; padding: 8px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.45); font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cu-success-back:hover { border-color: rgba(255,255,255,0.22); color: #fff; }

        @media (max-width: 600px) { .cu-page { padding: 36px 14px; } .cu-form-panel, .cu-info { padding: 22px 18px; } }
      `}</style>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: 350,
          height: 350,
          background:
            "radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="cu-page">
        <div className="cu-header">
          <div className="cu-eyebrow">
            <BsChatDots />
            Get in Touch
          </div>
          <h1>
            Contact <em>CinemaHeist</em>
          </h1>
          <p>
            Questions, bug reports, or copyright concerns — we read every
            message personally.
          </p>
        </div>

        <div className="cu-grid">
          {/* Info */}
          <div className="cu-info">
            <div className="cu-info-title">Reach us directly</div>
            <div className="cu-info-items">
              {infoItems.map((item, i) => {
                const Tag = item.href ? "a" : "div";
                return (
                  <Tag
                    key={i}
                    className="cu-info-item"
                    {...(item.href ? { href: item.href } : {})}
                  >
                    <div className="cu-info-icon">
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="cu-info-label">{item.label}</div>
                      <div className="cu-info-val">{item.value}</div>
                    </div>
                  </Tag>
                );
              })}
            </div>
            <div className="cu-divider" />
            <div className="cu-clock">
              <div className="cu-clock-dot" />
              <span>IST {currentTime} — We're online</span>
            </div>
          </div>

          {/* Form */}
          <div className="cu-form-panel">
            {sent ? (
              <div className="cu-success">
                <div className="cu-success-icon"></div>
                <h3>Message Received!</h3>
                <p>Thanks for reaching out. We'll reply within 24–48 hours.</p>
                <button
                  className="cu-success-back"
                  onClick={() => setSent(false)}
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="cu-form-heading">Send us a message</div>
                <div className="cu-form-sub">
                  We typically respond within 24–48 hours.
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="cu-field-row">
                    <div className="cu-field">
                      <label
                        className={`cu-field-label ${focused === "name" ? "active" : ""}`}
                      >
                        Name <span className="cu-field-required">*</span>
                      </label>
                      <input
                        className="cu-input"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>
                    <div className="cu-field">
                      <label
                        className={`cu-field-label ${focused === "email" ? "active" : ""}`}
                      >
                        Email <span className="cu-field-required">*</span>
                      </label>
                      <input
                        className="cu-input"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>
                  </div>
                  <div className="cu-field">
                    <label
                      className={`cu-field-label ${focused === "message" ? "active" : ""}`}
                    >
                      Message <span className="cu-field-required">*</span>
                    </label>
                    <textarea
                      className="cu-textarea"
                      name="message"
                      placeholder="Describe your question or issue..."
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </div>
                  <button className="cu-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="cu-btn-spinner" /> Sending...
                      </>
                    ) : (
                      <>
                        <BsSendFill />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
