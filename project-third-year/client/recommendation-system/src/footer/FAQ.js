import React, { useState } from "react";
import { BsEnvelope } from "react-icons/bs";

const faqs = [
  {
    category: "Streaming",
    items: [
      {
        q: "Why does the wrong movie play sometimes?",
        a: "Embed servers sometimes mis-map movie IDs. Simply switch to another server using the server tabs at the top of the player. Server 1 or Server 2 usually gives the best results.",
      },
      {
        q: "Why is the video buffering a lot?",
        a: "Buffering is caused by the third-party embed server, not StreamHub. Try switching to a different server — each one uses a different source. Server 3 (Videasy) is generally the most stable.",
      },
      {
        q: "Can I download movies from StreamHub?",
        a: "No. StreamHub does not provide downloads. We are a streaming discovery platform only. All content is served via embedded players from third-party providers.",
      },
      {
        q: "Why do some movies show a blank/black player?",
        a: "The movie may not yet be available on that server. Try switching servers. Very new movies (still in theatres) may not be available on any server yet.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "How do I reset my password?",
        a: "Go to the Login page and click 'Forgot Password'. Enter your registered email and we'll send you a reset link. The link expires after 24 hours.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings → Account → Delete Account. This permanently removes your profile, watchlist, and all associated data. This action cannot be undone.",
      },
      {
        q: "Why isn't my watchlist syncing?",
        a: "Make sure you're logged in. Watchlist data syncs automatically to our servers. If you're seeing stale data, try refreshing the page or logging out and back in.",
      },
    ],
  },
  {
    category: "Recommendations",
    items: [
      {
        q: "How does StreamHub recommend movies?",
        a: "StreamHub uses a 5-stage hybrid ML engine combining collaborative filtering (SVD), content-based filtering (TF-IDF), and a temporal watchlist decay algorithm. The more movies you add to your watchlist, the better your recommendations get.",
      },
      {
        q: "Why are my recommendations not changing?",
        a: "Recommendations update based on your watchlist activity. Add more movies to your watchlist to improve diversity. Our temporal decay algorithm also gives more weight to recently added movies.",
      },
      {
        q: "How many movies do I need in my watchlist for good recommendations?",
        a: "We recommend at least 5 movies for basic recommendations. 10+ movies gives significantly better results as the ML engine has more signals to work with.",
      },
    ],
  },
  {
    category: "Legal & Copyright",
    items: [
      {
        q: "Does StreamHub host any movies?",
        a: "No. StreamHub does not host, upload, or store any video content. All streams are served by independent third-party embed providers. StreamHub functions as a search and discovery index only.",
      },
      {
        q: "How do I report a copyright violation?",
        a: "Email our DMCA agent at dmca.streamhub@proton.me with the movie title, page URL, and proof of ownership. We respond within 48 hours and forward complaints to the relevant embed provider.",
      },
      {
        q: "Is StreamHub free to use?",
        a: "Yes. StreamHub is completely free. We do not charge for any features, require a subscription, or store payment information.",
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const toggle = (key) => setOpenIndex(openIndex === key ? null : key);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .faq-hero {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 80px 20px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .faq-hero::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 500px; height: 280px;
          background: radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .faq-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.2);
          border-radius: 20px; padding: 6px 16px;
          font-size: 0.7rem; font-weight: 600; color: #e50914;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
        }
        .faq-hero h1 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700; color: #fff; margin-bottom: 12px; }
        .faq-hero h1 span { color: #e50914; }
        .faq-hero p { font-size: 0.88rem; color: rgba(255,255,255,0.38); max-width: 440px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

        .faq-container { max-width: 780px; margin: 0 auto; padding: 50px 20px 80px; }

        .faq-categories {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 40px; justify-content: center;
        }
        .faq-cat-btn {
          padding: 7px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          color: rgba(255,255,255,0.4);
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .faq-cat-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .faq-cat-btn.active { background: #e50914; border-color: #e50914; color: #fff; }

        .faq-section { margin-bottom: 40px; }
        .faq-section-label {
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 12px; padding-left: 4px;
        }

        .faq-item {
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item.open { border-color: rgba(229,9,20,0.25); }

        .faq-question {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: background 0.2s;
          gap: 12px;
        }
        .faq-question:hover { background: rgba(255,255,255,0.04); }
        .faq-item.open .faq-question { background: rgba(229,9,20,0.05); }

        .faq-q-text {
          font-size: 0.88rem; font-weight: 600;
          color: rgba(255,255,255,0.8);
          line-height: 1.4;
        }
        .faq-item.open .faq-q-text { color: #fff; }

        .faq-icon {
          width: 24px; height: 24px; flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; color: rgba(255,255,255,0.4);
          transition: all 0.2s;
        }
        .faq-item.open .faq-icon {
          background: rgba(229,9,20,0.15);
          color: #e50914;
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .faq-item.open .faq-answer { max-height: 200px; }

        .faq-answer-inner {
          padding: 0 18px 16px;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.8;
          font-weight: 300;
        }

        .faq-contact-box {
          margin-top: 50px;
          padding: 28px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          text-align: center;
        }
        .faq-contact-box h3 { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .faq-contact-box p { font-size: 0.82rem; color: rgba(255,255,255,0.35); margin-bottom: 18px; font-weight: 300; line-height: 1.6; }
        .faq-contact-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px;
          background: #e50914; border: none; border-radius: 9px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .faq-contact-btn:hover { background: #ff1a1a; transform: translateY(-1px); color: #fff; }

        @media (max-width: 600px) {
          .faq-hero { padding: 60px 16px 40px; }
          .faq-container { padding: 36px 16px 60px; }
        }
      `}</style>

      {/* Hero */}
      <div className="faq-hero">
        <div className="faq-badge">❓ Help Center</div>
        <h1>
          Frequently Asked <span>Questions</span>
        </h1>
        <p>
          Everything you need to know about StreamHub. Can't find your answer?
          Contact us directly.
        </p>
      </div>

      <div className="faq-container">
        {/* Category Filter */}
        <div className="faq-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faq-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {filteredFaqs.map((section) => (
          <div key={section.category} className="faq-section">
            <div className="faq-section-label">{section.category}</div>
            {section.items.map((item, i) => {
              const key = `${section.category}-${i}`;
              const isOpen = openIndex === key;
              return (
                <div key={key} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <div className="faq-question" onClick={() => toggle(key)}>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-icon">+</span>
                  </div>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Contact box */}
        <div className="faq-contact-box">
          <h3>Still have questions?</h3>
          <p>Can't find what you're looking for? Our team is happy to help.</p>
          <a href="/contact" className="faq-contact-btn">
            <BsEnvelope />
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
