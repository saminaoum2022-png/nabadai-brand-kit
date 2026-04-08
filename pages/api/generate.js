export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { brandName, industry, audience, personality, colorPrefs, competitors, brandStory, style } = req.body;

  const prompt = `You are a world-class brand strategist. Create a complete brand identity kit for the following brand:

Brand Name: ${brandName}
Industry: ${industry}
Target Audience: ${audience}
Brand Personality: ${personality}
Color Preferences: ${colorPrefs}
Brands They Admire: ${competitors}
Brand Story: ${brandStory}
Style Preference: ${style}

Return ONLY a valid JSON object with this exact structure:
{
  "slogans": ["slogan1", "slogan2", "slogan3"],
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "colorNames": ["name1", "name2", "name3", "name4", "name5"],
  "colorUsage": ["usage1", "usage2", "usage3", "usage4", "usage5"],
  "fonts": ["Font Name 1", "Font Name 2"],
  "fontRoles": ["Primary heading font", "Body & supporting text"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"],
  "emailTemplate": "Full email text here with line breaks using \\n",
  "brandArchetype": "The archetype name",
  "targetAudienceProfile": "Detailed profile description"
}`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature:0.8,
      }),
    });

    const openaiData = await openaiRes.json();
    const content = openaiData.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Generation failed" });
  }
}
