import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="section-container pt-4">
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-skinDeep/60">
            Skin • AI • Routine
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-skinDeep">
            Upload a selfie.  
            <span className="block text-skinOlive">
              Leave with a smarter routine.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-skinDeep/80 max-w-xl">
            SkinSense turns a single photo into a gentle, ingredient-safe routine
            — comparing affordable and premium options, without pretending to be
            a doctor.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#step-1"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-skinOlive text-white text-sm font-medium shadow-soft hover:bg-skinDeep transition-colors"
            >
              Start skin scan
            </a>
            <a
              href="#step-5"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-skinOlive/50 text-skinDeep text-sm bg-white/60 hover:bg-skinSage/30 transition-colors"
            >
              Skip to products
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-b from-skinSage/60 via-skinBg to-skinSand/70 shadow-soft border border-skinSand/60 flex items-center justify-center">
            <div className="w-32 h-40 rounded-full border-[3px] border-skinDeep/50 relative bg-skinBg/80">
              <div className="absolute inset-x-4 top-10 h-1.5 rounded-full bg-skinOlive/70" />
              <div className="absolute inset-x-6 top-16 h-1.5 rounded-full bg-skinOlive/40" />
              <div className="absolute inset-x-8 top-22 h-1.5 rounded-full bg-skinOlive/30" />
              <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.25em] text-skinDeep/70">
                AI Skin Map
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
