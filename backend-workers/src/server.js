const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// --- Middleware ---
// Allow requests from your frontend (which runs on a different port)
app.use(cors());
// Allow express to read JSON from the request body
// We set a high limit to accept the large base64 image string
app.use(bodyParser.json({ limit: "50mb" }));

/**
 * --- API Endpoint for Image Analysis ---
 * This is the URL your frontend will send the image to.
 * It listens for POST requests at /api/analyze
 */
app.post("/api/analyze", (req, res) => {
  // The base64 image and user filters are in the request body
  const { image, filters } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image data received." });
  }

  // The 'image' variable now holds the base64 string.
  // It looks something like: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...'
  console.log("Image received on the backend!");
  console.log("User filters:", filters);

  // --- AI Model Processing Would Happen Here ---
  // For now, we'll just send back a mock success response
  // that matches the structure of your UI.
  const mockResult = {
    summary:
      "Based on your photo, your skin appears moderately oily with some mild inflammation around the cheeks. Your self-reported stress and sleep patterns might be contributing to this congestion.",
    triggers: ["⚡ Stress", "💤 Sleep", "🩹 Barrier support"],
    metrics: {
      acne: 75,
      redness: 45,
      oiliness: 85,
      dryness: 20,
    },
  };

  // Send the results back to the frontend
  res.status(200).json(mockResult);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Ready to receive analysis requests at http://localhost:5000/api/analyze");
});