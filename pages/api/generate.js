export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    brandName, industry, audience, personality, colorPrefs,
    competitors, brandStory, style, brandType, storeType,
    productName, productCategory, packagingStyle, productSpecial,
    targetMarket,
  } = req.body;

  const isProduct = brandType === "Product";

  const brandPrompt = `You are a world-class brand strategist with a strict, professional, and results-driven personality. Create a complete brand identity kit for:

Brand Name: ${brandName}
Industry: ${industry}
Target Audience: ${audience}
Brand Personality: ${personality}
Color Preferences: ${colorPrefs}
Brands They Admire: ${competitors}
Brand Story: ${brandStory}
Style Preference: ${style}
Brand Type: ${brandType}
Store Type: ${storeType || "N/A"}
Target Market: ${targetMarket}
${isProduct ? `Product Name: ${productName}
Product Category: ${productCategory}
Packaging Style: ${packagingStyle}
What Makes It Special: ${productSpecial}` : ""}

Return ONLY a valid JSON object with this exact structure:
{
  "slogans": ["slogan1", "slogan2", "slogan3"],
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "colorNames": ["name1", "name2", "name3", "name4", "name5"],
  "colorUsage": ["usage1", "usage2", "usage3", "usage4", "usage5"],
  "fonts": ["Font Name 1", "Font Name 2"],
  "fontRoles": ["Primary heading font", "Body & supporting text"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8", "kw9", "kw10"],
  "brandArchetype": "The archetype name",
  "targetAudienceProfile": "Detailed profile description",
  "legalGuidance": {
    "trademark": "Trademark registration advice for this brand globally",
    "businessRegistration": "Business registration guidance based on brand type and market",
    "certifications": "Relevant certifications or compliance requirements for this industry",
    "ipProtection": "Intellectual property protection advice",
    "estimatedLegalCost": "Estimated cost range in USD for legal setup"
  },
  "costEstimator": {
    "breakdown": [
      { "item": "Item name", "cost": "$X - $Y", "note": "Brief explanation" }
    ],
    "totalEstimate": "$X,000 - $Y,000",
    "timelineWeeks": "X-Y weeks"
  }
}`;

  try {
    // GPT-4o for brand identity
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: brandPrompt }],
        temperature: 0.8,
      }),
    });

    const openaiData = await openaiRes.json();
    const content = openaiData.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    // DALL-E 3 mockup (only for product brands)
    let mockupUrl = null;
    if (isProduct) {
      const mockupPrompt = `Ultra-realistic product mockup photography. ${productCategory} product called "${productName || brandName}". ${packagingStyle} packaging style. Brand colors: ${colorPrefs}. ${style} aesthetic. Clean studio lighting, professional commercial photography, photorealistic, no text overlays, high-end brand presentation. The product feels ${personality}.`;

      const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: mockupPrompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          style: "natural",
        }),
      });

      const dalleData = await dalleRes.json();
      mockupUrl = dalleData.data?.[0]?.url || null;
    }

    return res.status(200).json({ ...parsed, mockupUrl, brandType, brandName, style });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Generation failed" });
  }
}
