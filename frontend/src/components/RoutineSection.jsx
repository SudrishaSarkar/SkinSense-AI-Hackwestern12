import React from "react";
import Section from "./Section";

const RoutineColumn = ({ title, emoji, items }) => (
  <div className="bg-white/80 border border-skinSand/70 rounded-2xl p-4 space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <h3 className="text-sm font-semibold text-skinDeep">{title}</h3>
    </div>
    <ul className="list-disc pl-4 text-xs text-skinDeep/85 space-y-1">
      {items.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ul>
  </div>
);

const RoutineSection = ({ id, analysis, routine, onGenerateRoutine }) => {
  const disabled = !analysis;

  return (
    <Section
      id={id}
      step="04"
      eyebrow="Routine"
      title="Turn insights into a gentle AM/PM routine."
    >
      <div className="space-y-4 text-sm text-skinDeep/85">
        <p>
          We turn your skin profile into a structured routine — not a 10-step
          chaos ritual. Just enough actives to work, with built-in barrier
          protection and patch test reminders.
        </p>

        <button
          type="button"
          onClick={onGenerateRoutine}
          disabled={disabled}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-soft ${
            disabled
              ? "bg-skinOlive/30 text-skinDeep/60 cursor-not-allowed"
              : "bg-skinOlive text-white hover:bg-skinDeep transition-colors"
          }`}
        >
          {disabled ? "Run skin analysis first" : "Generate AM / PM routine"}
        </button>

        {routine && (
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 mt-2">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-skinDeep/60">
                Goals
              </p>
              <div className="flex flex-wrap gap-2">
                {routine.goals.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-skinSage/70 text-[0.7rem] font-medium text-skinDeep"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <RoutineColumn title="AM Routine" emoji="☀️" items={routine.am} />
                <RoutineColumn title="PM Routine" emoji="🌙" items={routine.pm} />
              </div>
            </div>

            <div className="bg-skinBg/70 rounded-2xl border border-skinSand/60 p-4 text-xs space-y-2">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-skinDeep/60">
                Safety notes
              </p>
              <p className="text-skinDeep/80">{routine.usageNotes}</p>
              <ul className="list-disc pl-4 text-skinDeep/75 space-y-1">
                <li>
                  This is{" "}
                  <span className="font-medium">
                    non-medical skincare guidance
                  </span>{" "}
                  only.
                </li>
                <li>Stop any product that stings, burns, or itches badly.</li>
                <li>
                  When in doubt, talk to a dermatologist — especially for severe
                  acne or sudden changes.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default RoutineSection;
