import React from "react";
import { motion } from "framer-motion";

const Section = ({ id, step, eyebrow, title, children }) => {
  return (
    <section id={id} className="section-container">
      <motion.div
        className="section-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-3">
          {eyebrow && (
            <p className="text-xs tracking-[0.3em] uppercase text-skinDeep/60">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight text-skinDeep">
              {title}
            </h2>
          )}
        </div>

        <div className="mt-4">{children}</div>

        <div className="mt-6 flex justify-end">
          <span className="step-pill">Step {step}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default Section;
