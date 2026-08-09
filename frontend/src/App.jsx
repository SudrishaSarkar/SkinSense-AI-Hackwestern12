// frontend/src/App.jsx

import React, { useEffect, useRef, useState } from "react";
import WebcamCapture from "./components/WebcamCapture"; // Import WebcamCapture

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
  const [isLoading, setIsLoading] = useState(false);

  // Load users from JSON file or localStorage
  const loadUsers = async () => {
    try {
      // First try localStorage
      const localUsers = localStorage.getItem('skinsense_users');
      if (localUsers) {
        const data = JSON.parse(localUsers);
        return data.users || [];
      }
      
      // Fallback to JSON file
      const response = await fetch('/users.json');
      const data = await response.json();
      return data.users || [];
    } catch (err) {
      console.error('Error loading users:', err);
      return [];
    }
  };

  // Save users to JSON file (simulate by updating local storage)
  const saveUsers = async (users) => {
    try {
      // In a real app, this would be a backend API call
      // For now, we'll use localStorage to persist users
      localStorage.setItem('skinsense_users', JSON.stringify({ users }));
      return true;
    } catch (err) {
      console.error('Error saving users:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const users = await loadUsers();

      if (mode === "login") {
        // Check if user exists and password matches
        const user = users.find(u => u.email === email);
        
        if (!user) {
          setError("Username/Password Invalid. Sign up to create a new account");
          setIsLoading(false);
          return;
        }

        if (user.password !== password) {
          setError("Username/Password Invalid. Sign up to create a new account");
          setIsLoading(false);
          return;
        }

        // Login successful
        onAuthSuccess({
          name: user.name,
          email: user.email,
        });

      } else {
        // Signup mode
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          setError("An account with this email already exists. Please log in.");
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser = {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password, // In a real app, this would be hashed
          createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        const saved = await saveUsers(updatedUsers);

        if (!saved) {
          setError("Failed to create account. Please try again.");
          setIsLoading(false);
          return;
        }

        // Auto-login after successful signup
        onAuthSuccess({
          name: newUser.name,
          email: newUser.email,
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
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
              className={`auth-tab ${
                mode === "login" ? "auth-tab-active" : ""
              }`}
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

            {error && <p className="auth-error" style={{ color: '#e74c3c', fontWeight: '600' }}>{error}</p>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span>
                  <span className="auth-spinner">|</span>
                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </span>
              ) : (
                mode === "login" ? "Log in" : "Create account"
              )}
            </button>
          </form>
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
  const sectionRefs = useRef({});
  const fileInputRef = useRef(null);

  // State for generation flow
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for image handling
  const [imageData, setImageData] = useState(null);
  const [imageConfirmed, setImageConfirmed] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [lastCaptureMethod, setLastCaptureMethod] = useState(null);

  // Add state to store results from the backend
  const [analysisResult, setAnalysisResult] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);

  const [userFilters, setUserFilters] = useState({
    gender: "",
    ageRange: "",
    oily: null, // 0–4 Likert
    dry: null, // 0–4 Likert
    intensity: null, // 0–4 Likert
  });

  const [hasUserInfo, setHasUserInfo] = useState(false);

  const canStartFlow = imageConfirmed && hasUserInfo;

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

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageConfirmed(false); // Reset confirmation if a new image is chosen
      setLastCaptureMethod("upload"); // Set capture method
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebcamCapture = (dataUrl) => {
    setImageConfirmed(false);
    setLastCaptureMethod("webcam");
    setImageData(dataUrl);
    setIsWebcamActive(false); // Hide webcam once image is captured
  };

  const handleWebcamCancel = () => {
    setIsWebcamActive(false); // Hide webcam if user cancels
  };

  const handleRetake = () => {
    setImageData(null);
    setImageConfirmed(false);
    // If the last action was taking a webcam photo, re-open the webcam.
    // Otherwise, trigger the file upload dialog.
    if (lastCaptureMethod === "webcam") {
      setIsWebcamActive(true);
    } else {
      handleUploadClick();
    }
  };

  const handleUseThis = () => {
    if (imageData) {
      setImageConfirmed(true);
      // Check if user info is already filled to enable the scan button
      const { gender, ageRange, oily, dry, intensity } = userFilters;
      const filled =
        gender &&
        ageRange &&
        oily !== null &&
        dry !== null &&
        intensity !== null;
      setHasUserInfo(Boolean(filled));
    }
  };

  //   const handleGeneratePlan = () => {
  //   if (!canStartFlow || isGenerating) return;

  //   setIsGenerating(true);

  //   // Fake loading delay (so spinner is visible)
  //   setTimeout(() => {
  //     setHasGeneratedPlan(true);
  //     setIsGenerating(false);

  //     setTimeout(() => {
  //       handleScrollTo("analysis");
  //     }, 60);
  //   }, 1200);
  // };

  // // 3. Update handleGeneratePlan to send the image to the backend
  // const handleGeneratePlan = async () => {
  //   if (!canStartFlow || isGenerating) return;

  //   setIsGenerating(true);

  //   try {
  //     // The URL should match your backend server and endpoint
  //     const response = await fetch("http://localhost:5000/api/analyze", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ image: imageData, filters: userFilters }), // Send image and filters
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const results = await response.json();
  //     setAnalysisResult(results); // Save the analysis results
  //     console.log("Backend Analysis Results:", results);

  //     // Once we have results, show the next sections
  //     setHasGeneratedPlan(true);

  //     // Scroll to the analysis section
  //     setTimeout(() => handleScrollTo("analysis"), 100);
  //   } catch (error) {
  //     console.error("Failed to get analysis from backend:", error);
  //     // You could show an error message to the user here
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // Function to calculate intelligent percentage based on image analysis + user input
  const calculatePercentage = (analysisLevel, userInput, metric) => {
    // If backend has analysis, use it
    if (analysisLevel && analysisLevel !== "none") {
      return analysisLevel === "mild" ? 25 : analysisLevel === "moderate" ? 50 : analysisLevel === "severe" ? 75 : 0;
    }
    
    // If no backend analysis, use user input as fallback
    if (userInput !== null && userInput !== undefined) {
      // Convert Likert scale (0-4) to percentage (0-75)
      return (userInput / 4) * 75;
    }
    
    return 0;
  };

  // Function to generate product image URLs using Google Images API
  const getProductImageUrl = (productName, brand) => {
    // Check if we have a Google Images API key
    const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_CLIENT_ID';
    
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_CLIENT_ID') {
      // Use Google Images API for reliable product images
      const searchQuery = encodeURIComponent(`${productName} ${brand} skincare product`);
      return `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&query=${searchQuery}&orientation=landscape&w=120&h=90&fit=crop&auto=format`;
    }
    
    // Fallback to branded placeholder if no API key
    const brandColors = {
      'CeraVe': '#4A90E2',
      'La Roche-Posay': '#E74C3C',
      'Neutrogena': '#F39C12',
      'The Ordinary': '#9B59B6',
      'Vanicream': '#27AE60',
      'Cetaphil': '#E67E22',
      'Aveeno': '#3498DB',
      'Dove': '#95A5A6'
    };

    const bgColor = brandColors[brand] || '#95A5A6';
    
    // Create a data URL for a simple branded placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="90" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="90" fill="${bgColor}"/>
        <text x="60" y="45" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
          ${brand || 'Product'}
        </text>
      </svg>
    `)}`;
  };

  const handleGeneratePlan = async () => {
    if (!canStartFlow || isGenerating) return;

    setIsGenerating(true);
    setApiError(null); // Clear previous errors

    try {
      // Extract base64 data from the data URL
      const base64Data = imageData.split(',')[1]; // Remove the data:image/jpeg;base64, part
      const mimeType = imageData.split(':')[1].split(';')[0]; // Extract mime type

      // Call the comprehensive recommendation bundle endpoint with correct structure
      const payload = {
        imageBase64: base64Data, // Send only the base64 data, not the full data URL
        mimeType: mimeType, // Send the mime type separately
        lifestyle: {
          cycle_phase: "unknown", // Default since we don't have cycle tracking
          sleep_hours: 7,
          hydration_cups: 6,
          stress_level: 3,
          mood: 3,
        },
      };

      const response = await fetch(
        "http://localhost:8787/api/recommendation-bundle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed. Please try again.");
      }

      const result = await response.json();

      // Store the comprehensive response
      setApiData(result); // This now contains recommended_products, price_comparisons, routine, etc.
      setAnalysisResult(result.skin_profile?.skin_analysis); // Keep for legacy compatibility
      setHasGeneratedPlan(true);

      // Scroll to results
      setTimeout(() => {
        handleScrollTo("analysis");
      }, 100);
    } catch (error) {
      console.error("Error generating plan:", error);
      const errorMessage =
        error.message || "Failed to generate skincare plan. Please try again.";
      setApiError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
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
            <h1 className="landing-title"></h1>
            <p className="landing-subtitle">
              Your personal AI skin expert that knows what your skin needs
              before you do.
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
          {/* Initial state: Only title and upload section */}
          {!imageData && !isWebcamActive && (
            <div className="capture-initial-layout">
              <div className="capture-initial-content">
                <h1 className="hero-title">
                  SkinSense <span className="hero-highlight">AI</span>
                </h1>
                <p className="hero-subtitle">
                  Add a clear photo and a few quick details. We'll use this to
                  build your personalized skin care plan.
                </p>

                <div className="capture-actions">
                  <button
                    type="button"
                    className="primary-btn capture-btn"
                    onClick={handleUploadClick}
                  >
                    Upload a Photo
                  </button>
                  <button
                    type="button"
                    className="secondary-btn capture-btn"
                    onClick={() => setIsWebcamActive(true)}
                  >
                    Take a Live Picture
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Webcam view in initial layout */}
          {!imageData && isWebcamActive && (
            <div className="capture-initial-layout">
              <div className="capture-initial-content">
                <h1 className="hero-title">
                  SkinSense <span className="hero-highlight">AI</span>
                </h1>
                <p className="hero-subtitle">
                  Position your face in the camera and capture your photo.
                </p>
                
                <div className="webcam-capture-panel">
                  <WebcamCapture
                    onCapture={handleWebcamCapture}
                    onCancel={handleWebcamCancel}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side layout after image upload */}
          {imageData && (
            <div className="section-inner hero-layout">
              {/* Left side: Title, user input, and controls */}
              <div className="section-text hero-main">
                <p className="floating-label floating-label-large">
                  Capture &amp; Profile
                </p>
                <h1 className="hero-title">
                  SkinSense <span className="hero-highlight">AI</span>
                </h1>
                <p className="hero-subtitle">
                  Add a clear photo and a few quick details. We'll use this to
                  build your personalized skin care plan.
                </p>

                {/* User input form */}
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
                        <option value="prefer-not">Prefer not to say</option>
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
                        onChange={(val) => handleLikertChange("intensity", val)}
                      />
                    </div>
                  </div>
                </div>

                {/* "Start Scan" button appears only after image is confirmed and form is filled */}
                {imageConfirmed && (
                  <button
                    type="button"
                    className={
                      "generate-btn" +
                      (canStartFlow ? " generate-btn-active" : "")
                    }
                    disabled={!canStartFlow || isGenerating}
                    onClick={handleGeneratePlan}
                  >
                    {canStartFlow
                      ? "Start Scan"
                      : "Please fill out your profile"}
                  </button>
                )}
                {apiError && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      background: "#fee",
                      color: "#c33",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    {apiError}
                  </div>
                )}
                {isGenerating && (
                  <div className="generate-spinner-wrap">
                    <div className="circle-spinner" />
                    <p className="spinner-label">Preparing your results…</p>
                  </div>
                )}
              </div>

              {/* Right side: Image preview */}
              <div className="section-visual">
                <div className="viz-card">
                  <h3 className="viz-title">Your Photo</h3>
                  {isWebcamActive ? (
                    <WebcamCapture
                      onCapture={handleWebcamCapture}
                      onCancel={handleWebcamCancel}
                    />
                  ) : (
                    <div className="image-preview-box">
                      <img
                        src={imageData}
                        alt="Selected skin"
                        className="preview-image"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          height: "auto",
                          width: "auto",
                        }}
                      />
                      {!imageConfirmed && (
                        <div className="preview-actions">
                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={handleRetake}
                          >
                            Retake
                          </button>
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={handleUseThis}
                          >
                            Use This!
                          </button>
                        </div>
                      )}
                      {imageConfirmed && (
                        <div className="preview-confirmed-badge">
                          Image Confirmed
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =======================
            GENERATED FLOW SECTIONS
            ======================= */}
        {hasGeneratedPlan &&
          SECTIONS.map((section, index) => (
            <React.Fragment key={section.id}>
              <section
                className={
                  "section feature" +
                  (activeSection === section.id ? " section-active" : "")
                }
                data-id={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
              >
                {/* Add dotted line connector except for first section */}
                {index > 0 && <div className="step-connector" />}
                
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
                          <div className="viz-bar-container">
                            <div
                              className="viz-bar-fill"
                              style={{ 
                                width: `${calculatePercentage(
                                  apiData?.skin_profile?.skin_analysis?.acne, 
                                  userFilters.oily, 
                                  'acne'
                                )}%` || '0%' 
                              }}
                            />
                            <span className="viz-bar-percentage">
                              {calculatePercentage(
                                apiData?.skin_profile?.skin_analysis?.acne, 
                                userFilters.oily, 
                                'acne'
                              )}%
                            </span>
                          </div>
                        </div>
                        <div className="viz-bar">
                          <span>Redness</span>
                          <div className="viz-bar-container">
                            <div
                              className="viz-bar-fill"
                              style={{ 
                                width: `${calculatePercentage(
                                  apiData?.skin_profile?.skin_analysis?.redness, 
                                  userFilters.intensity, 
                                  'redness'
                                )}%` || '0%' 
                              }}
                            />
                            <span className="viz-bar-percentage">
                              {calculatePercentage(
                                apiData?.skin_profile?.skin_analysis?.redness, 
                                userFilters.intensity, 
                                'redness'
                              )}%
                            </span>
                          </div>
                        </div>
                        <div className="viz-bar">
                          <span>Oiliness</span>
                          <div className="viz-bar-container">
                            <div
                              className="viz-bar-fill"
                              style={{ 
                                width: `${calculatePercentage(
                                  apiData?.skin_profile?.skin_analysis?.oiliness, 
                                  userFilters.oily, 
                                  'oiliness'
                                )}%` || '0%' 
                              }}
                            />
                            <span className="viz-bar-percentage">
                              {calculatePercentage(
                                apiData?.skin_profile?.skin_analysis?.oiliness, 
                                userFilters.oily, 
                                'oiliness'
                              )}%
                            </span>
                          </div>
                        </div>
                        <div className="viz-bar">
                          <span>Dryness</span>
                          <div className="viz-bar-container">
                            <div
                              className="viz-bar-fill"
                              style={{ 
                                width: `${calculatePercentage(
                                  apiData?.skin_profile?.skin_analysis?.dryness, 
                                  userFilters.dry, 
                                  'dryness'
                                )}%` || '0%' 
                              }}
                            />
                            <span className="viz-bar-percentage">
                              {calculatePercentage(
                                apiData?.skin_profile?.skin_analysis?.dryness, 
                                userFilters.dry, 
                                'dryness'
                              )}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="viz-divider" />

                      <h3 className="viz-title">Skin Summary</h3>
                      <p className="viz-paragraph">
                        {apiData?.skin_profile?.skin_analysis?.non_medical_summary ||
                          "Your skin appears moderately oily with mild inflammation around the cheeks. Stress and low sleep might be contributing to congestion."}
                      </p>
                      <div className="viz-tags-row">
                        {apiData?.skin_profile?.skin_analysis?.probable_triggers
                          ?.slice(0, 3)
                          .map((trigger, idx) => (
                            <span key={idx}>{trigger}</span>
                          )) || (
                          <>
                            <span>Stress</span>
                            <span>Sleep</span>
                            <span>Barrier support</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {section.id === "routine" && (
                    <div className="viz-card two-col">
                      <div>
                        <h3 className="viz-title">AM Routine</h3>
                        <ol className="routine-list">
                          {apiData?.routine?.steps
                            ?.filter(
                              (step) =>
                                step.time === "AM" || step.time === "AM_PM"
                            )
                            .map((step, idx) => (
                              <li key={idx}>
                                <strong>{step.step}:</strong> {step.description}
                              </li>
                            )) || (
                            <>
                              <li>Gentle gel cleanser</li>
                              <li>Antioxidant serum</li>
                              <li>Oil-free moisturizer</li>
                              <li>SPF 30+ sunscreen</li>
                            </>
                          )}
                        </ol>
                        {apiData?.routine?.notes && (
                          <p
                            className="routine-notes"
                            style={{
                              marginTop: "1rem",
                              fontStyle: "italic",
                              color: "#666",
                            }}
                          >
                            {apiData.routine.notes}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="viz-title">PM Routine</h3>
                        <ol className="routine-list">
                          {apiData?.routine?.steps
                            ?.filter(
                              (step) =>
                                step.time === "PM" || step.time === "AM_PM"
                            )
                            .map((step, idx) => (
                              <li key={idx}>
                                <strong>{step.step}:</strong> {step.description}
                              </li>
                            )) || (
                            <>
                              <li>Oil-based cleanse</li>
                              <li>Water-based cleanse</li>
                              <li>Niacinamide serum</li>
                              <li>Barrier repair cream</li>
                            </>
                          )}
                        </ol>
                      </div>
                    </div>
                  )}

                  {section.id === "products" && (
                    <div className="viz-card product-results-card">
                      <h3 className="viz-title">Matched Products</h3>

                      <div className="product-grid">
                        {apiData?.recommended_products &&
                        Array.isArray(apiData.recommended_products) &&
                        apiData.recommended_products.length > 0 ? (
                          apiData.recommended_products
                            .slice(0, 6)
                            .map((product, idx) => {
                              const priceData =
                                apiData?.price_comparisons?.find(
                                  (pc) => pc.product_name === product.name
                                );
                              const cheapestPrice = priceData?.prices
                                ?.filter((p) => p.price !== null)
                                ?.sort(
                                  (a, b) =>
                                    (a.price ?? Infinity) -
                                    (b.price ?? Infinity)
                                )[0];

                              return (
                                <div
                                  key={product.id || idx}
                                  className="product-card"
                                >
                                  <div className="product-image">
                                    {product.image_url ? (
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={getProductImageUrl(product.name, product.brand)}
                                        alt={product.name}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                          // Fallback to branded placeholder if image fails
                                          e.target.src = `data:image/svg+xml;base64,${btoa(`
                                            <svg width="120" height="90" xmlns="http://www.w3.org/2000/svg">
                                              <rect width="120" height="90" fill="#95A5A6"/>
                                              <text x="60" y="45" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
                                                ${product.brand || 'Product'}
                                              </text>
                                            </svg>
                                          `)}`;
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div className="product-meta">
                                    <p className="product-name">
                                      {product.name || "Product"}
                                    </p>
                                    <p className="product-detail">
                                      {product.brand && `${product.brand} · `}
                                      {product.category &&
                                        `${product.category} · `}
                                      {product.key_ingredients
                                        ?.slice(0, 3)
                                        .join(", ")}
                                    </p>
                                    {product.recommendation_reason && (
                                      <p
                                        className="product-reason"
                                        style={{
                                          fontSize: "0.9rem",
                                          color: "#666",
                                          marginTop: "0.5rem",
                                        }}
                                      >
                                        {product.recommendation_reason}
                                      </p>
                                    )}
                                    {product.price_estimate && (
                                      <p
                                        className="product-price"
                                        style={{
                                          marginTop: "0.5rem",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ${product.price_estimate.toFixed(2)} CAD
                                      </p>
                                    )}
                                    {priceData?.prices
                                      ?.filter((p) => p.price !== null)
                                      .map((storePrice, spIdx) => (
                                        <div
                                          key={spIdx}
                                          className="product-store-row"
                                        >
                                          <span>{storePrice.store}</span>
                                          <span className="product-price">
                                            ${storePrice.price?.toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    {cheapestPrice && (
                                      <span className="product-tag">
                                        Best price: {cheapestPrice.store}
                                      </span>
                                    )}
                                    <div className="product-actions">
                                      <button 
                                        className="product-link-btn"
                                        onClick={() => window.open(product.url || `https://www.google.com/search?q=${encodeURIComponent(product.name + ' ' + product.brand + ' buy')}`, '_blank')}
                                      >
                                        View Product
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <>
                            <div className="product-card">
                              <div className="product-image">
                                <img
                                  src={getProductImageUrl('CeraVe Foaming Facial Cleanser', 'CeraVe')}
                                  alt="CeraVe Foaming Facial Cleanser"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                                      <svg width="120" height="90" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="120" height="90" fill="#4A90E2"/>
                                        <text x="60" y="45" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
                                          CeraVe
                                        </text>
                                      </svg>
                                    `)}`;
                                  }}
                                />
                              </div>
                              <div className="product-meta">
                                <p className="product-name">
                                  CeraVe Foaming Facial Cleanser
                                </p>
                                <p className="product-detail">
                                  For oily / combo skin · niacinamide,
                                  ceramides, non-comedogenic.
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
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {section.id === "stores" && (
                    <div className="viz-card">
                      <h3 className="viz-title">Nearby Availability</h3>
                      <div className="store-locations">
                        {apiData?.recommended_products?.slice(0, 3).map((product, idx) => {
                          const priceData = apiData?.price_comparisons?.find(
                            (pc) => pc.product_name === product.name
                          );
                          return (
                            <div key={idx} className="store-location-item">
                              <h4 className="store-product-name">{product.name}</h4>
                              <div className="store-options">
                                {priceData?.prices?.filter(p => p.price !== null).map((store, storeIdx) => (
                                  <div key={storeIdx} className="store-option">
                                    <div className="store-info">
                                      <span className="store-name">{store.store}</span>
                                      <span className="store-price">${store.price?.toFixed(2)}</span>
                                    </div>
                                    <div className="store-actions">
                                      <a 
                                        href={store.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="store-link"
                                      >
                                        Buy Online
                                      </a>
                                      <button 
                                        className="store-directions-btn"
                                        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(store.store + ' near me')}`, '_blank')}
                                      >
                                        Find Nearby
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }) || (
                          <div className="default-stores">
                            <div className="store-location-item">
                              <h4 className="store-product-name">CeraVe Foaming Cleanser</h4>
                              <div className="store-options">
                                <div className="store-option">
                                  <div className="store-info">
                                    <span className="store-name">Walmart</span>
                                    <span className="store-price">$13.97</span>
                                  </div>
                                  <div className="store-actions">
                                    <a href="https://www.walmart.ca/en/cerave-foaming-facial-cleanser/NOC00581578" target="_blank" rel="noopener noreferrer" className="store-link">
                                      Buy Online
                                    </a>
                                    <button 
                                      className="store-directions-btn"
                                      onClick={() => window.open('https://www.google.com/maps/search/Walmart near me', '_blank')}
                                    >
                                      Find Nearby
                                    </button>
                                  </div>
                                </div>
                                <div className="store-option">
                                  <div className="store-info">
                                    <span className="store-name">Shoppers Drug Mart</span>
                                    <span className="store-price">$18.99</span>
                                  </div>
                                  <div className="store-actions">
                                    <a href="https://www1.shoppersdrugmart.ca/en/cerave-foaming-facial-cleanser/p/300016999" target="_blank" rel="noopener noreferrer" className="store-link">
                                      Buy Online
                                    </a>
                                    <button 
                                      className="store-directions-btn"
                                      onClick={() => window.open('https://www.google.com/maps/search/Shoppers Drug Mart near me', '_blank')}
                                    >
                                      Find Nearby
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            </React.Fragment>
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
