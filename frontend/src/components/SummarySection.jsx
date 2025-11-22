import React from "react";
import Section from "./Section";

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full bg-skinSage/70 text-[0.7rem] font-medium text-skinDeep mr-1 mb-1">
    {children}
  </span>
);

const SummarySection = ({ id, analysis, lifestyle }) => {
  return (
    <Section
      id={id}
      step="03"
      eyebrow="Profile"
      title="Your AI-generated skin snapshot."
    >
      {!analysis ? (
        <div className="text-sm text-skinDeep/75">
          <p>
            Once you’ve uploaded a selfie and tapped{" "}
            <span className="font-medium">“Analyze skin with AI”</span>, this
            section will show a human-readable summary of what the model sees.
          </p>
          <p className="mt-2 text-xs text-skinDeep/60">
            In the real pipeline, Gemini Vision + Text would output structured
            JSON like{" "}
            <span className="font-mono text-[0.7rem]">
              &#123;"acne": "moderate", "redness": "mild"&#125;
            </span>{" "}
            and then we render it like this.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 text-sm">
          <div className="space-y-3">
            <p className="text-skinDeep/85">{analysis.summary}</p>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-skinDeep/60 mb-1">
                Key signals
              </p>
              <div className="flex flex-wrap">
                <Chip>Acne: {analysis.acne}</Chip>
                <Chip>Redness: {analysis.redness}</Chip>
                <Chip>Oiliness: {analysis.oiliness}</Chip>
                <Chip>Dryness: {analysis.dryness}</Chip>
                {analysis.textureNotes.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-skinDeep/60 mb-1">
                Probable triggers
              </p>
              <div className="flex flex-wrap">
                {analysis.probableTriggers.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-skinBg/70 rounded-2xl border border-skinSand/70 p-4 space-y-2 text-xs">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-skinDeep/60">
              How we’d phrase it to you
            </p>
            <p className="text-skinDeep/80">
              Your skin appears{" "}
              <span className="font-medium">moderately oily</span> with{" "}
              <span className="font-medium">mild inflammation</span>. The
              combination of{" "}
              <span className="font-medium">{lifestyle.stressLevel}</span>{" "}
              stress, about{" "}
              <span className="font-medium">
                {lifestyle.sleepHours} hours of sleep
              </span>{" "}
              nightly, and your current{" "}
              <span className="font-medium">
                {lifestyle.cyclePhase.replace("-", " ")} phase
              </span>{" "}
              may be nudging your barrier a bit out of balance.
            </p>
            <p className="text-skinDeep/70">
              We’ll build your routine around calming redness, keeping pores
              clear, and slowly strengthening your barrier instead of
              over-exfoliating it.
            </p>
          </div>
        </div>
      )}
    </Section>
  );
};

export default SummarySection;
