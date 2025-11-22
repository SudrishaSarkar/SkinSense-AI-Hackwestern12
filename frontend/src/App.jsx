import React, { useState } from "react";
import Navbar from "./components/Navbar";
import StepSidebar from "./components/StepSidebar";
import Hero from "./components/Hero";
import ImageInputSection from "./components/ImageInputSection";
import LifestyleFormSection from "./components/LifestyleFormSection";
import SummarySection from "./components/SummarySection";
import RoutineSection from "./components/RoutineSection";
import ProductSection from "./components/ProductSection";
import PriceComparisonSection from "./components/PriceComparisonSection";

import { mockAnalysis } from "./data/mockAnalysis";
import { mockRoutine } from "./data/mockRoutine";

const defaultLifestyle = {
  sleepHours: 6,
  waterGlasses: 4,
  stressLevel: "medium",
  cyclePhase: "follicular",
  pollutionExposure: "medium",
};

function App() {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [lifestyle, setLifestyle] = useState(defaultLifestyle);
  const [analysis, setAnalysis] = useState(null);
  const [routine, setRoutine] = useState(null);

  const handleAnalyze = () => {
    const a = mockAnalysis(imageDataUrl, lifestyle);
    setAnalysis(a);
    setRoutine(null);
    // you can later swap mockAnalysis with real API call
  };

  const handleGenerateRoutine = () => {
    if (!analysis) return;
    const r = mockRoutine(analysis, lifestyle);
    setRoutine(r);
  };

  return (
    <div className="min-h-screen bg-skinBg relative">
      <Navbar />
      <StepSidebar />
      <main className="pt-28 pb-16 space-y-10">
        <Hero />
        <ImageInputSection
          id="step-1"
          imageDataUrl={imageDataUrl}
          onImageChange={setImageDataUrl}
          onAnalyze={handleAnalyze}
        />
        <LifestyleFormSection
          id="step-2"
          lifestyle={lifestyle}
          onLifestyleChange={setLifestyle}
        />
        <SummarySection
          id="step-3"
          analysis={analysis}
          lifestyle={lifestyle}
        />
        <RoutineSection
          id="step-4"
          analysis={analysis}
          routine={routine}
          onGenerateRoutine={handleGenerateRoutine}
        />
        <ProductSection id="step-5" analysis={analysis} />
        <PriceComparisonSection id="step-6" />
      </main>
    </div>
  );
}

export default App;



// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-skinBg text-skinDeep">
//       <h1 className="text-3xl font-bold">If you see this, React works 🎉</h1>
//     </div>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// // 🚫 Temporarily comment these out
// // import StepSidebar from "./components/StepSidebar";
// // import ImageInputSection from "./components/ImageInputSection";
// // import LifestyleFormSection from "./components/LifestyleFormSection";
// // import SummarySection from "./components/SummarySection";
// // import RoutineSection from "./components/RoutineSection";
// // import ProductSection from "./components/ProductSection";
// // import PriceComparisonSection from "./components/PriceComparisonSection";

// // import { mockAnalysis } from "./data/mockAnalysis";
// // import { mockRoutine } from "./data/mockRoutine";

// function App() {
//   return (
//     <div className="min-h-screen bg-skinBg relative">
//       <Navbar />
//       <main className="pt-28 pb-16 space-y-10">
//         <Hero />
//         {/* all other sections are temporarily removed */}
//       </main>
//     </div>
//   );
// }

// export default App;
