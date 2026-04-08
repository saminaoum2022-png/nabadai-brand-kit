import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, industry, productType, colors } = req.body;

  try {
    const primaryColor = colors?.[0]?.hex || '#000000';
    const accentColor = colors?.[2]?.hex || '#ffffff';

    const mockupPrompts = [
      `Professional product packaging mockup for "${businessName}", ${industry} brand, ${productType} product, color scheme: ${primaryColor} and ${accentColor}, minimalist premium design, studio lighting, white background, photorealistic`,
      `Elegant product label design mockup for "${businessName}", ${industry} brand, ${productType}, colors: ${primaryColor} and ${accentColor}, luxury packaging, close-up shot, professional product photography`,
      `Lifestyle product mockup for "${businessName}" ${productType}, ${industry} industry, brand colors ${primaryColor} and ${accentColor}, modern aesthetic, clean background, premium feel, commercial photography style`
    ];

    const mockupImages = await Promise.all(
      mockupPrompts.map(prompt =>
        openai.images.generate({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }).then(r => r.data[0].url)
      )
    );

    res.status(200).json({ success: true, mockups: mockupImages });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true } };
