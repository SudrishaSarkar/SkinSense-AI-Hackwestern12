import React from "react";
import Section from "./Section";
import { priceComparison } from "../data/mockPriceComparison";

const PriceComparisonSection = ({ id }) => {
  return (
    <Section
      id={id}
      step="06"
      eyebrow="Reality Check"
      title="See where your routine is actually cheapest."
    >
      <div className="space-y-4 text-sm text-skinDeep/85">
        <p>
          The magic move: once you love a product, we quietly check a few stores
          in the background and show you where it’s cheapest in CAD. No
          screenshots, no guesswork.
        </p>

        <div className="space-y-4">
          {priceComparison.map((block) => (
            <div
              key={block.productName}
              className="bg-skinBg/70 rounded-2xl border border-skinSand/70 p-4 text-xs"
            >
              <p className="font-semibold text-skinDeep mb-2 text-sm">
                {block.productName}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[0.75rem]">
                  <thead>
                    <tr className="border-b border-skinSand/60">
                      <th className="py-2 pr-4">Store</th>
                      <th className="py-2 pr-4">Price (CAD)</th>
                      <th className="py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, idx) => (
                      <tr
                        key={row.store}
                        className={
                          idx === 0
                            ? "bg-white/70"
                            : "hover:bg-white/40 transition-colors"
                        }
                      >
                        <td className="py-2 pr-4">{row.store}</td>
                        <td className="py-2 pr-4 font-medium">{row.price}</td>
                        <td className="py-2 text-skinDeep/75">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[0.65rem] text-skinDeep/60">
                In the real build, this table would be filled by Walmart /
                Shoppers / Amazon.ca / Sephora APIs or scrapers, refreshed live.
              </p>
            </div>
          ))}
        </div>

        <p className="text-[0.7rem] text-skinDeep/60">
          Extra step for later: a small map card showing which nearby store has
          stock at the best price.
        </p>
      </div>
    </Section>
  );
};

export default PriceComparisonSection;
