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

    const prediction = await startRes.json();
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
  return await generateWithDalle(dallePrompt);
}

function buildLogoConfig(businessName, industry, description, audience, logoStyle, logoSymbol, inspirationBrands, avoidInLogo, colors) {
  const style = logoStyle || 'Minimal';
  const symbol = logoSymbol || 'Abstract icon';
  const inspiration = inspirationBrands ? `Inspired by the design style of: ${inspirationBrands}.` : '';
  const avoid = avoidInLogo ? `Avoid: ${avoidInLogo}.` : '';

  // Extract palette colors for logo
  const primaryHex = colors?.[0]?.hex || '#1a237e';
  const secondaryHex = colors?.[1]?.hex || '#4fc3f7';
  const colorInstruction = `Use ONLY these brand colors in the logo: primary ${primaryHex} and secondary ${secondaryHex}.`;

  const negativePrompt = `white background, colored background, background fill, photorealistic, 3d render, shadows, gradients, clipart, watermark, blurry, low quality, extra text, random letters, distorted shapes, cartoon, illustration style, busy background, neon, glow effects, badge, shield, ribbon${avoidInLogo ? ', ' + avoidInLogo : ''}`;

  const replicatePrompt = `${style} flat vector logo for "${businessName}", a ${industry} brand. Business: ${description}. Target audience: ${audience}. Symbol type: ${symbol} that visually represents the core essence of this business. ${colorInstruction} ${inspiration} ${avoid} TRANSPARENT background, bold geometric shapes, no gradients, no shadows, print ready, professional brand identity, single color mark above clean wordmark. PNG with transparency.`;

  const dallePrompt = `${style} professional vector logo for "${businessName}" — a ${industry} brand. ${description}. Symbol: ${symbol} representing the business concept. ${colorInstruction} ${inspiration} ${avoid} TRANSPARENT background (no white fill, no colored background), flat design, no gradients, bold shapes, high contrast, print-ready, clean wordmark below icon. The background must be fully transparent.`;

  return { replicate: replicatePrompt, dalle: dallePrompt, negative: negativePrompt };
}

function buildMockupPrompt(businessName, industry, description, mockupType, businessType, productType, colors) {
  const primaryHex = colors?.[0]?.hex || '#1a237e';
  const secondaryHex = colors?.[1]?.hex || '#4fc3f7';
  const accentHex = colors?.[2]?.hex || '#e8eaf0';
  const colorInstruction = `Use ONLY these exact brand colors: ${primaryHex} as primary, ${secondaryHex} as secondary, ${accentHex} as accent.`;

  const mockupPrompts = {
    website_hero: `Premium website hero section mockup for "${businessName}" — ${industry} brand. ${colorInstruction} Clean desktop browser frame, hero headline, CTA button in brand colors, professional layout. Photorealistic UI mockup.`,
    instagram_post: `Instagram post mockup for "${businessName}" — ${industry} brand. ${colorInstruction} Square format, branded typography, lifestyle imagery relevant to ${description}. Premium social media aesthetic.`,
    business_card: `Premium business card mockup for "${businessName}" — ${industry}. ${colorInstruction} Both sides shown, embossed logo, clean typography, luxury finish. Studio lighting, white surface.`,
    packaging: `Product packaging mockup for "${businessName}" — ${productType || industry}. ${colorInstruction} Premium unboxing experience, branded box/bag/container relevant to ${productType || 'the product'}. Studio lighting, clean background.`,
    product_shot: `Professional product photography mockup for "${businessName}" — ${productType || industry}. ${colorInstruction} Hero product shot, lifestyle context relevant to ${description}. Premium commercial photography style.`,
    ecommerce_listing: `E-commerce product listing mockup for "${businessName}" on a premium marketplace. ${colorInstruction} Product image, title, price, reviews, add to cart button. Clean UI, professional layout.`,
    proposal_cover: `Professional proposal cover page for "${businessName}" — ${industry} services. ${colorInstruction} Executive presentation style, company name, tagline, premium typography. A4 format.`,
    email_header: `Email newsletter header mockup for "${businessName}" — ${industry}. ${colorInstruction} Branded header banner, logo placement, headline text. Clean email template style.`,
    ad_banner: `Digital advertising banner for "${businessName}" — ${industry}. ${colorInstruction} Compelling headline, CTA button, product/service visual. Premium ad creative, multiple sizes shown.`,
  };

  const prompt = mockupPrompts[mockupType] || `Professional brand mockup for "${businessName}" — ${industry}. ${colorInstruction} Premium presentation, clean background.`;
  const negative = 'blurry, low quality, watermark, distorted, amateur, generic, wrong colors, white background only';

  return { replicate: prompt, dalle: prompt, negative };
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
- Typography must be UNIQUE per industry — never default to "Inter" or "Montserrat" for every brand. A luxury jewelry brand needs different fonts than a tech startup or a food brand. Pick fonts that are SPECIFIC to the brand personality.
- If any section feels generic, you have failed the task
- Think deeply about what makes THIS business unique before writing anything
- For brandScore: score honestly based on the inputs provided — clarity of concept, audience definition, market differentiation, name strength, and description quality`
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
    {"role": "Heading Font", "name": "Google Font name specific to this brand personality", "style": "Why this font fits THIS brand specifically — not generic reasons", "pairedWith": "Body font name"},
    {"role": "Body Font", "name": "Google Font name specific to this brand personality", "style": "Why this font fits THIS brand specifically — not generic reasons", "pairedWith": "Heading font name"}
  ],
  "slogans": ["Slogan unique to ${businessName}", "Slogan unique to ${businessName}", "Slogan unique to ${businessName}"],
  "brandVoice": {
    "tone": "Specific tone for THIS audience: ${audience}",
    "doList": ["Specific do for THIS brand", "Specific do for THIS brand", "Specific do for THIS brand"],
    "dontList": ["Specific dont for THIS brand", "Specific dont for THIS brand"],
    "captions": ["Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}", "Caption specific to ${businessName}"]
  },
  "brandScore": {
    "total": <number 0-100>,
    "breakdown": [
      {"label": "Concept Clarity", "score": <0-100>},
      {"label": "Audience Definition", "score": <0-100>},
      {"label": "Market Differentiation", "score": <0-100>},
      {"label": "Name Strength", "score": <0-100>}
    ],
    "tip": "One specific actionable tip to improve their brand score"
  },
  "competitiveEdge": {
    "idea": "One bold, creative, specific idea that will make ${businessName} stand out from ALL competitors in ${industry}",
    "explanation": "Why this specific idea works for THIS brand, THIS audience, and THIS market — with concrete reasoning"
  },
  "legal": {
    "trademarkAdvice": "Specific trademark advice for ${industry} industry",
    "businessStructure": "Recommended structure for THIS type of business in THIS industry",
    "ipProtection": ["Specific IP tip for ${industry}", "Specific IP tip for ${industry}", "Specific IP tip for ${industry}"],
    "termsHighlights": ["Specific term for ${businessType} business", "Specific term for ${businessType} business"],
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

    // Generate logo using palette colors
    const logoConfig = buildLogoConfig(
      businessName, industry, description, audience,
      logoStyle, logoSymbol, inspirationBrands, avoidInLogo,
      kitData.colors
    );
    const logoUrl = await generateImage(logoConfig.replicate, logoConfig.dalle, logoConfig.negative);
    kitData.logos = [logoUrl];

    // Generate mockup using palette colors
    if (mockupType) {
      const mockupConfig = buildMockupPrompt(
        businessName, industry, description, mockupType,
        businessType, productType, kitData.colors
      );
      const mockupUrl = await generateImage(mockupConfig.replicate, mockupConfig.dalle, mockupConfig.negative);
      kitData.mockups = [mockupUrl];
    }

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
