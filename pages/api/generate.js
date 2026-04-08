import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, industry, description, audience, budget, businessType } = req.body;

  try {
    // 1. Generate full brand kit via GPT-4
    const brandKit = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `You are a premium brand strategist. Generate a complete brand kit for this business:

Business Name: ${businessName}
Industry: ${industry}
Description: ${description}
Target Audience: ${audience}
Budget Range: ${budget}
Type: ${businessType} (product or service)

Return ONLY valid JSON in this exact format:
{
  "colors": [
    {"name": "Primary", "hex": "#XXXXXX", "usage": "Main brand color for logos and CTAs"},
    {"name": "Secondary", "hex": "#XXXXXX", "usage": "Supporting color for backgrounds"},
    {"name": "Accent", "hex": "#XXXXXX", "usage": "Highlights and interactive elements"},
    {"name": "Neutral", "hex": "#XXXXXX", "usage": "Text and subtle backgrounds"},
    {"name": "Dark", "hex": "#XXXXXX", "usage": "Headers and dark mode backgrounds"}
  ],
  "typography": [
    {"role": "Heading Font", "name": "Font Name", "style": "Bold, modern", "pairedWith": "Body font name"},
    {"role": "Body Font", "name": "Font Name", "style": "Clean, readable", "pairedWith": "Heading font name"}
  ],
  "slogans": ["Slogan 1", "Slogan 2", "Slogan 3"],
  "brandVoice": {
    "tone": "Friendly and professional",
    "doList": ["Do this", "Do that", "Do this too"],
    "dontList": ["Avoid this", "Never say that"],
    "captions": ["Caption 1", "Caption 2", "Caption 3", "Caption 4", "Caption 5"]
  },
  "legal": {
    "trademarkAdvice": "Specific trademark advice for this business",
    "businessStructure": "Recommended structure and why",
    "ipProtection": ["Tip 1", "Tip 2", "Tip 3"],
    "termsHighlights": ["Key term 1", "Key term 2", "Key term 3"],
    "privacyHighlights": ["Privacy point 1", "Privacy point 2"]
  },
  "marketing": {
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "competitorGaps": ["Gap opportunity 1", "Gap opportunity 2", "Gap opportunity 3"],
    "audienceProfile": "Detailed target audience description",
    "contentCalendar": ["Week 1 theme", "Week 2 theme", "Week 3 theme", "Week 4 theme"]
  },
  "productDeliverables": {
    "packagingConcepts": ["Concept 1", "Concept 2", "Concept 3"],
    "photographyStyle": "Photography style description",
    "unboxingExperience": "Unboxing experience recommendations",
    "listingCopy": "E-commerce product listing copy"
  },
  "serviceDeliverables": {
    "proposalTemplate": "Proposal structure and key points",
    "pricingGuide": "Pricing strategy and tiers",
    "onboardingChecklist": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "socialBio": "Professional social media bio copy"
  },
  "midjourneyPrompts": [
    "Detailed Midjourney prompt 1 for logo concept",
    "Detailed Midjourney prompt 2 for logo concept",
    "Detailed Midjourney prompt 3 for logo concept"
  ]
}`
      }],
      response_format: { type: 'json_object' }
    });

    const kitData = JSON.parse(brandKit.choices[0].message.content);

    // 2. Generate 3 logo concepts via DALL-E 3
    const logoPrompts = [
      `Minimalist vector icon logo for "${businessName}", ${industry} brand, NO text, transparent background, geometric abstract symbol, colors: ${kitData.colors[0].hex} and ${kitData.colors[2].hex}, clean professional design, white background`,
      `Modern abstract logo mark for "${businessName}", ${industry} industry, NO text, transparent background, bold geometric shapes, premium luxury feel, colors: ${kitData.colors[1].hex} and ${kitData.colors[0].hex}`,
      `Creative symbolic logo for "${businessName}", ${industry} sector, NO text, transparent background, unique icon representing the brand essence, minimalist style, colors: ${kitData.colors[2].hex} and ${kitData.colors[3].hex}`
    ];

    const logoImages = await Promise.all(
      logoPrompts.map(prompt =>
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

    kitData.logos = logoImages;
    kitData.businessName = businessName;
    kitData.businessType = businessType;
    kitData.industry = industry;

    res.status(200).json({ success: true, data: kitData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const config = { api: { bodyParser: true } };
