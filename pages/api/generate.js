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
          steps: 30
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
  console.log('Using DALL-E fallback...');
  return await generateWithDalle(dallePrompt);
}

function buildLogoConfig(businessName, industry, description, audience, logoStyle, logoSymbol, inspirationBrands, avoidInLogo) {
  const style = logoStyle || 'Minimal';
  const symbol = logoSymbol || 'Abstract icon';
  const inspiration = inspirationBrands ? `Inspired by the design style of: ${inspirationBrands}.` : '';
  const avoid = avoidInLogo ? `Avoid: ${avoidInLogo}.` : '';

  const negativePrompt = `photorealistic, 3d render, shadows, gradients, clipart, watermark, blurry, low quality, extra text, random letters, distorted shapes, cartoon, illustration style, busy background, multiple colors, neon, glow effects, badge, shield, ribbon${avoidInLogo ? ', ' + avoidInLogo : ''}`;

  const replicatePrompt = `${style} flat vector logo for "${businessName}", a ${industry} brand. Business: ${description}. Target audience: ${audience}. Symbol type: ${symbol} that visually represents the core essence of this business. ${inspiration} ${avoid} White background, bold geometric shapes, no gradients, no shadows, print ready, professional brand identity, single color mark above clean wordmark.`;

  const dallePrompt = `${style} professional vector logo for "${businessName}" — a ${industry} brand. ${description}. Symbol: ${symbol} representing the business concept. ${inspiration} ${avoid} Flat design, white background, no gradients, bold shapes, high contrast, print-ready, clean wordmark below icon.`;

  return { replicate: replicatePrompt, dalle: dallePrompt, negative: negativePrompt };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    businessName, industry, description, audience, budget, businessType, productType,
    logoStyle, logoSymbol, inspirationBrands, avoidInLogo, mockupType
  } = req.body;

  try {
    const brandKit = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `You are an elite brand strategist with 20 years of experience building premium brands.

CRITICAL RULES — NEVER BREAK THESE:
- Every section must be 100% specific to THIS business only
- Never use generic advice that could apply to any business
- Legal advice must reference THIS industry's specific regulations and risks
- Brand voice must reflect THIS specific audience's language, values and lifestyle
- Slogans must feel like they were written ONLY for this brand — never reusable
- Hashtags must be niche-specific — never generic like #business #success #entrepreneur
- Competitor gaps must reflect REAL gaps in THIS specific industry
- Color choices must reflect the psychology of THIS industry and audience
- Typography must match the brand personality — not just "clean and modern"
- If any section feels generic, you have failed the task
- Think deeply about what makes THIS business unique before writing anything`
      }, {
        role: 'user',
        content: `Generate a complete brand kit for this business:

Business Name: ${businessName}
Industry: ${industry}
Description: ${description}
Target Audience: ${audience}
Budget Range: ${budget}
Type: ${businessType} (product or service)
${productType ? `Product Type: ${productType}` : ''}
${logoStyle ? `Logo Style Preference: ${logoStyle}` : ''}
${logoSymbol ? `Logo Symbol Preference: ${logoSymbol}` : ''}
${inspirationBrands ? `Brand Inspirations: ${inspirationBrands}` : ''}
${avoidInLogo ? `Avoid in Logo: ${avoidInLogo}` : ''}

Return ONLY valid JSON in this exact format:
{
  "colors": [
    {"name": "Primary", "hex": "#XXXXXX", "usage": "Specific usage for THIS brand"},
    {"name": "Secondary", "hex": "#XXXXXX", "usage": "Specific usage for THIS brand"},
    {"name": "Accent", "hex": "#XXXXXX", "usage": "Specific usage for THIS brand"},
    {"name": "Neutral", "hex": "#XXXXXX", "usage": "Specific usage for THIS brand"},
    {"name": "Dark", "hex": "#XXXXXX", "usage": "Specific usage for THIS brand"}
  ],
  "typography": [
    {"role": "Heading Font", "name": "Font Name", "style": "Why this font fits THIS brand specifically", "pairedWith": "Body font name"},
    {"role": "Body Font", "name": "Font Name", "style": "Why this font fits THIS brand specifically", "pairedWith": "Heading font name"}
  ],
  "slogans": ["Slogan unique to ${businessName}", "Slogan unique to ${businessName}", "Slogan unique to ${businessName}"],
  "brandVoice": {
    "tone": "Specific tone for THIS audience: ${audience}",
    "doList": ["Specific do for THIS brand", "Specific do for THIS brand", "Specific do for THIS brand"],
    "dontList": ["Specific dont for THIS brand", "Specific dont for THIS brand"],
    "captions": ["Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}"]
  },
  "legal": {
    "trademarkAdvice": "Specific trademark advice for ${industry} industry",
    "businessStructure": "Recommended structure for THIS type of business in THIS industry",
    "ipProtection": ["Specific IP tip for ${industry}", "Specific IP tip for ${industry}", "Specific IP tip for ${industry}"],
    "termsHighlights": ["Specific term for ${businessType} business", "Specific term for ${businessType} business", "Specific term for ${businessType} business"],
    "privacyHighlights": ["Privacy point specific to ${industry}", "Privacy point specific to ${industry}"]
  },
  "marketing": {
    "hashtags": ["#NicheTag1", "#NicheTag2", "#NicheTag3", "#NicheTag4", "#NicheTag5"],
    "competitorGaps": ["Real gap in ${industry} market", "Real gap in ${industry} market", "Real gap in ${industry} market"],
    "audienceProfile": "Deep profile of ${audience} — their lifestyle, values, pain points, buying triggers",
    "contentCalendar": ["Week 1 theme specific to ${businessName}", "Week 2 theme specific to ${businessName}", "Week 3 theme specific to ${businessName}", "Week 4 theme specific to ${businessName}"]
  },
  "productDeliverables": {
    "packagingConcepts": ["Concept specific to ${productType || industry}", "Concept specific to ${productType || industry}", "Concept specific to ${productType || industry}"],
    "photographyStyle": "Photography style specific to ${productType || industry} products",
    "unboxingExperience": "Unboxing experience tailored to ${audience}",
    "listingCopy": "E-commerce listing copy written specifically for ${businessName}"
  },
  "serviceDeliverables": {
    "proposalTemplate": "Proposal structure specific to ${industry} services",
    "pricingGuide": "Pricing strategy for ${industry} targeting ${audience}",
    "onboardingChecklist": ["Step specific to ${industry}", "Step specific to ${industry}", "Step specific to ${industry}", "Step specific to ${industry}"],
    "socialBio": "Bio written specifically for ${businessName} targeting ${audience}"
  },
  "midjourneyPrompts": [
    "Detailed Midjourney prompt for ${businessName} logo concept 1",
    "Detailed Midjourney prompt for ${businessName} logo concept 2",
    "Detailed Midjourney prompt for ${businessName} logo concept 3"
  ]
}`
      }],
      response_format: { type: 'json_object' }
    });

    const kitData = JSON.parse(brandKit.choices[0].message.content);

    // Generate 1 specific logo
    const logoConfig = buildLogoConfig(
      businessName, industry, description, audience,
      logoStyle, logoSymbol, inspirationBrands, avoidInLogo
    );
    const logoUrl = await generateImage(logoConfig.replicate, logoConfig.dalle, logoConfig.negative);

    kitData.logos = [logoUrl];
    kitData.businessName = businessName;
    kitData.businessType = businessType;
    kitData.industry = industry;
    kitData.mockupType = mockupType || null;

    res.status(200).json({ success: true, data: kitData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true, responseLimit: false } };
