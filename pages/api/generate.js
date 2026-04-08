import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { brandName, industry, audience, personality, colors, competitors, mission, style } = req.body;

  const prompt = `You are a professional brand strategist. Create a complete brand identity kit for:

Brand Name: ${brandName}
Industry: ${industry}
Target Audience: ${audience}
Brand Personality: ${personality}
Color Preferences: ${colors}
Competitors/Admired Brands: ${competitors}
Brand Mission: ${mission}
Preferred Style: ${style}

Return ONLY a valid JSON object with exactly this structure:
{
  "slogan1": "first slogan option",
  "slogan2": "second slogan option",
  "slogan3": "third slogan option",
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "colorNames": ["name1", "name2", "name3", "name4", "name5"],
  "fonts": ["Font Pairing 1", "Font Pairing 2"],
  "brandPersonality": "description",
  "targetAudience": "detailed profile",
  "brandArchetype": "archetype name",
  "toneOfVoice": "tone description"
}`;

  try {
    // Generate brand kit text
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const brandData = JSON.parse(completion.choices[0].message.content);

    // Generate 3 logo concepts using DALL-E
    const logoPrompt = `Professional logo design for "${brandName}", a ${industry} brand. Style: ${style}. Colors: ${colors}. Personality: ${personality}. Clean, modern, vector-style logo on white background. No text.`;

    const [logo1, logo2, logo3] = await Promise.all([
      openai.images.generate({ model: "dall-e-3", prompt: logoPrompt + " Concept 1: icon-based mark", size: "1024x1024", quality: "standard", n: 1 }),
      openai.images.generate({ model: "dall-e-3", prompt: logoPrompt + " Concept 2: abstract geometric mark", size: "1024x1024", quality: "standard", n: 1 }),
      openai.images.generate({ model: "dall-e-3", prompt: logoPrompt + " Concept 3: minimal lettermark", size: "1024x1024", quality: "standard", n: 1 }),
    ]);

    res.status(200).json({
      ...brandData,
      logos: [
        logo1.data[0].url,
        logo2.data[0].url,
        logo3.data[0].url,
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
