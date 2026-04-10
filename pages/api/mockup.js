import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateWithReplicate(prompt, negativePrompt) {
  try {
    const startRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
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

    console.log('Replicate status:', startRes.status);
    const prediction = await startRes.json();
    console.log('Replicate response:', JSON.stringify(prediction));

    if (!prediction.id) throw new Error('No prediction ID from Replicate');

    let result;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}` }
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

function buildMockupConfig(mockupType, { businessName, industry, description, audience, productType, businessType, primaryColor, accentColor }) {
  const negativePrompt = "cartoon, illustration, blurry, low quality, watermark, cluttered, unprofessional, pixelated, 3d render";
  const product = productType || industry;

  const configs = {
    website_hero: {
      replicate: `Modern website hero section mockup for "${businessName}", ${industry} brand. ${description}. Target audience: ${audience}. Brand colors: ${primaryColor} and ${accentColor}. Clean UI design, professional layout, desktop screen mockup, premium digital brand identity, high-end web design`,
      dalle: `Website hero section mockup for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Modern UI, clean layout, professional digital brand presentation.`,
    },
    instagram_post: {
      replicate: `Professional Instagram square post mockup for "${businessName}", ${industry} brand. ${description}. Audience: ${audience}. Brand colors: ${primaryColor} and ${accentColor}. Modern graphic design, premium brand aesthetic, clean layout, bold typography, social media ready, 4k`,
      dalle: `Instagram post design for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Square format, modern, clean, premium brand aesthetic, bold typography.`,
    },
    business_card: {
      replicate: `Premium business card mockup for "${businessName}", ${industry} brand. ${description}. Primary color: ${primaryColor}, accent: ${accentColor}. Minimal elegant design, clean typography, premium paper texture, studio lighting, photorealistic, 4k`,
      dalle: `Professional business card mockup for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Minimal, elegant, premium feel, clean typography.`,
    },
    packaging: {
      replicate: `Elegant product packaging mockup for "${businessName}" ${product}, ${industry} brand. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Luxury feel, soft lighting, premium packaging design, clean studio shot, photorealistic, 4k`,
      dalle: `Premium packaging mockup for "${businessName}" ${product}. ${description}. Colors: ${primaryColor} and ${accentColor}. Luxury product packaging, soft lighting, premium aesthetic.`,
    },
    product_shot: {
      replicate: `Professional product studio shot for "${businessName}" ${product}, ${industry} brand. ${description}. Brand colors: ${primaryColor} and ${accentColor}. White background, commercial photography, clean studio lighting, photorealistic, 4k, premium product photography`,
      dalle: `Professional product photo for "${businessName}" ${product}. ${description}. Colors: ${primaryColor} and ${accentColor}. White background, studio lighting, commercial quality photography.`,
    },
    ecommerce_listing: {
      replicate: `E-commerce product listing image for "${businessName}" ${product}, ${industry} brand. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Pure white background, multiple angles suggestion, clean product presentation, Amazon/Shopify style, photorealistic, 4k`,
      dalle: `E-commerce listing image for "${businessName}" ${product}. ${description}. Colors: ${primaryColor} and ${accentColor}. White background, clean product presentation, professional e-commerce style.`,
    },
    proposal_cover: {
      replicate: `Professional business proposal cover page mockup for "${businessName}", ${industry} service company. ${description}. Brand colors: ${primaryColor} and ${accentColor}. Clean corporate design, premium typography, elegant layout, A4 document mockup, photorealistic`,
      dalle: `Business proposal cover design for "${businessName}" — ${industry} service. ${description}. Colors: ${primaryColor} and ${accentColor}. Professional, clean corporate layout, premium typography, A4 format.`,
    },
    email_header: {
      replicate: `Professional email newsletter header banner for "${businessName}", ${industry} brand. ${description}. Target audience: ${audience}. Brand colors: ${primaryColor} and ${accentColor}. Clean modern email design, wide banner format, premium brand aesthetic, crisp typography`,
      dalle: `Email newsletter header banner for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Wide format, modern, clean, professional email design.`,
    },
    ad_banner: {
      replicate: `Professional digital ad banner for "${businessName}", ${industry} brand. ${description}. Target audience: ${audience}. Brand colors: ${primaryColor} and ${accentColor}. Bold design, clear call to action area, Facebook/Google ad style, premium brand aesthetic, high impact visual`,
      dalle: `Digital advertising banner for "${businessName}" — ${industry} brand. ${description}. Colors: ${primaryColor} and ${accentColor}. Bold, high-impact design, clear CTA area, professional ad creative.`,
    },
  };

  const config = configs[mockupType] || configs['instagram_post'];
  return { ...config, negative: negativePrompt };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, industry, description, audience, productType, businessType, mockupType, colors } = req.body;

  try {
    const primaryColor = colors?.[0]?.hex || '#000000';
    const accentColor = colors?.[2]?.hex || '#ffffff';

    const config = buildMockupConfig(mockupType, {
      businessName, industry, description, audience,
      productType, businessType, primaryColor, accentColor
    });

    const mockupUrl = await generateImage(config.replicate, config.dalle, config.negative);

    res.status(200).json({ success: true, mockups: [mockupUrl] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true, responseLimit: false } };
