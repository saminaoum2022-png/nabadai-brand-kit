import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateWithReplicate(prompt, negativePrompt) {
  try {
    const startRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json"
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

    const prediction = await startRes.json();
    if (!prediction.id) throw new Error('No prediction ID from Replicate');

    let result;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${process.env.REPLICATE_API_KEY}` }
      });
      result = await pollRes.json();
      if (result.status === 'succeeded') break;
      if (result.status === 'failed') throw new Error('Replicate generation failed');
    }

    const output = result.output;
    const url = typeof output === 'string' ? output : Array.isArray(output) ? output[0] : null;
    if (!url) throw new Error('No output URL from Replicate');
    return url;

  } catch (err) {
    console.warn('Replicate failed, falling back to DALL-E:', err.message);
    return null;
  }
}

async function generateWithDalle(prompt) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'hd',
    style: 'natural'
  });
  return response.data[0].url;
}

async function generateImage(replicatePrompt, dallePrompt, negativePrompt) {
  const replicateUrl = await generateWithReplicate(replicatePrompt, negativePrompt);
  if (replicateUrl) return replicateUrl;
  console.log('Using DALL-E fallback for mockup...');
  return await generateWithDalle(dallePrompt);
}

function buildProductConfigs(businessName, industry, description, productType, primaryColor, accentColor) {
  const product = productType || industry;
  const negativePrompt = "illustration, cartoon, 3d render, blurry, low quality, watermark, text overlay, busy background, unrealistic lighting";

  return [
    {
      replicate: `Professional product mockup of ${product} for brand "${businessName}", ${industry} industry. Product description: ${description}. Primary brand color: ${primaryColor}, accent: ${accentColor}. Clean studio shot, white or neutral background, photorealistic, commercial photography, 4k, premium packaging`,
      dalle: `Professional product mockup for "${businessName}" — a ${industry} brand selling ${product}. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Clean studio photography, white background, premium feel, commercial quality.`,
      negative: negativePrompt
    },
    {
      replicate: `Elegant close-up packaging mockup for "${businessName}" ${product}, ${industry} brand. Description: ${description}. Color palette: ${primaryColor} and ${accentColor}. Luxury feel, soft lighting, shallow depth of field, premium product photography, 4k`,
      dalle: `Elegant packaging close-up for "${businessName}" ${product} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Luxury product photography, soft lighting, premium aesthetic.`,
      negative: negativePrompt
    },
    {
      replicate: `Lifestyle mockup showing ${product} from "${businessName}" in real-world context. Industry: ${industry}. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Aspirational lifestyle photography, natural lighting, modern aesthetic, 4k, commercial quality`,
      dalle: `Lifestyle product photo for "${businessName}" ${product}. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Real-world context, natural lighting, aspirational and modern feel.`,
      negative: negativePrompt
    }
  ];
}

function buildServiceConfigs(businessName, industry, description, audience, primaryColor, accentColor) {
  const negativePrompt = "cartoon, illustration, blurry, low quality, watermark, cluttered, unprofessional, pixelated";

  return [
    {
      replicate: `Professional business card mockup for "${businessName}", ${industry} service brand. Description: ${description}. Primary color: ${primaryColor}, accent: ${accentColor}. Minimal elegant design, clean typography, premium paper texture, studio lighting, photorealistic, 4k`,
      dalle: `Professional business card design mockup for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Minimal, elegant, premium feel, clean typography.`,
      negative: negativePrompt
    },
    {
      replicate: `Modern website hero section mockup for "${businessName}", ${industry} service company. ${description}. Target audience: ${audience}. Brand colors: ${primaryColor} and ${accentColor}. Clean UI design, professional layout, desktop screen mockup, premium digital brand identity`,
      dalle: `Website hero section mockup for "${businessName}" — ${industry} service. ${description}. Colors: ${primaryColor} and ${accentColor}. Modern UI, clean layout, professional digital brand presentation.`,
      negative: negativePrompt
    },
    {
      replicate: `Professional social media post mockup for "${businessName}", ${industry} brand. Service: ${description}. Audience: ${audience}. Colors: ${primaryColor} and ${accentColor}. Instagram square format, modern graphic design, premium brand aesthetic, clean layout, 4k`,
      dalle: `Social media post design mockup for "${businessName}" — ${industry} service brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Instagram format, modern, clean, premium brand aesthetic.`,
      negative: negativePrompt
    }
  ];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, industry, description, audience, productType, businessType, colors } = req.body;

  try {
    const primaryColor = colors?.[0]?.hex || '#000000';
    const accentColor = colors?.[2]?.hex || '#ffffff';

    const configs = businessType === 'service'
      ? buildServiceConfigs(businessName, industry, description, audience, primaryColor, accentColor)
      : buildProductConfigs(businessName, industry, description, productType, primaryColor, accentColor);

    const mockupImages = await Promise.all(
      configs.map(config => generateImage(config.replicate, config.dalle, config.negative))
    );

    res.status(200).json({ success: true, mockups: mockupImages });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true, responseLimit: false } };
