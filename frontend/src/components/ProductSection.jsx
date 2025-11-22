import React, { useState, useMemo } from "react";
import Section from "./Section";
import { products } from "../data/mockProducts";

const ProductSection = ({ id, analysis }) => {
  const [priceTier, setPriceTier] = useState("all");
  const [concernFilter, setConcernFilter] = useState("auto");
  const [fragranceFreeOnly, setFragranceFreeOnly] = useState(false);

  const inferredConcern =
    analysis?.acne === "moderate" || analysis?.acne === "high"
      ? "acne"
      : analysis?.redness === "moderate" || analysis?.redness === "high"
      ? "redness"
      : "barrier";

  const activeConcern =
    concernFilter === "auto" ? inferredConcern : concernFilter;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (priceTier !== "all" && p.priceTier !== priceTier) return false;

      if (activeConcern && !p.concernTags.includes(activeConcern)) return false;

      if (fragranceFreeOnly && !p.preferences.includes("fragrance-free"))
        return false;

      return true;
    });
  }, [priceTier, activeConcern, fragranceFreeOnly]);

  return (
    <Section
      id={id}
      step="05"
      eyebrow="Match"
      title="Match ingredients to your skin and your budget."
    >
      <div className="space-y-4 text-sm text-skinDeep/85">
        <p>
          Instead of pushing random trending products, we filter for
          non-comedogenic, barrier-friendly formulas — then let you sort by
          budget and preferences like fragrance-free.
        </p>

        <div className="bg-skinBg/70 rounded-2xl border border-skinSand/60 p-4 space-y-4 text-xs">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="mb-2 font-medium text-skinDeep/80">Budget</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: "all", label: "All" },
                  { id: "$", label: "$ — drugstore" },
                  { id: "$$", label: "$$ — mid" },
                  { id: "$$$", label: "$$$ — premium" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPriceTier(opt.id)}
                    className={`px-3 py-1.5 rounded-full border text-[0.7rem] ${
                      priceTier === opt.id
                        ? "bg-skinOlive text-white border-skinOlive"
                        : "bg-white/80 text-skinDeep border-skinSand/70 hover:bg-skinSage/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-skinDeep/80">Skin concern</p>
              <select
                value={concernFilter}
                onChange={(e) => setConcernFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-full border border-skinSand/70 bg-white/80 text-[0.75rem]"
              >
                <option value="auto">
                  Auto (based on your analysis: {inferredConcern || "neutral"})
                </option>
                <option value="acne">Acne & congestion</option>
                <option value="redness">Redness & sensitivity</option>
                <option value="barrier">Barrier repair</option>
                <option value="texture">Texture & pores</option>
                <option value="sun">Sun protection</option>
              </select>
            </div>

            <div>
              <p className="mb-2 font-medium text-skinDeep/80">
                Preferences & safety
              </p>
              <label className="flex items-center gap-2 text-[0.75rem]">
                <input
                  type="checkbox"
                  checked={fragranceFreeOnly}
                  onChange={(e) => setFragranceFreeOnly(e.target.checked)}
                  className="accent-skinOlive"
                />
                <span>Show fragrance-free only</span>
              </label>
              <p className="text-[0.65rem] text-skinDeep/60 mt-1">
                Full app could add &ldquo;no essential oils&rdquo;,
                &ldquo;fungal-acne safe&rdquo;, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white/80 border border-skinSand/70 rounded-2xl p-4 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-skinDeep text-sm">
                    {p.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-skinBg text-[0.7rem] border border-skinSand/70">
                    {p.priceRange}
                  </span>
                </div>
                <p className="text-skinDeep/80">{p.shortReason}</p>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-skinDeep/60 mb-1">
                    Key ingredients
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.keyIngredients.map((k) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded-full bg-skinSage/70 text-[0.65rem]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-skinDeep/60">
                  Where we&apos;d compare prices
                </p>
                <p className="text-[0.7rem] text-skinDeep/80">
                  {p.stores.join(" • ")}
                </p>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="text-xs text-skinDeep/70 col-span-full">
              No products match this exact combo yet. In a full version, we’d
              widen the filters or suggest ingredient families instead.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ProductSection;

