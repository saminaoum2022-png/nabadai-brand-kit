import { MOCKUP_PROMPTS, NEGATIVE_PROMPTS, MOCKUP_TYPE_SELECTOR } from '../../lib/prompts';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, industry, productType, colors } = req.body;

  try {
    const primaryColor = colors?.[0]?.hex || '#000000';
    const accentColor = colors?.[2]?.hex || '#ffffff';

    const mockupKey = MOCKUP_TYPE_SELECTOR(productType);
    const mockupDescription = MOCKUP_PROMPTS[mockupKey];
    const negativePrompt = NEGATIVE_PROMPTS[mockupKey];

    const mockupPrompts = [
      `Professional product mockup, ${mockupDescription}, brand: ${businessName}, industry: ${industry}, primary color: ${primaryColor}, accent color: ${accentColor}, photorealistic, commercial photography, 4k`,
      `Elegant packaging mockup, ${mockupDescription}, brand name: ${businessName}, color palette: ${primaryColor} and ${accentColor}, luxury feel, close-up shot, professional product photography, 4k`,
      `Lifestyle product mockup, ${mockupDescription}, ${businessName} brand, ${industry} industry, colors: ${primaryColor} and ${accentColor}, modern aesthetic, premium commercial photography, 4k`
    ];

    const mockupImages = await Promise.all(
      mockupPrompts.map(async (prompt) => {
        const response = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "wait"
          },
          body: JSON.stringify({
            input: {
              prompt,
              negative_prompt: negativePrompt,
              width: 1024,
              height: 1024,
              steps: 25
            }
          })
        });

        const prediction = await response.json();
        return prediction.output?.[0] || prediction.output;
      })
    );

    res.status(200).json({ success: true, mockups: mockupImages });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true } };
