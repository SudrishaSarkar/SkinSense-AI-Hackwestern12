// frontend/src/components/ImageUpload.tsx
import React, { useState } from "react";

const ImageUpload: React.FC = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file); // gives us data:image/jpeg;base64,...
  };

  const handleAnalyzeClick = async () => {
    if (!imageDataUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract mimeType + base64 from data URL
      const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
      if (!match) {
        throw new Error("Invalid image data URL format");
      }

      const mimeType = match[1];
      const imageBase64 = match[2];

      const lifestyle = {
        cycle_phase: "unknown", // you can wire real form inputs later
        sleep_hours: 7,
        hydration_cups: 6,
        stress_level: 3,
        mood: 3,
      };

      const response = await fetch(
        "http://localhost:8787/api/recommendation-bundle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64,
            mimeType,
            lifestyle,
          }),
        }
      );

      const data = await response.json();
      console.log("Recommendation bundle:", data);

      if (!response.ok) {
        throw new Error(data.error || "Backend error");
      }

      // TODO: lift this into state / context to render skin analysis,
      // routine, product list + price comparisons in the UI.
      alert("Analysis complete! Check the console for full response.");
    } catch (err: any) {
      console.error("Analyze failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Upload your skin selfie</h2>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
      />

      {imageDataUrl && (
        <div className="image-preview">
          <h3>Preview:</h3>
          <img
            src={imageDataUrl}
            alt="Skin Selfie"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
          <button onClick={handleAnalyzeClick} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Skin & Get Routine"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
