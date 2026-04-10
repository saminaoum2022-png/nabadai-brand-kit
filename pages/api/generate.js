import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateWithReplicate(prompt, negativePrompt, width = 1024, height = 1024) {
  try {
    const startRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: { prompt, negative_prompt: negativePrompt, width, height, steps: 30 }
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

async function generateWithDalle(prompt, size = '1024x1024') {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality: 'hd',
    style: 'natural'
  });
  return response.data[0].url;
}

async function generateImage(replicatePrompt, dallePrompt, negativePrompt, width = 1024, height = 1024) {
  const replicateUrl = await generateWithReplicate(replicatePrompt, negativePrompt, width, height);
  if (replicateUrl) return replicateUrl;
  return await generateWithDalle(dallePrompt);
}

function buildLogoCollageConfig(businessName, industry, description, audience, logoStyle, logoSymbol, inspirationBrands, avoidInLogo, colors) {
  const style = logoStyle || 'Minimal';
  const symbol = logoSymbol || 'Abstract icon';
  const inspiration = inspirationBrands ? `Inspired by: ${inspirationBrands}.` : '';
  const avoid = avoidInLogo ? `Avoid: ${avoidInLogo}.` : '';

  const primaryHex = colors?.[0]?.hex || '#1a237e';
  const secondaryHex = colors?.[1]?.hex || '#4fc3f7';

  const negativePrompt = `photorealistic, 3d render, shadows, gradients, clipart, watermark, blurry, low quality, distorted shapes, cartoon, busy background, neon, glow effects${avoidInLogo ? ', ' + avoidInLogo : ''}`;

  const replicatePrompt = `A large professional sheet showing exactly 4 different ${style} flat vector logo concepts for "${businessName}" — a ${industry} brand. ${description}. Arranged in a 2x2 grid, each logo in its own clearly separated white box. Each concept uses brand colors ${primaryHex} and ${secondaryHex}. Symbol: ${symbol}. ${inspiration} ${avoid} Each logo is unique — wordmark, lettermark, icon+text, and abstract symbol variations. Clean white background per cell, bold typography, no gradients, print-ready, professional brand identity sheet. Large text labels under each: "Option 1", "Option 2", "Option 3", "Option 4".`;

  const dallePrompt = `A professional brand identity sheet showing 4 different logo concepts for "${businessName}" — a ${industry} brand arranged in a 2x2 grid. Each logo in its own white cell clearly separated. Brand colors: ${primaryHex} and ${secondaryHex}. ${style} flat design style. Symbol concept: ${symbol}. ${inspiration} ${avoid} Four variations: text-only wordmark, letter mark, icon with text, abstract symbol. No gradients, clean, print-ready. Labels: "Option 1", "Option 2", "Option 3", "Option 4". Large high-resolution sheet.`;

  return { replicate: replicatePrompt, dalle: dallePrompt, negative: negativePrompt };
}

function buildMockupCollageConfig(businessName, industry, description, mockupType, businessType, productType, colors) {
  const primaryHex = colors?.[0]?.hex || '#1a237e';
  const secondaryHex = colors?.[1]?.hex || '#4fc3f7';
  const accentHex = colors?.[2]?.hex || '#e8eaf0';
  const colorInstruction = `Brand colors: ${primaryHex} as primary, ${secondaryHex} as secondary, ${accentHex} as accent.`;

  const collagePrompts = {
    packaging: `A large professional product packaging collage for "${businessName}" — ${productType || industry} brand. ${colorInstruction} 4 angles in one image: front view, side view, open box unboxing shot, and lifestyle flat lay. Premium packaging design, studio lighting, clean background. All using exact brand colors.`,
    business_card: `A professional business card collage for "${businessName}" — ${industry}. ${colorInstruction} 4 views: front face, back face, stack of cards, and hand holding card lifestyle shot. Premium finish, embossed logo, clean typography. Studio lighting.`,
    instagram_post: `A social media content collage for "${businessName}" — ${industry}. ${colorInstruction} 4 Instagram post mockups in one image: product hero shot, lifestyle scene, quote card, and promotional post. All using exact brand colors and consistent aesthetic.`,
    website_hero: `A website mockup collage for "${businessName}" — ${industry}. ${colorInstruction} 4 views: desktop hero section, mobile homepage, tablet view, and close-up of CTA button. Premium UI design, brand colors throughout.`,
    product_shot: `A professional product photography collage for "${businessName}" — ${productType || industry}. ${colorInstruction} 4 angles: hero front shot, 45-degree angle, lifestyle context, and detail close-up. Commercial photography style, studio lighting, brand colors in props and background.`,
    proposal_cover: `A professional proposal and document collage for "${businessName}" — ${industry} services. ${colorInstruction} 4 views: proposal cover page, inside spread, tablet mockup showing document, and printed version on desk. Executive presentation style.`,
    ad_banner: `A digital advertising collage for "${businessName}" — ${industry}. ${colorInstruction} 4 ad formats in one image: Facebook banner, Instagram story, Google display ad, and LinkedIn post. All using exact brand colors, compelling headline, CTA button.`,
    email_header: `An email marketing collage for "${businessName}" — ${industry}. ${colorInstruction} 4 views: email header banner, full email template on desktop, mobile email view, and email in inbox preview. Brand colors throughout.`,
    ecommerce_listing: `An e-commerce listing collage for "${businessName}" — ${productType || industry}. ${colorInstruction} 4 views: main listing image, lifestyle shot, size/detail infographic, and product in use. Professional commercial photography style.`,
  };

  const prompt = collagePrompts[mockupType] || `A professional brand collage for "${businessName}" — ${industry}. ${colorInstruction} 4 different brand touchpoints in one large image. Premium presentation, clean backgrounds, exact brand colors.`;
  const negative = 'blurry, low quality, watermark, distorted, amateur, wrong colors, inconsistent style';

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
- Typography must be UNIQUE per industry — never default to "Inter" or "Montserrat" for every brand
- For brandScore: score honestly based on inputs — clarity, audience definition, differentiation, name strength
- For nameCheck: honestly assess trademark risk based on industry and name uniqueness`
      }, {
        role: 'user',
        content: `Generate a complete brand kit for:

Business Name: ${businessName}
Industry: ${industry}
Description: ${description}
Target Audience: ${audience}
Budget Range: ${budget}
Type: ${businessType}
${productType ? `Product Type: ${productType}` : ''}
${logoStyle ? `Logo Style: ${logoStyle}` : ''}
${logoSymbol ? `Logo Symbol: ${logoSymbol}` : ''}
${inspirationBrands ? `Brand Inspirations: ${inspirationBrands}` : ''}
${avoidInLogo ? `Avoid in Logo: ${avoidInLogo}` : ''}

Return ONLY valid JSON:
{
  "colors": [
    {"name": "Primary", "hex": "#XXXXXX", "usage": "Specific usage"},
    {"name": "Secondary", "hex": "#XXXXXX", "usage": "Specific usage"},
    {"name": "Accent", "hex": "#XXXXXX", "usage": "Specific usage"},
    {"name": "Neutral", "hex": "#XXXXXX", "usage": "Specific usage"},
    {"name": "Dark", "hex": "#XXXXXX", "usage": "Specific usage"}
  ],
  "typography": [
    {"role": "Heading Font", "name": "Unique Google Font for this brand", "style": "Why specific to this brand", "pairedWith": "Body font"},
    {"role": "Body Font", "name": "Unique Google Font for this brand", "style": "Why specific to this brand", "pairedWith": "Heading font"}
  ],
  "slogans": ["Unique slogan 1", "Unique slogan 2", "Unique slogan 3"],
  "nameCheck": {
    "riskLevel": "low | medium | high",
    "assessment": "Specific assessment of '${businessName}' trademark risk in ${industry} industry",
    "alternatives": ["Alternative name 1 if medium/high risk", "Alternative name 2", "Alternative name 3"],
    "recommendation": "Clear recommendation — keep the name or switch and why"
  },
  "brandScore": {
    "total": <0-100>,
    "breakdown": [
      {"label": "Concept Clarity", "score": <0-100>},
      {"label": "Audience Definition", "score": <0-100>},
      {"label": "Market Differentiation", "score": <0-100>},
      {"label": "Name Strength", "score": <0-100>}
    ],
    "tip": "One specific actionable improvement tip"
  },
  "competitiveEdge": {
    "idea": "One bold creative idea to beat all competitors in ${industry}",
    "explanation": "Why this works for this specific brand and audience"
  },
  "brandVoice": {
    "tone": "Specific tone for ${audience}",
    "doList": ["Do 1", "Do 2", "Do 3"],
    "dontList": ["Dont 1", "Dont 2"],
    "captions": ["Caption 1", "Caption 2", "Caption 3", "Caption 4", "Caption 5"]
  },
  "legal": {
    "trademarkAdvice": "Specific to ${industry}",
    "businessStructure": "Recommended for this business",
    "ipProtection": ["Tip 1", "Tip 2", "Tip 3"],
    "termsHighlights": ["Term 1", "Term 2"],
    "privacyHighlights": ["Privacy 1", "Privacy 2"]
  },
  "marketing": {
    "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
    "competitorGaps": ["Gap 1", "Gap 2", "Gap 3"],
    "audienceProfile": "Deep profile of target audience",
    "contentCalendar": ["Week 1", "Week 2", "Week 3", "Week 4"]
  },
  "productDeliverables": {
    "packagingConcepts": ["Concept 1", "Concept 2", "Concept 3"],
    "photographyStyle": "Specific style",
    "unboxingExperience": "Specific experience",
    "listingCopy": "Specific copy"
  },
  "serviceDeliverables": {
    "proposalTemplate": "Specific structure",
    "pricingGuide": "Specific strategy",
    "onboardingChecklist": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "socialBio": "Specific bio"
  },
  "midjourneyPrompts": ["Prompt 1", "Prompt 2", "Prompt 3"]
}`
      }],
      response_format: { type: 'json_object' }
    });

    const kitData = JSON.parse(brandKit.choices[0].message.content);

    // Generate logo collage (4-in-1) + mockup collage in parallel
    const logoConfig = buildLogoCollageConfig(
      businessName, industry, description, audience,
      logoStyle, logoSymbol, inspirationBrands, avoidInLogo,
      kitData.colors
    );

    const imagePromises = [
      generateImage(logoConfig.replicate, logoConfig.dalle, logoConfig.negative, 1024, 1024)
    ];

    if (mockupType) {
      const mockupConfig = buildMockupCollageConfig(
        businessName, industry, description, mockupType,
        businessType, productType, kitData.colors
      );
      imagePromises.push(
        generateImage(mockupConfig.replicate, mockupConfig.dalle, mockupConfig.negative, 1024, 1024)
      );
    }

    const [logoUrl, mockupUrl] = await Promise.all(imagePromises);

    kitData.logos = [logoUrl];
    kitData.mockups = mockupUrl ? [mockupUrl] : [];
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
