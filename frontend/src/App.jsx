// // // // // import React, { useState } from "react";
// // // // // import Navbar from "./components/Navbar";
// // // // // import StepSidebar from "./components/StepSidebar";
// // // // // import Hero from "./components/Hero";
// // // // // import ImageInputSection from "./components/ImageInputSection";
// // // // // import LifestyleFormSection from "./components/LifestyleFormSection";
// // // // // import SummarySection from "./components/SummarySection";
// // // // // import RoutineSection from "./components/RoutineSection";
// // // // // import ProductSection from "./components/ProductSection";
// // // // // import PriceComparisonSection from "./components/PriceComparisonSection";

// // // // // import { mockAnalysis } from "./data/mockAnalysis";
// // // // // import { mockRoutine } from "./data/mockRoutine";

// // // // // const defaultLifestyle = {
// // // // //   sleepHours: 6,
// // // // //   waterGlasses: 4,
// // // // //   stressLevel: "medium",
// // // // //   cyclePhase: "follicular",
// // // // //   pollutionExposure: "medium",
// // // // // };

// // // // // function App() {
// // // // //   const [imageDataUrl, setImageDataUrl] = useState(null);
// // // // //   const [lifestyle, setLifestyle] = useState(defaultLifestyle);
// // // // //   const [analysis, setAnalysis] = useState(null);
// // // // //   const [routine, setRoutine] = useState(null);

// // // // //   const handleAnalyze = () => {
// // // // //     const a = mockAnalysis(imageDataUrl, lifestyle);
// // // // //     setAnalysis(a);
// // // // //     setRoutine(null);
// // // // //     // you can later swap mockAnalysis with real API call
// // // // //   };

// // // // //   const handleGenerateRoutine = () => {
// // // // //     if (!analysis) return;
// // // // //     const r = mockRoutine(analysis, lifestyle);
// // // // //     setRoutine(r);
// // // // //   };

// // // // //   return (
// // // // //     <div className="min-h-screen bg-skinBg relative">
// // // // //       <Navbar />
// // // // //       <StepSidebar />
// // // // //       <main className="pt-28 pb-16 space-y-10">
// // // // //         <Hero />
// // // // //         <ImageInputSection
// // // // //           id="step-1"
// // // // //           imageDataUrl={imageDataUrl}
// // // // //           onImageChange={setImageDataUrl}
// // // // //           onAnalyze={handleAnalyze}
// // // // //         />
// // // // //         <LifestyleFormSection
// // // // //           id="step-2"
// // // // //           lifestyle={lifestyle}
// // // // //           onLifestyleChange={setLifestyle}
// // // // //         />
// // // // //         <SummarySection
// // // // //           id="step-3"
// // // // //           analysis={analysis}
// // // // //           lifestyle={lifestyle}
// // // // //         />
// // // // //         <RoutineSection
// // // // //           id="step-4"
// // // // //           analysis={analysis}
// // // // //           routine={routine}
// // // // //           onGenerateRoutine={handleGenerateRoutine}
// // // // //         />
// // // // //         <ProductSection id="step-5" analysis={analysis} />
// // // // //         <PriceComparisonSection id="step-6" />
// // // // //       </main>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;

// // // // // function App() {
// // // // //   return (
// // // // //     <div className="min-h-screen flex items-center justify-center bg-skinBg text-skinDeep">
// // // // //       <h1 className="text-3xl font-bold">If you see this, React works 🎉</h1>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;

// // // // import React, { useState } from "react";
// // // // import Navbar from "./components/Navbar";
// // // // import Hero from "./components/Hero";
// // // // // 🚫 Temporarily comment these out
// // // // import StepSidebar from "./components/StepSidebar";
// // // // // import ImageInputSection from "./components/ImageInputSection";
// // // // // import LifestyleFormSection from "./components/LifestyleFormSection";
// // // // // import SummarySection from "./components/SummarySection";
// // // // // import RoutineSection from "./components/RoutineSection";
// // // // // import ProductSection from "./components/ProductSection";
// // // // // import PriceComparisonSection from "./components/PriceComparisonSection";

// // // // // import { mockAnalysis } from "./data/mockAnalysis";
// // // // // import { mockRoutine } from "./data/mockRoutine";

// // // // function App() {
// // // //   return (
// // // //     <div className="min-h-screen bg-skinBg relative">
// // // //       <Navbar />
// // // //       <StepSidebar />
// // // //       <main className="pt-28 pb-16 space-y-10">
// // // //         <Hero />
// // // //         {/* all other sections are temporarily removed */}
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;

// // // import React, { useEffect, useRef, useState } from "react";

// // // const SECTIONS = [
// // //   {
// // //     id: "capture",
// // //     label: "Step 1",
// // //     title: "Capture Your Skin",
// // //     accent: "Webcam or Upload",
// // //     blurb:
// // //       "Start by snapping a selfie or uploading a clear photo of your face. No account, no fuss — just you and your skin.",
// // //     bullets: [
// // //       "Upload .jpg/.png from your gallery",
// // //       "Or capture live using your webcam",
// // //       "Auto-cropped face preview",
// // //     ],
// // //     tag: "Input Layer",
// // //   },
// // //   {
// // //     id: "analysis",
// // //     label: "Step 2",
// // //     title: "AI Skin Analysis",
// // //     accent: "Powered by Vision Models",
// // //     blurb:
// // //       "Behind the scenes, AI scans for acne, redness, oiliness, texture and barrier health — all described in safe, non-medical language.",
// // //     bullets: [
// // //       "Acne, redness, oiliness & dryness detection",
// // //       "Texture & pore visibility insights",
// // //       "Barrier health patterns (non-medical)",
// // //     ],
// // //     tag: "Computer Vision",
// // //   },
// // //   {
// // //     id: "summary",
// // //     label: "Step 3",
// // //     title: "Your Skin Story",
// // //     accent: "Clear, Human-Friendly Summary",
// // //     blurb:
// // //       "We turn raw analysis into a simple narrative: how your skin is doing today and what might be influencing it.",
// // //     bullets: [
// // //       "JSON-style internal summary",
// // //       "User-facing explanation in plain language",
// // //       "Highlights probable lifestyle triggers",
// // //     ],
// // //     tag: "Insight Layer",
// // //   },
// // //   {
// // //     id: "routine",
// // //     label: "Step 4",
// // //     title: "Smart Routine Builder",
// // //     accent: "AM & PM Routines",
// // //     blurb:
// // //       "Tap one button to generate a full skincare routine with frequency hints, order of application, and patch-test reminders.",
// // //     bullets: [
// // //       "AM: cleanse, protect, shield (SPF)",
// // //       "PM: reset, repair, treat",
// // //       "Gentle frequency & patch-test warnings",
// // //     ],
// // //     tag: "Routine Engine",
// // //   },
// // //   {
// // //     id: "products",
// // //     label: "Step 5",
// // //     title: "Product Matchmaker",
// // //     accent: "Real Products, Real Shelves",
// // //     blurb:
// // //       "We match your skin profile to real products from Sephora, Ulta-style catalogs, and ingredient databases.",
// // //     bullets: [
// // //       "Non-comedogenic matches for your skin type",
// // //       "Ingredient-level compatibility",
// // //       "Short, honest reasons for each pick",
// // //     ],
// // //     tag: "Recommender",
// // //   },
// // //   {
// // //     id: "filters",
// // //     label: "Step 6",
// // //     title: "Filters & Price Comparison",
// // //     accent: "Save Your Skin & Your Wallet",
// // //     blurb:
// // //       "Dial in your routine by budget, ingredients and concern — then compare prices across Canadian retailers.",
// // //     bullets: [
// // //       "Filter by price, concern & ingredients",
// // //       "Compare Walmart, Shoppers, Amazon, Sephora*",
// // //       "Highlight cheapest option & savings",
// // //     ],
// // //     tag: "Smart Filters",
// // //   },
// // //   {
// // //     id: "stores",
// // //     label: "Step 7",
// // //     title: "Where to Buy",
// // //     accent: "Optional Store Locator",
// // //     blurb:
// // //       "Optionally, show nearby stores with your recommended products in stock, with a simple map view.",
// // //     bullets: [
// // //       "See closest store for each product",
// // //       "Link out to directions",
// // //       "Optional: online vs in-store toggle",
// // //     ],
// // //     tag: "Location Layer",
// // //   },
// // //   {
// // //     id: "cta",
// // //     label: "Final",
// // //     title: "Ready to Glow On Demo Day",
// // //     accent: "Launch-Ready Experience",
// // //     blurb:
// // //       "All of this lives in a single smooth scroll experience: from selfie → insight → routine → cart… in under a minute.",
// // //     bullets: [
// // //       "Single-page scroll with sticky navigation",
// // //       "Crisp animations for each step",
// // //       "Perfectly framed for a 5–7 min hackathon demo",
// // //     ],
// // //     tag: "Demo Mode",
// // //   },
// // // ];

// // // const App = () => {
// // //   const [activeSection, setActiveSection] = useState("capture");
// // //   const sectionRefs = useRef({});

// // //   useEffect(() => {
// // //     const observer = new IntersectionObserver(
// // //       (entries) => {
// // //         const visible = entries
// // //           .filter((e) => e.isIntersecting)
// // //           .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
// // //         if (visible[0]) {
// // //           const id = visible[0].target.getAttribute("data-id");
// // //           if (id) setActiveSection(id);
// // //         }
// // //       },
// // //       {
// // //         root: null,
// // //         threshold: 0.35,
// // //       }
// // //     );

// // //     Object.values(sectionRefs.current).forEach((el) => {
// // //       if (el) observer.observe(el);
// // //     });

// // //     return () => observer.disconnect();
// // //   }, []);

// // //   const handleScrollTo = (id) => {
// // //     const el = sectionRefs.current[id];
// // //     if (!el) return;
// // //     el.scrollIntoView({ behavior: "smooth", block: "start" });
// // //   };

// // //   return (
// // //     <div className="app">
// // //       {/* Top Navigation */}
// // //       <header className="top-nav">
// // //         <div className="brand" onClick={() => handleScrollTo("capture")}>
// // //           <span className="brand-mark">◎</span>
// // //           <span className="brand-text">
// // //             SkinSense<span className="brand-ai">AI</span>
// // //           </span>
// // //         </div>

// // //         <nav className="nav-links">
// // //           {SECTIONS.slice(0, -1).map((section) => (
// // //             <button
// // //               key={section.id}
// // //               className={
// // //                 "nav-link" +
// // //                 (activeSection === section.id ? " nav-link-active" : "")
// // //               }
// // //               onClick={() => handleScrollTo(section.id)}
// // //             >
// // //               {section.label}
// // //             </button>
// // //           ))}
// // //         </nav>

// // //         <button
// // //           className="nav-cta"
// // //           onClick={() => handleScrollTo("capture")}
// // //         >
// // //           Try the Demo
// // //         </button>
// // //       </header>

// // //       {/* Scrollable main content */}
// // //       <main className="scroll-container">
// // //         {/* HERO SECTION (captures step 1 but more marketing-y) */}
// // //         <section
// // //           className="section hero"
// // //           data-id="capture"
// // //           ref={(el) => (sectionRefs.current["capture"] = el)}
// // //         >
// // //           <div className="section-inner hero-layout">
// // //             <div className="section-text">
// // //               <p className="floating-label floating-label-large">
// // //                 Upload. Analyze. Glow.
// // //               </p>
// // //               <h1 className="hero-title">
// // //                 Let AI read your skin —
// // //                 <span className="hero-highlight">
// // //                   <br />
// // //                   and build a routine that makes sense.
// // //                 </span>
// // //               </h1>
// // //               <p className="hero-subtitle">
// // //                 SkinSense AI turns a simple selfie into a full skincare journey:
// // //                 analysis, triggers, routine, products, and prices — all on one
// // //                 page.
// // //               </p>

// // //               <div className="hero-actions">
// // //                 <button className="primary-btn">
// // //                   📸 Upload / Capture Photo
// // //                 </button>
// // //                 <button
// // //                   className="secondary-btn"
// // //                   onClick={() => handleScrollTo("analysis")}
// // //                 >
// // //                   See How It Works ↓
// // //                 </button>
// // //               </div>

// // //               <div className="hero-pills">
// // //                 <span className="pill">Non-medical insights</span>
// // //                 <span className="pill">Ingredient-safe routines</span>
// // //                 <span className="pill">Price-aware suggestions</span>
// // //               </div>
// // //             </div>

// // //             {/* Mock UI card on the right */}
// // //             <div className="mock-card">
// // //               <div className="mock-header">
// // //                 <span className="mock-dot" />
// // //                 <span className="mock-dot" />
// // //                 <span className="mock-dot" />
// // //               </div>

// // //               <div className="mock-face-preview">
// // //                 <div className="mock-avatar" />
// // //                 <div className="mock-face-tags">
// // //                   <span>Oily T-zone</span>
// // //                   <span>Mild redness</span>
// // //                   <span>Barrier support</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mock-json-block">
// // //                 <div className="mock-json-title">AI Snapshot</div>
// // //                 <pre className="mock-json">
// // // {`{
// // //   "acne": "moderate",
// // //   "redness": "mild",
// // //   "oiliness": "high",
// // //   "goal": "calm & balance"
// // // }`}
// // //                 </pre>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* FEATURE SECTIONS */}
// // //         {SECTIONS.filter((s) => s.id !== "capture").map((section) => (
// // //           <section
// // //             key={section.id}
// // //             className={
// // //               "section feature" +
// // //               (activeSection === section.id ? " section-active" : "")
// // //             }
// // //             data-id={section.id}
// // //             ref={(el) => (sectionRefs.current[section.id] = el)}
// // //           >
// // //             <div className="section-inner">
// // //               {/* Left: floating label + copy */}
// // //               <div className="section-text">
// // //                 <p className="floating-label">
// // //                   {section.label} · {section.tag}
// // //                 </p>
// // //                 <h2 className="section-title">
// // //                   {section.title}{" "}
// // //                   <span className="section-accent">{section.accent}</span>
// // //                 </h2>
// // //                 <p className="section-blurb">{section.blurb}</p>

// // //                 <ul className="bullet-list">
// // //                   {section.bullets.map((item) => (
// // //                     <li key={item} className="bullet-item">
// // //                       <span className="bullet-dot" /> {item}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>

// // //               {/* Right: illustrative “UI” block that matches the step */}
// // //               <div className="section-visual">
// // //                 {section.id === "analysis" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Skin Map</h3>
// // //                     <div className="viz-bars">
// // //                       <div className="viz-bar">
// // //                         <span>Acne</span>
// // //                         <div className="viz-bar-fill w-70" />
// // //                       </div>
// // //                       <div className="viz-bar">
// // //                         <span>Redness</span>
// // //                         <div className="viz-bar-fill w-40" />
// // //                       </div>
// // //                       <div className="viz-bar">
// // //                         <span>Oiliness</span>
// // //                         <div className="viz-bar-fill w-85" />
// // //                       </div>
// // //                       <div className="viz-bar">
// // //                         <span>Dryness</span>
// // //                         <div className="viz-bar-fill w-20" />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "summary" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Skin Summary</h3>
// // //                     <p className="viz-paragraph">
// // //                       “Your skin appears moderately oily with mild inflammation
// // //                       around the cheeks. Stress and low sleep might be
// // //                       contributing to congestion.”
// // //                     </p>
// // //                     <div className="viz-tags-row">
// // //                       <span>⚡ Stress</span>
// // //                       <span>💤 Sleep</span>
// // //                       <span>🩹 Barrier support</span>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "routine" && (
// // //                   <div className="viz-card two-col">
// // //                     <div>
// // //                       <h3 className="viz-title">AM Routine</h3>
// // //                       <ol className="routine-list">
// // //                         <li>Gentle gel cleanser</li>
// // //                         <li>Antioxidant serum</li>
// // //                         <li>Oil-free moisturizer</li>
// // //                         <li>SPF 30+ sunscreen</li>
// // //                       </ol>
// // //                     </div>
// // //                     <div>
// // //                       <h3 className="viz-title">PM Routine</h3>
// // //                       <ol className="routine-list">
// // //                         <li>Oil-based cleanse</li>
// // //                         <li>Water-based cleanse</li>
// // //                         <li>Niacinamide serum</li>
// // //                         <li>Barrier repair cream</li>
// // //                       </ol>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "products" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Matched Products</h3>
// // //                     <div className="product-chip-row">
// // //                       <div className="product-chip">
// // //                         <p className="product-name">
// // //                           CeraVe Foaming Cleanser
// // //                         </p>
// // //                         <p className="product-detail">
// // //                           For oily / combo · niacinamide, ceramides
// // //                         </p>
// // //                         <span className="product-price">$12–16</span>
// // //                       </div>
// // //                       <div className="product-chip">
// // //                         <p className="product-name">
// // //                           La Roche-Posay Toleriane Cream
// // //                         </p>
// // //                         <p className="product-detail">
// // //                           For redness & barrier repair
// // //                         </p>
// // //                         <span className="product-price">$24–28</span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "filters" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Filter & Compare</h3>
// // //                     <div className="filter-row">
// // //                       <button className="filter-pill">Budget</button>
// // //                       <button className="filter-pill">Fragrance-free</button>
// // //                       <button className="filter-pill">Acne-safe</button>
// // //                       <button className="filter-pill">Barrier repair</button>
// // //                     </div>
// // //                     <div className="price-table">
// // //                       <div className="price-row price-header">
// // //                         <span>Store</span>
// // //                         <span>Price (CAD)</span>
// // //                       </div>
// // //                       <div className="price-row">
// // //                         <span>Walmart</span>
// // //                         <span>$13.97</span>
// // //                       </div>
// // //                       <div className="price-row">
// // //                         <span>Shoppers</span>
// // //                         <span>$18.99</span>
// // //                       </div>
// // //                       <div className="price-row">
// // //                         <span>Amazon.ca</span>
// // //                         <span>$15.49</span>
// // //                       </div>
// // //                       <div className="price-row">
// // //                         <span>Sephora</span>
// // //                         <span>$17.00</span>
// // //                       </div>
// // //                       <div className="price-row price-best">
// // //                         <span>Best price</span>
// // //                         <span>Walmart · $13.97</span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "stores" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Nearby Availability</h3>
// // //                     <div className="map-placeholder">
// // //                       <div className="map-pin">📍</div>
// // //                       <p className="map-caption">
// // //                         Show closest stores with your cleanser, moisturizer, and
// // //                         sunscreen in stock.
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {section.id === "cta" && (
// // //                   <div className="viz-card">
// // //                     <h3 className="viz-title">Demo-Ready Flow</h3>
// // //                     <p className="viz-paragraph">
// // //                       Scroll once, tell the story: upload, analyze, explain,
// // //                       routine, products, price. Every section is visually clear
// // //                       and judge-friendly.
// // //                     </p>
// // //                     <button
// // //                       className="primary-btn full-width"
// // //                       onClick={() => handleScrollTo("capture")}
// // //                     >
// // //                       Run the Full Flow from the Top ↑
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </section>
// // //         ))}
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default App;

// // import React, { useEffect, useRef, useState } from "react";

// // const SECTIONS = [
// //   {
// //     id: "capture",
// //     label: "Step 1",
// //     title: "Capture Your Skin",
// //     accent: "Webcam or Upload",
// //     blurb:
// //       "Start by snapping a selfie or uploading a clear photo of your face. No account, no fuss — just you and your skin.",
// //     bullets: [
// //       "Upload .jpg/.png from your gallery",
// //       "Or capture live using your webcam",
// //       "Add skin + lifestyle filters for smarter results",
// //     ],
// //     tag: "Input Layer",
// //   },
// //   {
// //     id: "analysis",
// //     label: "Step 2",
// //     title: "AI Skin Analysis",
// //     accent: "Powered by Vision Models",
// //     blurb:
// //       "Behind the scenes, AI scans for acne, redness, oiliness, texture and barrier health — all described in safe, non-medical language.",
// //     bullets: [
// //       "Acne, redness, oiliness & dryness detection",
// //       "Texture & pore visibility insights",
// //       "Barrier health patterns (non-medical)",
// //     ],
// //     tag: "Computer Vision",
// //   },
// //   {
// //     id: "summary",
// //     label: "Step 3",
// //     title: "Your Skin Story",
// //     accent: "Clear, Human-Friendly Summary",
// //     blurb:
// //       "We turn raw analysis into a simple narrative: how your skin is doing today and what might be influencing it.",
// //     bullets: [
// //       "JSON-style internal summary",
// //       "User-facing explanation in plain language",
// //       "Highlights probable lifestyle triggers",
// //     ],
// //     tag: "Insight Layer",
// //   },
// //   {
// //     id: "routine",
// //     label: "Step 4",
// //     title: "Smart Routine Builder",
// //     accent: "AM & PM Routines",
// //     blurb:
// //       "Tap one button to generate a full skincare routine with frequency hints, order of application, and patch-test reminders.",
// //     bullets: [
// //       "AM: cleanse, protect, shield (SPF)",
// //       "PM: reset, repair, treat",
// //       "Gentle frequency & patch-test warnings",
// //     ],
// //     tag: "Routine Engine",
// //   },
// //   {
// //     id: "products",
// //     label: "Step 5",
// //     title: "Product Matchmaker",
// //     accent: "Real Products, Real Shelves",
// //     blurb:
// //       "We match your skin profile to real products from Sephora, Ulta-style catalogs, and ingredient databases.",
// //     bullets: [
// //       "Non-comedogenic matches for your skin type",
// //       "Ingredient-level compatibility",
// //       "Short, honest reasons for each pick",
// //     ],
// //     tag: "Recommender",
// //   },
// //   {
// //     id: "filters",
// //     label: "Step 6",
// //     title: "Filters & Price Comparison",
// //     accent: "Save Your Skin & Your Wallet",
// //     blurb:
// //       "Dial in your routine by budget, ingredients and concern — then compare prices across Canadian retailers.",
// //     bullets: [
// //       "Filter by price, concern & ingredients",
// //       "Compare Walmart, Shoppers, Amazon, Sephora*",
// //       "Highlight cheapest option & savings",
// //     ],
// //     tag: "Smart Filters",
// //   },
// //   {
// //     id: "stores",
// //     label: "Step 7",
// //     title: "Where to Buy",
// //     accent: "Optional Store Locator",
// //     blurb:
// //       "Optionally, show nearby stores with your recommended products in stock, with a simple map view.",
// //     bullets: [
// //       "See closest store for each product",
// //       "Link out to directions",
// //       "Optional: online vs in-store toggle",
// //     ],
// //     tag: "Location Layer",
// //   },
// //   {
// //     id: "cta",
// //     label: "Final",
// //     title: "Ready to Glow On Demo Day",
// //     accent: "Launch-Ready Experience",
// //     blurb:
// //       "All of this lives in a single smooth scroll experience: from selfie → insight → routine → cart… in under a minute.",
// //     bullets: [
// //       "Single-page scroll with sticky navigation",
// //       "Crisp animations for each step",
// //       "Perfectly framed for a 5–7 min hackathon demo",
// //     ],
// //     tag: "Demo Mode",
// //   },
// // ];

// // const App = () => {
// //   const [activeSection, setActiveSection] = useState("capture");
// //   const sectionRefs = useRef({});

// //   // NEW: simple state for user filters (front-end only for now)
// //   const [userFilters, setUserFilters] = useState({
// //     gender: "",
// //     ageRange: "",
// //     skinType: "",
// //     healthIssue: "",
// //   });

// //   useEffect(() => {
// //     const observer = new IntersectionObserver(
// //       (entries) => {
// //         const visible = entries
// //           .filter((e) => e.isIntersecting)
// //           .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
// //         if (visible[0]) {
// //           const id = visible[0].target.getAttribute("data-id");
// //           if (id) setActiveSection(id);
// //         }
// //       },
// //       {
// //         root: null,
// //         threshold: 0.35,
// //       }
// //     );

// //     Object.values(sectionRefs.current).forEach((el) => {
// //       if (el) observer.observe(el);
// //     });

// //     return () => observer.disconnect();
// //   }, []);

// //   const handleScrollTo = (id) => {
// //     const el = sectionRefs.current[id];
// //     if (!el) return;
// //     el.scrollIntoView({ behavior: "smooth", block: "start" });
// //   };

// //   const handleFilterChange = (field) => (e) => {
// //     setUserFilters((prev) => ({
// //       ...prev,
// //       [field]: e.target.value,
// //     }));
// //   };

// //   return (
// //     <div className="app">
// //       {/* Top Navigation */}
// //       <header className="top-nav">
// //         <div className="brand" onClick={() => handleScrollTo("capture")}>
// //           <span className="brand-mark">◎</span>
// //           <span className="brand-text">
// //             SkinSense<span className="brand-ai">AI</span>
// //           </span>
// //         </div>

// //         <nav className="nav-links">
// //           {SECTIONS.slice(0, -1).map((section) => (
// //             <button
// //               key={section.id}
// //               className={
// //                 "nav-link" +
// //                 (activeSection === section.id ? " nav-link-active" : "")
// //               }
// //               onClick={() => handleScrollTo(section.id)}
// //             >
// //               {section.label}
// //             </button>
// //           ))}
// //         </nav>

// //         <button
// //           className="nav-cta"
// //           onClick={() => handleScrollTo("capture")}
// //         >
// //           Try the Demo
// //         </button>
// //       </header>

// //       {/* Scrollable main content */}
// //       <main className="scroll-container">
// //         {/* HERO SECTION (Step 1 + user filters) */}
// //         <section
// //           className="section hero"
// //           data-id="capture"
// //           ref={(el) => (sectionRefs.current["capture"] = el)}
// //         >
// //           <div className="section-inner hero-layout">
// //             <div className="section-text">
// //               <p className="floating-label floating-label-large">
// //                 Upload. Analyze. Glow.
// //               </p>
// //               <h1 className="hero-title">
// //                 Let AI read your skin —
// //                 <span className="hero-highlight">
// //                   <br />
// //                   and build a routine that makes sense.
// //                 </span>
// //               </h1>
// //               <p className="hero-subtitle">
// //                 SkinSense AI turns a simple selfie into a full skincare journey:
// //                 analysis, triggers, routine, products, and prices — all on one
// //                 page.
// //               </p>

// //               <div className="hero-actions">
// //                 <button className="primary-btn">
// //                   📸 Upload / Capture Photo
// //                 </button>
// //                 <button
// //                   className="secondary-btn"
// //                   onClick={() => handleScrollTo("analysis")}
// //                 >
// //                   See How It Works ↓
// //                 </button>
// //               </div>

// //               {/* NEW: User input filters under upload */}
// //               <div className="user-form">
// //                 <p className="form-caption">
// //                   Tell us a bit more so we can personalize your routine:
// //                 </p>
// //                 <div className="form-grid">
// //                   <div className="form-field">
// //                     <label htmlFor="gender">Gender</label>
// //                     <select
// //                       id="gender"
// //                       value={userFilters.gender}
// //                       onChange={handleFilterChange("gender")}
// //                     >
// //                       <option value="">Select gender</option>
// //                       <option value="female">Female</option>
// //                       <option value="male">Male</option>
// //                       <option value="nonbinary">Non-binary</option>
// //                       <option value="prefer-not">Prefer not to say</option>
// //                       <option value="other">Other</option>
// //                     </select>
// //                   </div>

// //                   <div className="form-field">
// //                     <label htmlFor="ageRange">Age</label>
// //                     <select
// //                       id="ageRange"
// //                       value={userFilters.ageRange}
// //                       onChange={handleFilterChange("ageRange")}
// //                     >
// //                       <option value="">Select age range</option>
// //                       <option value="under18">Under 18</option>
// //                       <option value="18-24">18–24</option>
// //                       <option value="25-34">25–34</option>
// //                       <option value="35-44">35–44</option>
// //                       <option value="45plus">45+</option>
// //                     </select>
// //                   </div>

// //                   <div className="form-field">
// //                     <label htmlFor="skinType">Skin Type</label>
// //                     <select
// //                       id="skinType"
// //                       value={userFilters.skinType}
// //                       onChange={handleFilterChange("skinType")}
// //                     >
// //                       <option value="">Select skin type</option>
// //                       <option value="normal">Normal</option>
// //                       <option value="oily">Oily</option>
// //                       <option value="dry">Dry</option>
// //                       <option value="combo">Combination</option>
// //                       <option value="sensitive">Sensitive</option>
// //                       <option value="not-sure">Not sure</option>
// //                     </select>
// //                   </div>

// //                   <div className="form-field">
// //                     <label htmlFor="healthIssue">Health Problems</label>
// //                     <select
// //                       id="healthIssue"
// //                       value={userFilters.healthIssue}
// //                       onChange={handleFilterChange("healthIssue")}
// //                     >
// //                       <option value="">Select an option</option>
// //                       <option value="none">None</option>
// //                       <option value="acne">Acne</option>
// //                       <option value="eczema">Eczema</option>
// //                       <option value="rosacea">Rosacea</option>
// //                       <option value="pcos">PCOS / hormonal</option>
// //                       <option value="other">Other</option>
// //                     </select>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="hero-pills">
// //                 <span className="pill">Non-medical insights</span>
// //                 <span className="pill">Ingredient-safe routines</span>
// //                 <span className="pill">Price-aware suggestions</span>
// //               </div>
// //             </div>

// //             {/* Mock UI card on the right */}
// //             <div className="mock-card">
// //               <div className="mock-header">
// //                 <span className="mock-dot" />
// //                 <span className="mock-dot" />
// //                 <span className="mock-dot" />
// //               </div>

// //               <div className="mock-face-preview">
// //                 <div className="mock-avatar" />
// //                 <div className="mock-face-tags">
// //                   <span>Oily T-zone</span>
// //                   <span>Mild redness</span>
// //                   <span>Barrier support</span>
// //                 </div>
// //               </div>

// //               <div className="mock-json-block">
// //                 <div className="mock-json-title">AI Snapshot</div>
// //                 <pre className="mock-json">
// // {`{
// //   "acne": "moderate",
// //   "redness": "mild",
// //   "oiliness": "high",
// //   "goal": "calm & balance"
// // }`}
// //                 </pre>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* FEATURE SECTIONS */}
// //         {SECTIONS.filter((s) => s.id !== "capture").map((section) => (
// //           <section
// //             key={section.id}
// //             className={
// //               "section feature" +
// //               (activeSection === section.id ? " section-active" : "")
// //             }
// //             data-id={section.id}
// //             ref={(el) => (sectionRefs.current[section.id] = el)}
// //           >
// //             <div className="section-inner">
// //               {/* Left: floating label + copy */}
// //               <div className="section-text">
// //                 <p className="floating-label">
// //                   {section.label} · {section.tag}
// //                 </p>
// //                 <h2 className="section-title">
// //                   {section.title}{" "}
// //                   <span className="section-accent">{section.accent}</span>
// //                 </h2>
// //                 <p className="section-blurb">{section.blurb}</p>

// //                 <ul className="bullet-list">
// //                   {section.bullets.map((item) => (
// //                     <li key={item} className="bullet-item">
// //                       <span className="bullet-dot" /> {item}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>

// //               {/* Right: illustrative “UI” block that matches the step */}
// //               <div className="section-visual">
// //                 {section.id === "analysis" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Skin Map</h3>
// //                     <div className="viz-bars">
// //                       <div className="viz-bar">
// //                         <span>Acne</span>
// //                         <div className="viz-bar-fill w-70" />
// //                       </div>
// //                       <div className="viz-bar">
// //                         <span>Redness</span>
// //                         <div className="viz-bar-fill w-40" />
// //                       </div>
// //                       <div className="viz-bar">
// //                         <span>Oiliness</span>
// //                         <div className="viz-bar-fill w-85" />
// //                       </div>
// //                       <div className="viz-bar">
// //                         <span>Dryness</span>
// //                         <div className="viz-bar-fill w-20" />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {section.id === "summary" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Skin Summary</h3>
// //                     <p className="viz-paragraph">
// //                       “Your skin appears moderately oily with mild inflammation
// //                       around the cheeks. Stress and low sleep might be
// //                       contributing to congestion.”
// //                     </p>
// //                     <div className="viz-tags-row">
// //                       <span>⚡ Stress</span>
// //                       <span>💤 Sleep</span>
// //                       <span>🩹 Barrier support</span>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {section.id === "routine" && (
// //                   <div className="viz-card two-col">
// //                     <div>
// //                       <h3 className="viz-title">AM Routine</h3>
// //                       <ol className="routine-list">
// //                         <li>Gentle gel cleanser</li>
// //                         <li>Antioxidant serum</li>
// //                         <li>Oil-free moisturizer</li>
// //                         <li>SPF 30+ sunscreen</li>
// //                       </ol>
// //                     </div>
// //                     <div>
// //                       <h3 className="viz-title">PM Routine</h3>
// //                       <ol className="routine-list">
// //                         <li>Oil-based cleanse</li>
// //                         <li>Water-based cleanse</li>
// //                         <li>Niacinamide serum</li>
// //                         <li>Barrier repair cream</li>
// //                       </ol>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {section.id === "products" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Matched Products (Web Results)</h3>

// //                     <div className="product-grid">
// //                       {/* Card 1 */}
// //                       <div className="product-card">
// //                         <div className="product-image">
// //                           {/* Placeholder box where scraped product image would go */}
// //                           <div className="product-thumb product-thumb-1" />
// //                         </div>

// //                         <div className="product-meta">
// //                           <p className="product-name">CeraVe Foaming Facial Cleanser</p>
// //                           <p className="product-detail">
// //                             For oily / combo skin · niacinamide, ceramides, non-comedogenic.
// //                           </p>

// //                           <div className="product-store-row">
// //                             <span>Walmart</span>
// //                             <span className="product-price">$13.97</span>
// //                           </div>
// //                           <div className="product-store-row">
// //                             <span>Amazon.ca</span>
// //                             <span className="product-price">$15.49</span>
// //                           </div>

// //                           <span className="product-tag">Best price: Walmart</span>
// //                         </div>
// //                       </div>

// //                       {/* Card 2 */}
// //                       <div className="product-card">
// //                         <div className="product-image">
// //                           <div className="product-thumb product-thumb-2" />
// //                         </div>

// //                         <div className="product-meta">
// //                           <p className="product-name">La Roche-Posay Toleriane Sensitive Cream</p>
// //                           <p className="product-detail">
// //                             For redness & barrier repair · minimalist formula, fragrance-free.
// //                           </p>

// //                           <div className="product-store-row">
// //                             <span>Shoppers Drug Mart</span>
// //                             <span className="product-price">$28.99</span>
// //                           </div>
// //                           <div className="product-store-row">
// //                             <span>Sephora</span>
// //                             <span className="product-price">$27.00</span>
// //                           </div>

// //                           <span className="product-tag product-tag-alt">Best match: Sensitive skin</span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <p className="search-note">
// //                       *In the full version, these cards would be auto-filled from live web scraping / retail APIs.
// //                     </p>
// //                   </div>
// //                 )}

// //                 {section.id === "filters" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Filter & Compare</h3>
// //                     <div className="filter-row">
// //                       <button className="filter-pill">Budget</button>
// //                       <button className="filter-pill">Fragrance-free</button>
// //                       <button className="filter-pill">Acne-safe</button>
// //                       <button className="filter-pill">Barrier repair</button>
// //                     </div>
// //                     <div className="price-table">
// //                       <div className="price-row price-header">
// //                         <span>Store</span>
// //                         <span>Price (CAD)</span>
// //                       </div>
// //                       <div className="price-row">
// //                         <span>Walmart</span>
// //                         <span>$13.97</span>
// //                       </div>
// //                       <div className="price-row">
// //                         <span>Shoppers</span>
// //                         <span>$18.99</span>
// //                       </div>
// //                       <div className="price-row">
// //                         <span>Amazon.ca</span>
// //                         <span>$15.49</span>
// //                       </div>
// //                       <div className="price-row">
// //                         <span>Sephora</span>
// //                         <span>$17.00</span>
// //                       </div>
// //                       <div className="price-row price-best">
// //                         <span>Best price</span>
// //                         <span>Walmart · $13.97</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {section.id === "stores" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Nearby Availability</h3>
// //                     <div className="map-placeholder">
// //                       <div className="map-pin">📍</div>
// //                       <p className="map-caption">
// //                         Show closest stores with your cleanser, moisturizer, and
// //                         sunscreen in stock.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {section.id === "cta" && (
// //                   <div className="viz-card">
// //                     <h3 className="viz-title">Demo-Ready Flow</h3>
// //                     <p className="viz-paragraph">
// //                       Scroll once, tell the story: upload, analyze, explain,
// //                       routine, products, price. Every section is visually clear
// //                       and judge-friendly.
// //                     </p>
// //                     <button
// //                       className="primary-btn full-width"
// //                       onClick={() => handleScrollTo("capture")}
// //                     >
// //                       Run the Full Flow from the Top ↑
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </section>
// //         ))}
// //       </main>
// //     </div>
// //   );
// // };

// // export default App;

// import React, { useEffect, useRef, useState } from "react";

// const SECTIONS = [
//   {
//     id: "capture",
//     label: "Step 1",
//     title: "Capture Your Skin",
//     accent: "Webcam or Upload",
//     blurb:
//       "Start by snapping a selfie or uploading a clear photo of your face. No account, no fuss — just you and your skin.",
//     bullets: [
//       "Upload .jpg/.png from your gallery",
//       "Or capture live using your webcam",
//       "Add skin + lifestyle filters for smarter results",
//     ],
//     tag: "Input Layer",
//   },
//   {
//     id: "analysis",
//     label: "Step 2",
//     title: "AI Skin Analysis",
//     accent: "Powered by Vision Models",
//     blurb:
//       "Behind the scenes, AI scans for acne, redness, oiliness, texture and barrier health — all described in safe, non-medical language.",
//     bullets: [
//       "Acne, redness, oiliness & dryness detection",
//       "Texture & pore visibility insights",
//       "Barrier health patterns (non-medical)",
//     ],
//     tag: "Computer Vision",
//   },
//   {
//     id: "summary",
//     label: "Step 3",
//     title: "Your Skin Story",
//     accent: "Clear, Human-Friendly Summary",
//     blurb:
//       "We turn raw analysis into a simple narrative: how your skin is doing today and what might be influencing it.",
//     bullets: [
//       "JSON-style internal summary",
//       "User-facing explanation in plain language",
//       "Highlights probable lifestyle triggers",
//     ],
//     tag: "Insight Layer",
//   },
//   {
//     id: "routine",
//     label: "Step 4",
//     title: "Smart Routine Builder",
//     accent: "AM & PM Routines",
//     blurb:
//       "Tap one button to generate a full skincare routine with frequency hints, order of application, and patch-test reminders.",
//     bullets: [
//       "AM: cleanse, protect, shield (SPF)",
//       "PM: reset, repair, treat",
//       "Gentle frequency & patch-test warnings",
//     ],
//     tag: "Routine Engine",
//   },
//   {
//     id: "products",
//     label: "Step 5",
//     title: "Product Matchmaker",
//     accent: "Real Products, Real Shelves",
//     blurb:
//       "We match your skin profile to real products from Sephora, Ulta-style catalogs, and ingredient databases.",
//     bullets: [
//       "Non-comedogenic matches for your skin type",
//       "Ingredient-level compatibility",
//       "Short, honest reasons for each pick",
//     ],
//     tag: "Recommender",
//   },
//   {
//     id: "filters",
//     label: "Step 6",
//     title: "Filters & Price Comparison",
//     accent: "Save Your Skin & Your Wallet",
//     blurb:
//       "Dial in your routine by budget, ingredients and concern — then compare prices across Canadian retailers.",
//     bullets: [
//       "Filter by price, concern & ingredients",
//       "Compare Walmart, Shoppers, Amazon, Sephora*",
//       "Highlight cheapest option & savings",
//     ],
//     tag: "Smart Filters",
//   },
//   {
//     id: "stores",
//     label: "Step 7",
//     title: "Where to Buy",
//     accent: "Optional Store Locator",
//     blurb:
//       "Optionally, show nearby stores with your recommended products in stock, with a simple map view.",
//     bullets: [
//       "See closest store for each product",
//       "Link out to directions",
//       "Optional: online vs in-store toggle",
//     ],
//     tag: "Location Layer",
//   },
//   {
//     id: "cta",
//     label: "Final",
//     title: "Ready to Glow On Demo Day",
//     accent: "Launch-Ready Experience",
//     blurb:
//       "All of this lives in a single smooth scroll experience: from selfie → insight → routine → cart… in under a minute.",
//     bullets: [
//       "Single-page scroll with sticky navigation",
//       "Crisp animations for each step",
//       "Perfectly framed for a 5–7 min hackathon demo",
//     ],
//     tag: "Demo Mode",
//   },
// ];

// const App = () => {
//   const [activeSection, setActiveSection] = useState("capture");
//   const sectionRefs = useRef({});

//   const [userFilters, setUserFilters] = useState({
//     gender: "",
//     ageRange: "",
//     skinType: "",
//     healthIssue: "",
//   });

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
//         if (visible[0]) {
//           const id = visible[0].target.getAttribute("data-id");
//           if (id) setActiveSection(id);
//         }
//       },
//       {
//         root: null,
//         threshold: 0.35,
//       }
//     );

//     Object.values(sectionRefs.current).forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const handleScrollTo = (id) => {
//     const el = sectionRefs.current[id];
//     if (!el) return;
//     el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const handleFilterChange = (field) => (e) => {
//     setUserFilters((prev) => ({
//       ...prev,
//       [field]: e.target.value,
//     }));
//   };

//   return (
//     <div className="app">
//       {/* Top Navigation */}
//       <header className="top-nav">
//         <div className="brand" onClick={() => handleScrollTo("capture")}>
//           <span className="brand-mark">◎</span>
//           <span className="brand-text">
//             SkinSense<span className="brand-ai">AI</span>
//           </span>
//         </div>

//         <nav className="nav-links">
//           {SECTIONS.slice(0, -1).map((section) => (
//             <button
//               key={section.id}
//               className={
//                 "nav-link" +
//                 (activeSection === section.id ? " nav-link-active" : "")
//               }
//               onClick={() => handleScrollTo(section.id)}
//             >
//               {section.label}
//             </button>
//           ))}
//         </nav>

//         <button className="nav-cta" onClick={() => handleScrollTo("capture")}>
//           Try the Demo
//         </button>
//       </header>

//       {/* Scrollable main content */}
//       <main className="scroll-container">
//         {/* HERO SECTION */}
//         <section
//           className="section hero"
//           data-id="capture"
//           ref={(el) => (sectionRefs.current["capture"] = el)}
//         >
//           <div className="section-inner hero-layout">
//             {/* LEFT: copy + upload + filters */}
//             <div className="section-text">
//               <p className="floating-label floating-label-large">
//                 Upload. Analyze. Glow.
//               </p>
//               <h1 className="hero-title">
//                 Let AI read your skin —
//                 <span className="hero-highlight">
//                   <br />
//                   and build a routine that makes sense.
//                 </span>
//               </h1>
//               <p className="hero-subtitle">
//                 SkinSense AI turns a simple selfie into a full skincare journey:
//                 analysis, triggers, routine, products, and prices — all on one
//                 page.
//               </p>

//               <div className="hero-actions">
//                 <button className="primary-btn">
//                   📸 Upload / Capture Photo
//                 </button>
//                 <button
//                   className="secondary-btn"
//                   onClick={() => handleScrollTo("analysis")}
//                 >
//                   See How It Works ↓
//                 </button>
//               </div>

//               {/* User filters form */}
//               <div className="user-form">
//                 <p className="form-caption">
//                   Tell us a bit more so we can personalize your routine:
//                 </p>
//                 <div className="form-grid">
//                   <div className="form-field">
//                     <label htmlFor="gender">Gender</label>
//                     <select
//                       id="gender"
//                       value={userFilters.gender}
//                       onChange={handleFilterChange("gender")}
//                     >
//                       <option value="">Select gender</option>
//                       <option value="female">Female</option>
//                       <option value="male">Male</option>
//                       <option value="nonbinary">Non-binary</option>
//                       <option value="prefer-not">Prefer not to say</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="ageRange">Age</label>
//                     <select
//                       id="ageRange"
//                       value={userFilters.ageRange}
//                       onChange={handleFilterChange("ageRange")}
//                     >
//                       <option value="">Select age range</option>
//                       <option value="under18">Under 18</option>
//                       <option value="18-24">18–24</option>
//                       <option value="25-34">25–34</option>
//                       <option value="35-44">35–44</option>
//                       <option value="45plus">45+</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="skinType">Skin Type</label>
//                     <select
//                       id="skinType"
//                       value={userFilters.skinType}
//                       onChange={handleFilterChange("skinType")}
//                     >
//                       <option value="">Select skin type</option>
//                       <option value="normal">Normal</option>
//                       <option value="oily">Oily</option>
//                       <option value="dry">Dry</option>
//                       <option value="combo">Combination</option>
//                       <option value="sensitive">Sensitive</option>
//                       <option value="not-sure">Not sure</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="healthIssue">Health Problems</label>
//                     <select
//                       id="healthIssue"
//                       value={userFilters.healthIssue}
//                       onChange={handleFilterChange("healthIssue")}
//                     >
//                       <option value="">Select an option</option>
//                       <option value="none">None</option>
//                       <option value="acne">Acne</option>
//                       <option value="eczema">Eczema</option>
//                       <option value="rosacea">Rosacea</option>
//                       <option value="pcos">PCOS / hormonal</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="hero-pills">
//                 <span className="pill">Non-medical insights</span>
//                 <span className="pill">Ingredient-safe routines</span>
//                 <span className="pill">Price-aware suggestions</span>
//               </div>
//             </div>

//             {/* RIGHT: flowy product hero inspired by Dribbble shot */}
//             <div className="hero-product-card">
//               <div className="hero-product-header">
//                 <span className="hero-product-pill">Purifying Exfoliating Gel</span>
//                 <span className="hero-product-code">For oily / acne-prone skin</span>
//               </div>

//               <div className="hero-product-body">
//                 <div className="hero-product-image-wrap">
//                   <div className="hero-product-circle" />
//                   <div className="hero-product-bottle" />
//                 </div>

//                 <div className="hero-product-specs">
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Rating</span>
//                     <span className="hero-spec-value">4.8</span>
//                     <span className="hero-spec-sub">+2.1k reviews</span>
//                   </div>
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Volume</span>
//                     <span className="hero-spec-value">150 ml</span>
//                     <span className="hero-spec-sub">Daily, gentle use</span>
//                   </div>
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Focus</span>
//                     <span className="hero-spec-value">Texture</span>
//                     <span className="hero-spec-sub">Smooth & refine</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="hero-product-footer">
//                 <button className="hero-ghost-btn">See routine with this product</button>
//                 <span className="hero-product-price">Est. $26–32 CAD</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* OTHER SECTIONS */}
//         {SECTIONS.filter((s) => s.id !== "capture").map((section) => (
//           <section
//             key={section.id}
//             className={
//               "section feature" +
//               (activeSection === section.id ? " section-active" : "")
//             }
//             data-id={section.id}
//             ref={(el) => (sectionRefs.current[section.id] = el)}
//           >
//             <div className="section-inner">
//               {/* Left: text */}
//               <div className="section-text">
//                 <p className="floating-label">
//                   {section.label} · {section.tag}
//                 </p>
//                 <h2 className="section-title">
//                   {section.title}{" "}
//                   <span className="section-accent">{section.accent}</span>
//                 </h2>
//                 <p className="section-blurb">{section.blurb}</p>

//                 <ul className="bullet-list">
//                   {section.bullets.map((item) => (
//                     <li key={item} className="bullet-item">
//                       <span className="bullet-dot" /> {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Right: visuals per section */}
//               <div className="section-visual">
//                 {section.id === "analysis" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Skin Map</h3>
//                     <div className="viz-bars">
//                       <div className="viz-bar">
//                         <span>Acne</span>
//                         <div className="viz-bar-fill w-70" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Redness</span>
//                         <div className="viz-bar-fill w-40" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Oiliness</span>
//                         <div className="viz-bar-fill w-85" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Dryness</span>
//                         <div className="viz-bar-fill w-20" />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "summary" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Skin Summary</h3>
//                     <p className="viz-paragraph">
//                       “Your skin appears moderately oily with mild inflammation
//                       around the cheeks. Stress and low sleep might be
//                       contributing to congestion.”
//                     </p>
//                     <div className="viz-tags-row">
//                       <span>⚡ Stress</span>
//                       <span>💤 Sleep</span>
//                       <span>🩹 Barrier support</span>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "routine" && (
//                   <div className="viz-card two-col">
//                     <div>
//                       <h3 className="viz-title">AM Routine</h3>
//                       <ol className="routine-list">
//                         <li>Gentle gel cleanser</li>
//                         <li>Antioxidant serum</li>
//                         <li>Oil-free moisturizer</li>
//                         <li>SPF 30+ sunscreen</li>
//                       </ol>
//                     </div>
//                     <div>
//                       <h3 className="viz-title">PM Routine</h3>
//                       <ol className="routine-list">
//                         <li>Oil-based cleanse</li>
//                         <li>Water-based cleanse</li>
//                         <li>Niacinamide serum</li>
//                         <li>Barrier repair cream</li>
//                       </ol>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "products" && (
//                   <div className="viz-card product-results-card">
//                     <h3 className="viz-title">Matched Products (Web Results)</h3>

//                     <div className="product-grid">
//                       <div className="product-card">
//                         <div className="product-image">
//                           <div className="product-thumb product-thumb-1" />
//                         </div>
//                         <div className="product-meta">
//                           <p className="product-name">
//                             CeraVe Foaming Facial Cleanser
//                           </p>
//                           <p className="product-detail">
//                             For oily / combo skin · niacinamide, ceramides,
//                             non-comedogenic.
//                           </p>
//                           <div className="product-store-row">
//                             <span>Walmart</span>
//                             <span className="product-price">$13.97</span>
//                           </div>
//                           <div className="product-store-row">
//                             <span>Amazon.ca</span>
//                             <span className="product-price">$15.49</span>
//                           </div>
//                           <span className="product-tag">
//                             Best price: Walmart
//                           </span>
//                         </div>
//                       </div>

//                       <div className="product-card">
//                         <div className="product-image">
//                           <div className="product-thumb product-thumb-2" />
//                         </div>
//                         <div className="product-meta">
//                           <p className="product-name">
//                             La Roche-Posay Toleriane Sensitive Cream
//                           </p>
//                           <p className="product-detail">
//                             For redness & barrier repair · minimalist formula,
//                             fragrance-free.
//                           </p>
//                           <div className="product-store-row">
//                             <span>Shoppers Drug Mart</span>
//                             <span className="product-price">$28.99</span>
//                           </div>
//                           <div className="product-store-row">
//                             <span>Sephora</span>
//                             <span className="product-price">$27.00</span>
//                           </div>
//                           <span className="product-tag product-tag-alt">
//                             Best match: Sensitive skin
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="search-note">
//                       *In the full version, these cards would be auto-filled from
//                       live web scraping / retail APIs.
//                     </p>
//                   </div>
//                 )}

//                 {section.id === "filters" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Filter & Compare</h3>
//                     <div className="filter-row">
//                       <button className="filter-pill">Budget</button>
//                       <button className="filter-pill">Fragrance-free</button>
//                       <button className="filter-pill">Acne-safe</button>
//                       <button className="filter-pill">Barrier repair</button>
//                     </div>
//                     <div className="price-table">
//                       <div className="price-row price-header">
//                         <span>Store</span>
//                         <span>Price (CAD)</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Walmart</span>
//                         <span>$13.97</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Shoppers</span>
//                         <span>$18.99</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Amazon.ca</span>
//                         <span>$15.49</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Sephora</span>
//                         <span>$17.00</span>
//                       </div>
//                       <div className="price-row price-best">
//                         <span>Best price</span>
//                         <span>Walmart · $13.97</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "stores" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Nearby Availability</h3>
//                     <div className="map-placeholder">
//                       <div className="map-pin">📍</div>
//                       <p className="map-caption">
//                         Show closest stores with your cleanser, moisturizer, and
//                         sunscreen in stock.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "cta" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Demo-Ready Flow</h3>
//                     <p className="viz-paragraph">
//                       Scroll once, tell the story: upload, analyze, explain,
//                       routine, products, price. Every section is visually clear
//                       and judge-friendly.
//                     </p>
//                     <button
//                       className="primary-btn full-width"
//                       onClick={() => handleScrollTo("capture")}
//                     >
//                       Run the Full Flow from the Top ↑
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default App;

// import React, { useEffect, useRef, useState } from "react";

// const SECTIONS = [
//   {
//     id: "capture",
//     label: "Step 1",
//     title: "Capture Your Skin",
//     accent: "Webcam or Upload",
//     blurb:
//       "Start by snapping a selfie or uploading a clear photo of your face. No account, no fuss — just you and your skin.",
//     bullets: [
//       "Upload .jpg/.png from your gallery",
//       "Or capture live using your webcam",
//       "Add skin + lifestyle filters for smarter results",
//     ],
//     tag: "Input Layer",
//   },
//   {
//     id: "analysis",
//     label: "Step 2",
//     title: "AI Skin Analysis",
//     accent: "Powered by Vision Models",
//     blurb:
//       "Behind the scenes, AI scans for acne, redness, oiliness, texture and barrier health — all described in safe, non-medical language.",
//     bullets: [
//       "Acne, redness, oiliness & dryness detection",
//       "Texture & pore visibility insights",
//       "Barrier health patterns (non-medical)",
//     ],
//     tag: "Computer Vision",
//   },
//   {
//     id: "summary",
//     label: "Step 3",
//     title: "Your Skin Story",
//     accent: "Clear, Human-Friendly Summary",
//     blurb:
//       "We turn raw analysis into a simple narrative: how your skin is doing today and what might be influencing it.",
//     bullets: [
//       "JSON-style internal summary",
//       "User-facing explanation in plain language",
//       "Highlights probable lifestyle triggers",
//     ],
//     tag: "Insight Layer",
//   },
//   {
//     id: "routine",
//     label: "Step 4",
//     title: "Smart Routine Builder",
//     accent: "AM & PM Routines",
//     blurb:
//       "Tap one button to generate a full skincare routine with frequency hints, order of application, and patch-test reminders.",
//     bullets: [
//       "AM: cleanse, protect, shield (SPF)",
//       "PM: reset, repair, treat",
//       "Gentle frequency & patch-test warnings",
//     ],
//     tag: "Routine Engine",
//   },
//   {
//     id: "products",
//     label: "Step 5",
//     title: "Product Matchmaker",
//     accent: "Real Products, Real Shelves",
//     blurb:
//       "We match your skin profile to real products from Sephora, Ulta-style catalogs, and ingredient databases.",
//     bullets: [
//       "Non-comedogenic matches for your skin type",
//       "Ingredient-level compatibility",
//       "Short, honest reasons for each pick",
//     ],
//     tag: "Recommender",
//   },
//   {
//     id: "filters",
//     label: "Step 6",
//     title: "Filters & Price Comparison",
//     accent: "Save Your Skin & Your Wallet",
//     blurb:
//       "Dial in your routine by budget, ingredients and concern — then compare prices across Canadian retailers.",
//     bullets: [
//       "Filter by price, concern & ingredients",
//       "Compare Walmart, Shoppers, Amazon, Sephora*",
//       "Highlight cheapest option & savings",
//     ],
//     tag: "Smart Filters",
//   },
//   {
//     id: "stores",
//     label: "Step 7",
//     title: "Where to Buy",
//     accent: "Optional Store Locator",
//     blurb:
//       "Optionally, show nearby stores with your recommended products in stock, with a simple map view.",
//     bullets: [
//       "See closest store for each product",
//       "Link out to directions",
//       "Optional: online vs in-store toggle",
//     ],
//     tag: "Location Layer",
//   },
//   {
//     id: "cta",
//     label: "Final",
//     title: "Ready to Glow On Demo Day",
//     accent: "Launch-Ready Experience",
//     blurb:
//       "All of this lives in a single smooth scroll experience: from selfie → insight → routine → cart… in under a minute.",
//     bullets: [
//       "Single-page scroll with sticky navigation",
//       "Crisp animations for each step",
//       "Perfectly framed for a 5–7 min hackathon demo",
//     ],
//     tag: "Demo Mode",
//   },
// ];

// /* ============================
//    AUTH SCREEN (FRONT-END ONLY)
//    ============================ */

// function AuthScreen({ onAuthenticated }) {
//   const [mode, setMode] = useState("signin"); // "signin" | "signup"

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // later: call backend here
//     onAuthenticated();
//   };

//   return (
//     <div className="auth-app">
//       <div className="auth-shell">
//         {/* Left: intro / marketing copy */}
//         <div className="auth-intro">
//           <div className="auth-logo-pill">SkinSense • AI</div>
//           <h1 className="auth-title">Welcome back to SkinSense.</h1>
//           <p className="auth-subtitle">
//             Upload your skin snapshot, track changes over time, and get
//             ingredient–smart routines that match your budget.
//           </p>
//           <ul className="auth-bullets">
//             <li>✓ Dermatology-inspired, non-medical guidance</li>
//             <li>✓ Save profiles & routines for later</li>
//             <li>✓ Works with any budget & skin goal</li>
//           </ul>
//         </div>

//         {/* Right: auth card */}
//         <div className="auth-card">
//           <div className="auth-tabs">
//             <button
//               type="button"
//               className={
//                 "auth-tab" + (mode === "signin" ? " auth-tab-active" : "")
//               }
//               onClick={() => setMode("signin")}
//             >
//               Sign in
//             </button>
//             <button
//               type="button"
//               className={
//                 "auth-tab" + (mode === "signup" ? " auth-tab-active" : "")
//               }
//               onClick={() => setMode("signup")}
//             >
//               Create account
//             </button>
//           </div>

//           <form className="auth-form" onSubmit={handleSubmit}>
//             {mode === "signup" && (
//               <div className="auth-field">
//                 <label htmlFor="name">Full name</label>
//                 <input
//                   id="name"
//                   type="text"
//                   placeholder="Zoha Khan"
//                   required
//                   className="auth-input"
//                 />
//               </div>
//             )}

//             <div className="auth-field">
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 required
//                 className="auth-input"
//               />
//             </div>

//             <div className="auth-field">
//               <label htmlFor="password">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 required
//                 className="auth-input"
//               />
//             </div>

//             {mode === "signup" && (
//               <div className="auth-field">
//                 <label htmlFor="skin-profile">Optional skin profile</label>
//                 <select
//                   id="skin-profile"
//                   className="auth-input auth-select"
//                   defaultValue=""
//                 >
//                   <option value="">Choose a skin type…</option>
//                   <option>Normal</option>
//                   <option>Oily</option>
//                   <option>Dry</option>
//                   <option>Combination</option>
//                   <option>Sensitive</option>
//                 </select>
//               </div>
//             )}

//             {mode === "signin" && (
//               <div className="auth-row-between">
//                 <label className="auth-remember">
//                   <input type="checkbox" />
//                   <span>Remember me</span>
//                 </label>
//                 <button
//                   type="button"
//                   className="auth-link-button"
//                   onClick={() =>
//                     alert("Password reset isn’t wired yet — front-end only 🙂")
//                   }
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             )}

//             <button type="submit" className="auth-submit">
//               {mode === "signin" ? "Continue to SkinSense" : "Create my account"}
//             </button>

//             <p className="auth-footnote">
//               By continuing, you agree to our{" "}
//               <span className="auth-footnote-link">Terms</span> and{" "}
//               <span className="auth-footnote-link">Privacy Policy</span>.
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================
//    MAIN APP
//    ============================ */

// const App = () => {
//   const [isAuthed, setIsAuthed] = useState(false);

//   const [activeSection, setActiveSection] = useState("capture");
//   const sectionRefs = useRef({});

//   const [userFilters, setUserFilters] = useState({
//     gender: "",
//     ageRange: "",
//     skinType: "",
//     healthIssue: "",
//   });

//   useEffect(() => {
//     if (!isAuthed) return; // only run observer once main UI is visible

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
//         if (visible[0]) {
//           const id = visible[0].target.getAttribute("data-id");
//           if (id) setActiveSection(id);
//         }
//       },
//       {
//         root: null,
//         threshold: 0.35,
//       }
//     );

//     Object.values(sectionRefs.current).forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, [isAuthed]);

//   const handleScrollTo = (id) => {
//     const el = sectionRefs.current[id];
//     if (!el) return;
//     el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const handleFilterChange = (field) => (e) => {
//     setUserFilters((prev) => ({
//       ...prev,
//       [field]: e.target.value,
//     }));
//   };

//   // ============================
//   // FIRST SCREEN: AUTH
//   // ============================
//   if (!isAuthed) {
//     return <AuthScreen onAuthenticated={() => setIsAuthed(true)} />;
//   }

//   // ============================
//   // AFTER LOGIN: EXISTING FLOW
//   // ============================
//   return (
//     <div className="app">
//       {/* Top Navigation */}
//       <header className="top-nav">
//         <div className="brand" onClick={() => handleScrollTo("capture")}>
//           <span className="brand-mark">◎</span>
//           <span className="brand-text">
//             SkinSense<span className="brand-ai">AI</span>
//           </span>
//         </div>

//         <nav className="nav-links">
//           {SECTIONS.slice(0, -1).map((section) => (
//             <button
//               key={section.id}
//               className={
//                 "nav-link" +
//                 (activeSection === section.id ? " nav-link-active" : "")
//               }
//               onClick={() => handleScrollTo(section.id)}
//             >
//               {section.label}
//             </button>
//           ))}
//         </nav>

//         <button className="nav-cta" onClick={() => handleScrollTo("capture")}>
//           Try the Demo
//         </button>
//       </header>

//       {/* Scrollable main content */}
//       <main className="scroll-container">
//         {/* HERO SECTION */}
//         <section
//           className="section hero"
//           data-id="capture"
//           ref={(el) => (sectionRefs.current["capture"] = el)}
//         >
//           <div className="section-inner hero-layout">
//             {/* LEFT: copy + upload + filters */}
//             <div className="section-text">
//               <p className="floating-label floating-label-large">
//                 Upload. Analyze. Glow.
//               </p>
//               <h1 className="hero-title">
//                 Let AI read your skin —
//                 <span className="hero-highlight">
//                   <br />
//                   and build a routine that makes sense.
//                 </span>
//               </h1>
//               <p className="hero-subtitle">
//                 SkinSense AI turns a simple selfie into a full skincare journey:
//                 analysis, triggers, routine, products, and prices — all on one
//                 page.
//               </p>

//               <div className="hero-actions">
//                 <button className="primary-btn">
//                   📸 Upload / Capture Photo
//                 </button>
//                 <button
//                   className="secondary-btn"
//                   onClick={() => handleScrollTo("analysis")}
//                 >
//                   See How It Works ↓
//                 </button>
//               </div>

//               {/* User filters form */}
//               <div className="user-form">
//                 <p className="form-caption">
//                   Tell us a bit more so we can personalize your routine:
//                 </p>
//                 <div className="form-grid">
//                   <div className="form-field">
//                     <label htmlFor="gender">Gender</label>
//                     <select
//                       id="gender"
//                       value={userFilters.gender}
//                       onChange={handleFilterChange("gender")}
//                     >
//                       <option value="">Select gender</option>
//                       <option value="female">Female</option>
//                       <option value="male">Male</option>
//                       <option value="nonbinary">Non-binary</option>
//                       <option value="prefer-not">Prefer not to say</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="ageRange">Age</label>
//                     <select
//                       id="ageRange"
//                       value={userFilters.ageRange}
//                       onChange={handleFilterChange("ageRange")}
//                     >
//                       <option value="">Select age range</option>
//                       <option value="under18">Under 18</option>
//                       <option value="18-24">18–24</option>
//                       <option value="25-34">25–34</option>
//                       <option value="35-44">35–44</option>
//                       <option value="45plus">45+</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="skinType">Skin Type</label>
//                     <select
//                       id="skinType"
//                       value={userFilters.skinType}
//                       onChange={handleFilterChange("skinType")}
//                     >
//                       <option value="">Select skin type</option>
//                       <option value="normal">Normal</option>
//                       <option value="oily">Oily</option>
//                       <option value="dry">Dry</option>
//                       <option value="combo">Combination</option>
//                       <option value="sensitive">Sensitive</option>
//                       <option value="not-sure">Not sure</option>
//                     </select>
//                   </div>

//                   <div className="form-field">
//                     <label htmlFor="healthIssue">Health Problems</label>
//                     <select
//                       id="healthIssue"
//                       value={userFilters.healthIssue}
//                       onChange={handleFilterChange("healthIssue")}
//                     >
//                       <option value="">Select an option</option>
//                       <option value="none">None</option>
//                       <option value="acne">Acne</option>
//                       <option value="eczema">Eczema</option>
//                       <option value="rosacea">Rosacea</option>
//                       <option value="pcos">PCOS / hormonal</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="hero-pills">
//                 <span className="pill">Non-medical insights</span>
//                 <span className="pill">Ingredient-safe routines</span>
//                 <span className="pill">Price-aware suggestions</span>
//               </div>
//             </div>

//             {/* RIGHT: hero product card */}
//             <div className="hero-product-card">
//               <div className="hero-product-header">
//                 <span className="hero-product-pill">
//                   Purifying Exfoliating Gel
//                 </span>
//                 <span className="hero-product-code">
//                   For oily / acne-prone skin
//                 </span>
//               </div>

//               <div className="hero-product-body">
//                 <div className="hero-product-image-wrap">
//                   <div className="hero-product-circle" />
//                   <div className="hero-product-bottle" />
//                 </div>

//                 <div className="hero-product-specs">
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Rating</span>
//                     <span className="hero-spec-value">4.8</span>
//                     <span className="hero-spec-sub">+2.1k reviews</span>
//                   </div>
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Volume</span>
//                     <span className="hero-spec-value">150 ml</span>
//                     <span className="hero-spec-sub">Daily, gentle use</span>
//                   </div>
//                   <div className="hero-spec">
//                     <span className="hero-spec-label">Focus</span>
//                     <span className="hero-spec-value">Texture</span>
//                     <span className="hero-spec-sub">Smooth & refine</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="hero-product-footer">
//                 <button className="hero-ghost-btn">
//                   See routine with this product
//                 </button>
//                 <span className="hero-product-price">Est. $26–32 CAD</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* OTHER SECTIONS */}
//         {SECTIONS.filter((s) => s.id !== "capture").map((section) => (
//           <section
//             key={section.id}
//             className={
//               "section feature" +
//               (activeSection === section.id ? " section-active" : "")
//             }
//             data-id={section.id}
//             ref={(el) => (sectionRefs.current[section.id] = el)}
//           >
//             <div className="section-inner">
//               {/* Left: text */}
//               <div className="section-text">
//                 <p className="floating-label">
//                   {section.label} · {section.tag}
//                 </p>
//                 <h2 className="section-title">
//                   {section.title}{" "}
//                   <span className="section-accent">{section.accent}</span>
//                 </h2>
//                 <p className="section-blurb">{section.blurb}</p>

//                 <ul className="bullet-list">
//                   {section.bullets.map((item) => (
//                     <li key={item} className="bullet-item">
//                       <span className="bullet-dot" /> {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Right: visuals per section */}
//               <div className="section-visual">
//                 {section.id === "analysis" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Skin Map</h3>
//                     <div className="viz-bars">
//                       <div className="viz-bar">
//                         <span>Acne</span>
//                         <div className="viz-bar-fill w-70" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Redness</span>
//                         <div className="viz-bar-fill w-40" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Oiliness</span>
//                         <div className="viz-bar-fill w-85" />
//                       </div>
//                       <div className="viz-bar">
//                         <span>Dryness</span>
//                         <div className="viz-bar-fill w-20" />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "summary" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Skin Summary</h3>
//                     <p className="viz-paragraph">
//                       “Your skin appears moderately oily with mild inflammation
//                       around the cheeks. Stress and low sleep might be
//                       contributing to congestion.”
//                     </p>
//                     <div className="viz-tags-row">
//                       <span>⚡ Stress</span>
//                       <span>💤 Sleep</span>
//                       <span>🩹 Barrier support</span>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "routine" && (
//                   <div className="viz-card two-col">
//                     <div>
//                       <h3 className="viz-title">AM Routine</h3>
//                       <ol className="routine-list">
//                         <li>Gentle gel cleanser</li>
//                         <li>Antioxidant serum</li>
//                         <li>Oil-free moisturizer</li>
//                         <li>SPF 30+ sunscreen</li>
//                       </ol>
//                     </div>
//                     <div>
//                       <h3 className="viz-title">PM Routine</h3>
//                       <ol className="routine-list">
//                         <li>Oil-based cleanse</li>
//                         <li>Water-based cleanse</li>
//                         <li>Niacinamide serum</li>
//                         <li>Barrier repair cream</li>
//                       </ol>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "products" && (
//                   <div className="viz-card product-results-card">
//                     <h3 className="viz-title">Matched Products (Web Results)</h3>

//                     <div className="product-grid">
//                       <div className="product-card">
//                         <div className="product-image">
//                           <div className="product-thumb product-thumb-1" />
//                         </div>
//                         <div className="product-meta">
//                           <p className="product-name">
//                             CeraVe Foaming Facial Cleanser
//                           </p>
//                           <p className="product-detail">
//                             For oily / combo skin · niacinamide, ceramides,
//                             non-comedogenic.
//                           </p>
//                           <div className="product-store-row">
//                             <span>Walmart</span>
//                             <span className="product-price">$13.97</span>
//                           </div>
//                           <div className="product-store-row">
//                             <span>Amazon.ca</span>
//                             <span className="product-price">$15.49</span>
//                           </div>
//                           <span className="product-tag">
//                             Best price: Walmart
//                           </span>
//                         </div>
//                       </div>

//                       <div className="product-card">
//                         <div className="product-image">
//                           <div className="product-thumb product-thumb-2" />
//                         </div>
//                         <div className="product-meta">
//                           <p className="product-name">
//                             La Roche-Posay Toleriane Sensitive Cream
//                           </p>
//                           <p className="product-detail">
//                             For redness & barrier repair · minimalist formula,
//                             fragrance-free.
//                           </p>
//                           <div className="product-store-row">
//                             <span>Shoppers Drug Mart</span>
//                             <span className="product-price">$28.99</span>
//                           </div>
//                           <div className="product-store-row">
//                             <span>Sephora</span>
//                             <span className="product-price">$27.00</span>
//                           </div>
//                           <span className="product-tag product-tag-alt">
//                             Best match: Sensitive skin
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="search-note">
//                       *In the full version, these cards would be auto-filled from
//                       live web scraping / retail APIs.
//                     </p>
//                   </div>
//                 )}

//                 {section.id === "filters" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Filter & Compare</h3>
//                     <div className="filter-row">
//                       <button className="filter-pill">Budget</button>
//                       <button className="filter-pill">Fragrance-free</button>
//                       <button className="filter-pill">Acne-safe</button>
//                       <button className="filter-pill">Barrier repair</button>
//                     </div>
//                     <div className="price-table">
//                       <div className="price-row price-header">
//                         <span>Store</span>
//                         <span>Price (CAD)</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Walmart</span>
//                         <span>$13.97</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Shoppers</span>
//                         <span>$18.99</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Amazon.ca</span>
//                         <span>$15.49</span>
//                       </div>
//                       <div className="price-row">
//                         <span>Sephora</span>
//                         <span>$17.00</span>
//                       </div>
//                       <div className="price-row price-best">
//                         <span>Best price</span>
//                         <span>Walmart · $13.97</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "stores" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Nearby Availability</h3>
//                     <div className="map-placeholder">
//                       <div className="map-pin">📍</div>
//                       <p className="map-caption">
//                         Show closest stores with your cleanser, moisturizer, and
//                         sunscreen in stock.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {section.id === "cta" && (
//                   <div className="viz-card">
//                     <h3 className="viz-title">Demo-Ready Flow</h3>
//                     <p className="viz-paragraph">
//                       Scroll once, tell the story: upload, analyze, explain,
//                       routine, products, price. Every section is visually clear
//                       and judge-friendly.
//                     </p>
//                     <button
//                       className="primary-btn full-width"
//                       onClick={() => handleScrollTo("capture")}
//                     >
//                       Run the Full Flow from the Top ↑
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default App;

// frontend/src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { fileToBase64, generateRecommendationBundle } from "./api/skinsense";

/* =======================
   STEP METADATA (AFTER GENERATE)
   ======================= */

const SECTIONS = [
  {
    id: "analysis",
    label: "Step 1",
    title: "AI Skin Analysis + Story",
    accent: "Map + Human Summary",
    blurb:
      "We scan your selfie for acne, redness, oiliness and dryness, then turn that into a clear explanation of how your skin is behaving today.",
    bullets: [
      "Acne, redness, oiliness & dryness detection",
      "Texture & pore visibility insights",
      "Barrier health patterns (non-medical)",
      "Plain-language explanation you can actually use",
      "Highlights probable lifestyle triggers like stress & sleep",
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

  // Store uploaded image as base64
  const [imageBase64, setImageBase64] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Store API response data
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Basic validation: check file type
      if (!file.type.startsWith("image/")) {
        setApiError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setApiError(
          "Image is too large. Please upload an image smaller than 10MB."
        );
        return;
      }

      try {
        // Convert to base64 and store
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
        setUploadedFile(file);
        setHasUploadedImage(true);
        setApiError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error converting image:", error);
        setApiError("Failed to process image. Please try again.");
      }
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

  const handleGeneratePlan = async () => {
    if (!canStartFlow || isGenerating || !imageBase64) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      // Map frontend form data to backend lifestyle format
      const lifestyle = {
        cycle_phase: "unknown", // Default, can be enhanced later
        sleep_hours: 7, // Default
        hydration_cups: 6, // Default
        stress_level:
          userFilters.intensity !== null
            ? Math.min(5, Math.max(1, userFilters.intensity + 1)) // Map 0-4 to 1-5
            : 3,
        mood: 3, // Default
      };

      // Call the backend API - imageBase64 is now { base64, mimeType } object
      const response = await generateRecommendationBundle(
        imageBase64, // This is now { base64, mimeType } from fileToBase64
        lifestyle
      );

      // Store the response
      setApiData(response);
      setHasGeneratedPlan(true);

      // Scroll to results
      setTimeout(() => {
        handleScrollTo("analysis");
      }, 100);
    } catch (error) {
      console.error("Error generating plan:", error);
      const errorMessage =
        error.message || "Failed to generate skincare plan. Please try again.";

      // Check if it's a face validation error from backend
      if (errorMessage.includes("face") || errorMessage.includes("Face")) {
        setApiError(
          "Please upload a clear photo of your face. The image you uploaded doesn't appear to contain a face."
        );
      } else {
        setApiError(errorMessage);
      }
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

        <button className="nav-cta" onClick={() => handleScrollTo("capture")}>
          Start Scan
        </button>
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
            <p className="landing-tag">Welcome</p>
            <h1 className="landing-title">
              Your skin, decoded in under a minute.
            </h1>
            <p className="landing-subtitle">
              SkinSense AI turns a simple selfie into a full story: mapped
              concerns, personalized routines, product matches, and where to buy
              — all without medical language or overwhelm.
            </p>

            <ul className="landing-points">
              <li>Upload a selfie + quick skin profile</li>
              <li>See your AI skin map &amp; plain-language summary</li>
              <li>Get AM/PM routines, products, and nearby stores</li>
            </ul>

            <button
              type="button"
              className="primary-btn landing-cta"
              onClick={() => handleScrollTo("capture")}
            >
              Start my scan
            </button>

            <button
              type="button"
              className="landing-scroll-hint"
              onClick={() => handleScrollTo("capture")}
            >
              Scroll to begin ↓
            </button>
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
                  Generate my skin care plan
                </button>

                {isGenerating && (
                  <div className="generate-spinner-wrap">
                    <div className="circle-spinner" />
                    <p className="spinner-label">Preparing your results…</p>
                  </div>
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

                <div className="hero-pills">
                  <span className="pill">Non-medical insights</span>
                  <span className="pill">Ingredient-safe routines</span>
                  <span className="pill">Price-aware suggestions</span>
                </div>
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
                  <h2 className="section-title">
                    {section.title}{" "}
                    <span className="section-accent">{section.accent}</span>
                  </h2>
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
                          <div
                            className="viz-bar-fill"
                            style={{
                              width: apiData?.skin_profile?.skin_analysis?.acne
                                ? `${
                                    apiData.skin_profile.skin_analysis.acne ===
                                    "none"
                                      ? 0
                                      : apiData.skin_profile.skin_analysis
                                          .acne === "mild"
                                      ? 25
                                      : apiData.skin_profile.skin_analysis
                                          .acne === "moderate"
                                      ? 50
                                      : 75
                                  }%`
                                : "0%",
                            }}
                          />
                        </div>
                        <div className="viz-bar">
                          <span>Redness</span>
                          <div
                            className="viz-bar-fill"
                            style={{
                              width: apiData?.skin_profile?.skin_analysis
                                ?.redness
                                ? `${
                                    apiData.skin_profile.skin_analysis
                                      .redness === "none"
                                      ? 0
                                      : apiData.skin_profile.skin_analysis
                                          .redness === "mild"
                                      ? 25
                                      : apiData.skin_profile.skin_analysis
                                          .redness === "moderate"
                                      ? 50
                                      : 75
                                  }%`
                                : "0%",
                            }}
                          />
                        </div>
                        <div className="viz-bar">
                          <span>Oiliness</span>
                          <div
                            className="viz-bar-fill"
                            style={{
                              width: apiData?.skin_profile?.skin_analysis
                                ?.oiliness
                                ? `${
                                    apiData.skin_profile.skin_analysis
                                      .oiliness === "none"
                                      ? 0
                                      : apiData.skin_profile.skin_analysis
                                          .oiliness === "mild"
                                      ? 25
                                      : apiData.skin_profile.skin_analysis
                                          .oiliness === "moderate"
                                      ? 50
                                      : 75
                                  }%`
                                : "0%",
                            }}
                          />
                        </div>
                        <div className="viz-bar">
                          <span>Dryness</span>
                          <div
                            className="viz-bar-fill"
                            style={{
                              width: apiData?.skin_profile?.skin_analysis
                                ?.dryness
                                ? `${
                                    apiData.skin_profile.skin_analysis
                                      .dryness === "none"
                                      ? 0
                                      : apiData.skin_profile.skin_analysis
                                          .dryness === "mild"
                                      ? 25
                                      : apiData.skin_profile.skin_analysis
                                          .dryness === "moderate"
                                      ? 50
                                      : 75
                                  }%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>

                      <div className="viz-divider" />

                      <h3 className="viz-title">Skin Summary</h3>
                      <p className="viz-paragraph">
                        {apiData?.skin_profile?.skin_analysis
                          ?.non_medical_summary ||
                          "Your skin appears moderately oily with mild inflammation around the cheeks. Stress and low sleep might be contributing to congestion."}
                      </p>
                      <div className="viz-tags-row">
                        {apiData?.skin_profile?.skin_analysis?.probable_triggers
                          ?.slice(0, 3)
                          .map((trigger, idx) => (
                            <span key={idx}>{trigger}</span>
                          )) || (
                          <>
                            <span>⚡ Stress</span>
                            <span>💤 Sleep</span>
                            <span>🩹 Barrier support</span>
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
                        {apiData?.recommended_products
                          ?.slice(0, 6)
                          .map((product, idx) => {
                            const priceData = apiData?.price_comparisons?.find(
                              (pc) => pc.product_name === product.name
                            );
                            const cheapestPrice = priceData?.prices
                              ?.filter((p) => p.price !== null)
                              ?.sort(
                                (a, b) =>
                                  (a.price ?? Infinity) - (b.price ?? Infinity)
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
                                    <div
                                      className={`product-thumb product-thumb-${
                                        (idx % 2) + 1
                                      }`}
                                    />
                                  )}
                                </div>
                                <div className="product-meta">
                                  <p className="product-name">{product.name}</p>
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
                                </div>
                              </div>
                            );
                          }) || (
                          <>
                            <div className="product-card">
                              <div className="product-image">
                                <div className="product-thumb product-thumb-1" />
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
