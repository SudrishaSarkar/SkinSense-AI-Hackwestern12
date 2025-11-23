/**
 * Script to list available Gemini models
 * Run with: node list-models.js
 */

const GEMINI_API_KEY = "AIzaSyAri4wEAtwQCjKhF4wDKjKMKFZs4xCaU2c";

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    console.log("🔍 Fetching available models...");
    console.log(`URL: ${url}\n`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      console.error(errorText);
      return;
    }

    const data = await response.json();
    
    console.log("✅ Available Models:\n");
    console.log("=".repeat(80));
    
    if (data.models && Array.isArray(data.models)) {
      // Group by model family
      const modelsByFamily = {};
      
      data.models.forEach((model) => {
        const name = model.name || "Unknown";
        const displayName = model.displayName || name;
        const description = model.description || "";
        const supportedMethods = model.supportedGenerationMethods || [];
        const inputTokenLimit = model.inputTokenLimit || "N/A";
        const outputTokenLimit = model.outputTokenLimit || "N/A";
        
        // Extract family name (e.g., "gemini-1.5-flash" -> "gemini-1.5")
        const familyMatch = name.match(/^(gemini-[^-]+)/);
        const family = familyMatch ? familyMatch[1] : "other";
        
        if (!modelsByFamily[family]) {
          modelsByFamily[family] = [];
        }
        
        modelsByFamily[family].push({
          name,
          displayName,
          description,
          supportedMethods,
          inputTokenLimit,
          outputTokenLimit,
        });
      });
      
      // Print grouped models
      Object.keys(modelsByFamily).sort().forEach((family) => {
        console.log(`\n📦 ${family.toUpperCase()}`);
        console.log("-".repeat(80));
        
        modelsByFamily[family].forEach((model) => {
          console.log(`\n  Model: ${model.name}`);
          console.log(`  Display Name: ${model.displayName}`);
          if (model.description) {
            console.log(`  Description: ${model.description}`);
          }
          console.log(`  Supported Methods: ${model.supportedMethods.join(", ")}`);
          console.log(`  Input Tokens: ${model.inputTokenLimit}`);
          console.log(`  Output Tokens: ${model.outputTokenLimit}`);
          
          // Highlight if it supports generateContent (what we need)
          if (model.supportedMethods.includes("generateContent")) {
            console.log(`  ✅ Supports generateContent (can be used for vision)`);
          }
        });
      });
      
      // Summary
      console.log("\n" + "=".repeat(80));
      console.log("\n📊 Summary:");
      console.log(`Total models: ${data.models.length}`);
      
      const visionModels = data.models.filter((m) =>
        m.supportedGenerationMethods?.includes("generateContent")
      );
      console.log(`Models with generateContent: ${visionModels.length}`);
      
      console.log("\n💡 Recommended models for vision (free tier):");
      const freeTierModels = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro-vision",
      ];
      
      freeTierModels.forEach((modelName) => {
        const found = data.models.find((m) => m.name === modelName);
        if (found) {
          console.log(`  ✅ ${modelName} - Available`);
        } else {
          console.log(`  ❌ ${modelName} - Not found`);
        }
      });
    } else {
      console.log("No models found or unexpected response format");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error listing models:", error);
  }
}

listModels();

