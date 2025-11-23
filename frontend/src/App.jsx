// frontend/src/App.jsx

import React, { useEffect, useRef, useState } from "react";

/* =======================
   STEP METADATA (AFTER GENERATE)
   ======================= */

const SECTIONS = [
  {
    id: "analysis",
    label: "Step 1",
    title: "AI Skin Analysis",
    accent: "Map + Summary",
    blurb:
      "Let's you see how affected your skin looks in the image you provided and gives you a skin map.",
    bullets: [
      "Shows targetted problem like texture, redness or pore visibility etc",
      "A brief summary of the active issues highlighting probable lifestyle triggers like stress & sleep",
      "Barrier health patterns",
    ],
    tag: "Insight Layer",
  },
  {
    id: "routine",
    label: "Step 2",
    title: "Smart Routine Builder",
    accent: "AM & PM Routines",
    blurb:
      "Tap one button to generate a full skincare routine with frequency hints, order of application, and patch-test reminders.",
    bullets: [
      "AM: cleanse, protect, shield (SPF)",
      "PM: reset, repair, treat",
      "Gentle frequency & patch-test warnings",
    ],
    tag: "Routine Engine",
  },
  {
    id: "products",
    label: "Step 3",
    title: "Product Matchmaker",
    accent: "Real Products, Real Shelves",
    blurb:
      "We match your skin profile to real products from Sephora, Ulta-style catalogs, and ingredient databases.",
    bullets: [
      "Non-comedogenic matches for your skin type",
      "Ingredient-level compatibility",
      "Short, honest reasons for each pick",
    ],
    tag: "Recommender",
  },
  {
    id: "stores",
    label: "Step 4",
    title: "Where to Buy",
    accent: "Closest locations",
    blurb:
      "See nearby stores that carry your recommended products, or choose online delivery instead.",
    bullets: [
      "See closest store for each product",
      "Link out to directions",
      "Option for online vs in-store",
    ],
    tag: "Location Layer",
  },
];

/* =======================
   AUTH SCREEN (FRONTEND ONLY)
   ======================= */

const AuthScreen = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // FRONTEND ONLY: later we’ll hook this to the backend auth routes.
    onAuthSuccess({
      name: name || "SkinSense user",
      email,
    });
  };

  return (
    <div className="auth-app">
      <div className="auth-shell">
        {/* Left intro side */}
        <div className="auth-intro">
          <div className="auth-logo-pill">SkinSense AI</div>
          <h1 className="auth-title">
            Personalized skincare, powered by vision AI.
          </h1>
          <p className="auth-subtitle">
            Log in or create a demo account to try the full flow: from selfie to
            skin insights, routine, products, and where to buy.
          </p>
          <ul className="auth-bullets">
            <li>No real data stored – hackathon demo only</li>
            <li>Safe, non-medical language</li>
            <li>Price-aware product suggestions</li>
          </ul>
        </div>

        {/* Right login card */}
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "auth-tab-active" : ""}`}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-tab ${
                mode === "signup" ? "auth-tab-active" : ""
              }`}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="auth-field">
                <label htmlFor="auth-name">Name</label>
                <input
                  id="auth-name"
                  className="auth-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {mode === "signup" && (
              <div className="auth-field">
                <label htmlFor="auth-confirm">Confirm password</label>
                <input
                  id="auth-confirm"
                  className="auth-input"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit">
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="auth-footnote">
            Demo-only: this doesn’t create a real account yet. We’ll wire it to
            the backend later.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =======================
   MAIN APP (AFTER LOGIN)
   ======================= */

const LIKERT_OPTIONS = [
  "Not at all",
  "Unlikely",
  "Somewhat",
  "Likely",
  "Definitely",
];

const LikertQuestion = ({ label, value, onChange }) => {
  return (
    <div className="likert-question">
      <p className="likert-label">{label}</p>
      <div className="likert-scale">
        {LIKERT_OPTIONS.map((opt, index) => (
          <button
            key={opt}
            type="button"
            className={
              "likert-option" +
              (value === index ? " likert-option-selected" : "")
            }
            onClick={() => onChange(index)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const MainApp = () => {
  const [activeSection, setActiveSection] = useState("landing");
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false);

  const sectionRefs = useRef({});
  const fileInputRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);


  const [userFilters, setUserFilters] = useState({
    gender: "",
    ageRange: "",
    oily: null, // 0–4 Likert
    dry: null, // 0–4 Likert
    intensity: null, // 0–4 Likert
  });

  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [hasUserInfo, setHasUserInfo] = useState(false);

  const canStartFlow = hasUploadedImage && hasUserInfo;

  // observe sections for active nav highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-id");
          if (id) setActiveSection(id);
        }
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasGeneratedPlan]); // re-run when new sections appear

  const handleScrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // dropdowns (gender, age)
  const handleSelectChange = (field) => (e) => {
    const value = e.target.value;
    setUserFilters((prev) => {
      const next = { ...prev, [field]: value };
      const filled =
        next.gender &&
        next.ageRange &&
        next.oily !== null &&
        next.dry !== null &&
        next.intensity !== null;
      setHasUserInfo(Boolean(filled));
      return next;
    });
  };

  // likert scale (oily / dry / intensity)
  const handleLikertChange = (field, value) => {
    setUserFilters((prev) => {
      const next = { ...prev, [field]: value };
      const filled =
        next.gender &&
        next.ageRange &&
        next.oily !== null &&
        next.dry !== null &&
        next.intensity !== null;
      setHasUserInfo(Boolean(filled));
      return next;
    });
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setHasUploadedImage(true);
    }
  };

  // const handleGeneratePlan = () => {
  //   if (!canStartFlow) return;
  //   setHasGeneratedPlan(true);
  //   // scroll to Step 1 (analysis)
  //   setTimeout(() => {
  //     handleScrollTo("analysis");
  //   }, 50);
  // };

  const handleGeneratePlan = () => {
  if (!canStartFlow || isGenerating) return;

  setIsGenerating(true);

  // Fake loading delay (so spinner is visible)
  setTimeout(() => {
    setHasGeneratedPlan(true);
    setIsGenerating(false);

    setTimeout(() => {
      handleScrollTo("analysis");
    }, 60);
  }, 1200);
};


  return (
    <div className="app">
      {/* Top Navigation */}
      <header className="top-nav">
        <div className="brand" onClick={() => handleScrollTo("landing")}>
          <span className="brand-mark">◎</span>
          <span className="brand-text">
            SkinSense<span className="brand-ai">AI</span>
          </span>
        </div>

        <nav className="nav-links">
          {hasGeneratedPlan &&
            SECTIONS.map((section) => (
              <button
                key={section.id}
                className={
                  "nav-link" +
                  (activeSection === section.id ? " nav-link-active" : "")
                }
                onClick={() => handleScrollTo(section.id)}
              >
                {section.label}
              </button>
            ))}
        </nav>
      </header>

      {/* Scrollable main content */}
      <main className="scroll-container">
        {/* =======================
            LANDING HERO (FULLSCREEN)
            ======================= */}
        <section
          className="section landing"
          data-id="landing"
          ref={(el) => (sectionRefs.current["landing"] = el)}
        >
          <div className="landing-inner">
            
            <img
              src="/logo.png"
              alt="SkinSense Logo"
              className="landing-logo"
            />
            <h1 className="landing-tag">Meet SkinSense</h1>
            <h1 className="landing-title">  
            </h1>
            <p className="landing-subtitle">
            Your personal AI skin expert that knows what your skin needs before you do.
            </p>

            <ul className="landing-points">
              <li>Upload a selfie and get a quick analysis of your skin</li>
              <li>See your AI skin map &amp; with a summary</li>
              <li>Get AM/PM routines, products, and nearby stores</li>
            </ul>
          </div>
        </section>

        {/* =======================
            CAPTURE + USER INPUT SECTION
            ======================= */}
        <section
          className="section hero"
          data-id="capture"
          ref={(el) => (sectionRefs.current["capture"] = el)}
        >
          <div className="section-inner hero-layout">
            <div className="section-text hero-main">
              <p className="floating-label floating-label-large">
                Capture &amp; Profile
              </p>
              <h1 className="hero-title">
                SkinSense <span className="hero-highlight">AI</span>
              </h1>
              <p className="hero-subtitle">
                Add a clear photo and a few quick details. We’ll use this to
                build your personalized skin care plan.
              </p>

              <div className="capture-block">
                {/* Image / camera input */}
                <div className="capture-row">
                  <button
                    type="button"
                    className="primary-btn capture-btn"
                    onClick={handleUploadClick}
                  >
                    📸 Upload or capture a photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <p className="capture-status">
                    {hasUploadedImage
                      ? "Image added ✔"
                      : "No image yet — add a clear photo of your face."}
                  </p>
                </div>

                {/* User filters form */}
                <div className="user-form">
                  <p className="form-caption">
                    Tell us a bit more so we can personalize your routine:
                  </p>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        value={userFilters.gender}
                        onChange={handleSelectChange("gender")}
                      >
                        <option value="">Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="nonbinary">Non-binary</option>
                        <option value="prefer-not">
                          Prefer not to say
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="ageRange">Age</label>
                      <select
                        id="ageRange"
                        value={userFilters.ageRange}
                        onChange={handleSelectChange("ageRange")}
                      >
                        <option value="">Select age range</option>
                        <option value="under18">Under 18</option>
                        <option value="18-24">18–24</option>
                        <option value="25-34">25–34</option>
                        <option value="35-44">35–44</option>
                        <option value="45plus">45+</option>
                      </select>
                    </div>

                    {/* Likert scales span full width */}
                    <div className="likert-group">
                      <LikertQuestion
                        label="Do you consider your skin to be oily?"
                        value={userFilters.oily}
                        onChange={(val) => handleLikertChange("oily", val)}
                      />
                      <LikertQuestion
                        label="Do you consider your skin to be dry?"
                        value={userFilters.dry}
                        onChange={(val) => handleLikertChange("dry", val)}
                      />
                      <LikertQuestion
                        label="Would you describe the intensity of your skincare as intensive?"
                        value={userFilters.intensity}
                        onChange={(val) =>
                          handleLikertChange("intensity", val)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Generate plan button */}
                <button
                  type="button"
                  className={
                    "generate-btn" +
                    (canStartFlow ? " generate-btn-active" : "")
                  }
                  disabled={!canStartFlow}
                  onClick={handleGeneratePlan}
                >
                  Generate My Personalized Skin Care Routine
                </button>

                {isGenerating && (
                  <div className="generate-spinner-wrap">
                    <div className="circle-spinner" />
                    <p className="spinner-label">Preparing your results…</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =======================
            GENERATED FLOW SECTIONS
            ======================= */}
        {hasGeneratedPlan &&
          SECTIONS.map((section) => (
            <section
              key={section.id}
              className={
                "section feature" +
                (activeSection === section.id ? " section-active" : "")
              }
              data-id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
            >
              <div className="section-inner">
                {/* Left: text */}
                <div className="section-text">
                  <p className="floating-label">
                    {section.label} · {section.tag}
                  </p>
                  <h2 className="section-title">{section.title}</h2>

                  {section.accent && (
                    <div className="section-accent-pill">{section.accent}</div>
                  )}
                  <p className="section-blurb">{section.blurb}</p>

                  <ul className="bullet-list">
                    {section.bullets.map((item) => (
                      <li key={item} className="bullet-item">
                        <span className="bullet-dot" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: visuals per section */}
                <div className="section-visual">
                  {section.id === "analysis" && (
                    <div className="viz-card">
                      <h3 className="viz-title">Skin Map</h3>
                      <div className="viz-bars">
                        <div className="viz-bar">
                          <span>Acne</span>
                          <div className="viz-bar-fill" />
                        </div>
                        <div className="viz-bar">
                          <span>Redness</span>
                          <div className="viz-bar-fill" />
                        </div>
                        <div className="viz-bar">
                          <span>Oiliness</span>
                          <div className="viz-bar-fill" />
                        </div>
                        <div className="viz-bar">
                          <span>Dryness</span>
                          <div className="viz-bar-fill" />
                        </div>
                      </div>

                      <div className="viz-divider" />

                      <h3 className="viz-title">Skin Summary</h3>
                      <p className="viz-paragraph">
                        “Your skin appears moderately oily with mild
                        inflammation around the cheeks. Stress and low sleep
                        might be contributing to congestion.”
                      </p>
                      <div className="viz-tags-row">
                        <span>⚡ Stress</span>
                        <span>💤 Sleep</span>
                        <span>🩹 Barrier support</span>
                      </div>
                    </div>
                  )}

                  {section.id === "routine" && (
                    <div className="viz-card two-col">
                      <div>
                        <h3 className="viz-title">AM Routine</h3>
                        <ol className="routine-list">
                          <li>Gentle gel cleanser</li>
                          <li>Antioxidant serum</li>
                          <li>Oil-free moisturizer</li>
                          <li>SPF 30+ sunscreen</li>
                        </ol>
                      </div>
                      <div>
                        <h3 className="viz-title">PM Routine</h3>
                        <ol className="routine-list">
                          <li>Oil-based cleanse</li>
                          <li>Water-based cleanse</li>
                          <li>Niacinamide serum</li>
                          <li>Barrier repair cream</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {section.id === "products" && (
                    <div className="viz-card product-results-card">
                      <h3 className="viz-title">Matched Products</h3>

                      <div className="product-grid">
                        <div className="product-card">
                          <div className="product-image">
                            <div className="product-thumb product-thumb-1" />
                          </div>
                          <div className="product-meta">
                            <p className="product-name">
                              CeraVe Foaming Facial Cleanser
                            </p>
                            <p className="product-detail">
                              For oily / combo skin · niacinamide, ceramides,
                              non-comedogenic.
                            </p>
                            <div className="product-store-row">
                              <span>Walmart</span>
                              <span className="product-price">$13.97</span>
                            </div>
                            <div className="product-store-row">
                              <span>Amazon.ca</span>
                              <span className="product-price">$15.49</span>
                            </div>
                            <span className="product-tag">
                              Best price: Walmart
                            </span>
                          </div>
                        </div>

                        <div className="product-card">
                          <div className="product-image">
                            <div className="product-thumb product-thumb-2" />
                          </div>
                          <div className="product-meta">
                            <p className="product-name">
                              La Roche-Posay Toleriane Sensitive Cream
                            </p>
                            <p className="product-detail">
                              For redness &amp; barrier repair · minimalist
                              formula, fragrance-free.
                            </p>
                            <div className="product-store-row">
                              <span>Shoppers Drug Mart</span>
                              <span className="product-price">$28.99</span>
                            </div>
                            <div className="product-store-row">
                              <span>Sephora</span>
                              <span className="product-price">$27.00</span>
                            </div>
                            <span className="product-tag product-tag-alt">
                              Best match: Sensitive skin
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="search-note">
                        *In the full version, these cards would be auto-filled
                        from live web scraping / retail APIs.
                      </p>
                    </div>
                  )}

                  {section.id === "stores" && (
                    <div className="viz-card">
                      <h3 className="viz-title">Nearby Availability</h3>
                      <div className="map-placeholder">
                        <div className="map-pin">📍</div>
                        <p className="map-caption">
                          Show closest stores with your cleanser, moisturizer,
                          and sunscreen in stock.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
      </main>
    </div>
  );
};

/* =======================
   ROOT APP – SWITCHES AUTH → MAIN
   ======================= */

const App = () => {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthScreen onAuthSuccess={(u) => setUser(u)} />;
  }

  return <MainApp />;
};

export default App;
