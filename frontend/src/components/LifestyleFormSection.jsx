import React from "react";
import Section from "./Section";

const LifestyleFormSection = ({ id, lifestyle, onLifestyleChange }) => {
  const handleChange = (field, value) => {
    onLifestyleChange({
      ...lifestyle,
      [field]: value,
    });
  };

  return (
    <Section
      id={id}
      step="02"
      eyebrow="Context"
      title="Layer in your lifestyle and cycle data."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 text-sm text-skinDeep/85">
          <p>
            Skin isn’t just about products. We quietly blend image signals with
            your sleep, stress, hormonal phase, and environment to guess likely
            triggers — without judging you for late-night study sessions.
          </p>
          <p>
            In a full build, this data would be fed into Gemini Text along with
            your skin map to reason about stress, dehydration, and cycle
            correlations.
          </p>
        </div>

        <div className="bg-skinBg/70 rounded-2xl border border-skinSand/60 p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="flex justify-between mb-1">
              <span>Average sleep per night</span>
              <span className="text-skinDeep/60">
                {lifestyle.sleepHours} hrs
              </span>
            </label>
            <input
              type="range"
              min="4"
              max="9"
              step="1"
              value={lifestyle.sleepHours}
              onChange={(e) =>
                handleChange("sleepHours", Number(e.target.value))
              }
              className="w-full accent-skinOlive"
            />
          </div>

          <div>
            <label className="flex justify-between mb-1">
              <span>Water intake</span>
              <span className="text-skinDeep/60">
                {lifestyle.waterGlasses} glasses/day
              </span>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={lifestyle.waterGlasses}
              onChange={(e) =>
                handleChange("waterGlasses", Number(e.target.value))
              }
              className="w-full accent-skinOlive"
            />
          </div>

          <div>
            <label className="block mb-1">Stress level</label>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange("stressLevel", level)}
                  className={`flex-1 px-3 py-1.5 rounded-full border text-xs capitalize ${
                    lifestyle.stressLevel === level
                      ? "bg-skinOlive text-white border-skinOlive"
                      : "bg-white/80 text-skinDeep border-skinSand/70 hover:bg-skinSage/30"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1">Cycle phase</label>
            <select
              value={lifestyle.cyclePhase}
              onChange={(e) => handleChange("cyclePhase", e.target.value)}
              className="w-full px-3 py-2 rounded-full border border-skinSand/70 bg-white/80 text-xs"
            >
              <option value="follicular">Follicular</option>
              <option value="ovulation">Ovulation</option>
              <option value="luteal">Luteal</option>
              <option value="menstrual">Menstrual</option>
              <option value="not-tracking">Not tracking</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Environment</label>
            <select
              value={lifestyle.pollutionExposure}
              onChange={(e) =>
                handleChange("pollutionExposure", e.target.value)
              }
              className="w-full px-3 py-2 rounded-full border border-skinSand/70 bg-white/80 text-xs"
            >
              <option value="low">Mostly indoors / low pollution</option>
              <option value="medium">
                Mix of campus, transit, and outdoor time
              </option>
              <option value="high">
                High pollution / dry air / constant heating or AC
              </option>
            </select>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LifestyleFormSection;
