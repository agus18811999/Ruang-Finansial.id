export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt wajib diisi." });
    }

    if (prompt.length > 8000) {
      return res.status(400).json({ error: "Prompt terlalu panjang." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server belum punya GEMINI_API_KEY." });
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data?.error?.message || "Gemini API error."
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Gemini proxy error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan server." });
  }
}
