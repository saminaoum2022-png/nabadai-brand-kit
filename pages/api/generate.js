import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { brandName, industry, audience, personality, colors, competitors, mission, style, lang } = req.body;

  const prompt = `You are a professional brand strategist. Create a complete brand identity kit for the following brand:

Brand Name: ${brandName}
Industry: ${industry}
Target Audience: ${audience}
Brand Personality: ${personality}
Color Preferences: ${colors}
Competitors/Admired Brands: ${competitors}
Brand Mission: ${mission}
Preferred Style: ${style}

Return a JSON object with exactly this structure:
{
  "slogan1": "first slogan option",
  "slogan2": "second slogan option", 
  "slogan3": "third slogan option",
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "colorNames": ["name1", "name2", "name3", "name4", "name5"],
  "fonts": ["Font Pairing 1", "Font Pairing 2"],
  "brandPersonality": "description of brand personality",
  "targetAudience": "detailed target audience profile",
  "brandArchetype": "brand archetype name",
  "toneOfVoice": "tone of voice description"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const data = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
