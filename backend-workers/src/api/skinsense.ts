// example in frontend/src/api/skinsense.ts
export async function fetchRecommendationBundle(skinProfile: any) {
  const res = await fetch(
    "https://<your-worker-url>/api/recommendation-bundle",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skin_profile: skinProfile }),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch recommendation bundle");
  return res.json();
}
