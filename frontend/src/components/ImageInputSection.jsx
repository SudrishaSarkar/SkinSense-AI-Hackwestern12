import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";

const ImageInputSection = ({ id, imageDataUrl, onImageChange, onAnalyze }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleWebcamClick = () => {
    // placeholder for now
    alert("Webcam capture coming soon — using browser getUserMedia().");
  };

  return (
    <Section
      id={id}
      step="01"
      eyebrow="Input"
      title="Upload a selfie or capture from webcam."
    >
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4 text-sm text-skinDeep/85">
          <p>
            Start with a clear, front-facing photo in soft, indirect light. We
            use this to detect non-medical patterns like oiliness, redness, and
            texture — then pair it with your lifestyle data.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No flash if possible.</li>
            <li>Remove heavy filters or beauty modes.</li>
            <li>Tie hair back if it covers large parts of your face.</li>
          </ul>
          <p className="text-xs text-skinDeep/70">
            This demo runs entirely in the browser — imagine this being powered
            by Gemini Vision behind the scenes.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-skinSage/80 rounded-2xl bg-skinBg/60 p-4 flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="px-4 py-2 rounded-full bg-skinOlive text-white text-xs sm:text-sm font-medium cursor-pointer hover:bg-skinDeep transition-colors"
            >
              Upload .jpg / .png
            </label>
            <button
              type="button"
              onClick={handleWebcamClick}
              className="text-[0.7rem] sm:text-xs px-3 py-1.5 rounded-full border border-skinOlive/60 text-skinDeep bg-white/70 hover:bg-skinSage/30 transition-colors"
            >
              Use webcam instead
            </button>
            <p className="text-[0.65rem] text-skinDeep/60 text-center max-w-xs">
              In the full version, we’d capture a frame from your webcam and
              send it through the same AI pipeline.
            </p>
          </div>

          {imageDataUrl && (
            <motion.div
              className="mt-3 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-40 h-40 rounded-3xl overflow-hidden border border-skinSand/70 bg-skinBg shadow-soft">
                <img
                  src={imageDataUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={onAnalyze}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-skinOlive text-white text-xs sm:text-sm font-medium shadow-soft hover:bg-skinDeep transition-colors"
              >
                Analyze skin with AI (mock)
              </button>
              <p className="text-[0.65rem] text-skinDeep/60 text-center max-w-xs">
                This triggers a mock Gemini Vision response for now — perfect
                for hackathon demos without a backend.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ImageInputSection;
