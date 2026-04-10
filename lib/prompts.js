export const MOCKUP_PROMPTS = {
  food: "premium food packaging, kraft paper wrap, foil details, product label, studio lighting",
  apparel: "folded clothing flatlay, minimal background, lifestyle hanger shot, natural lighting",
  accessory: "luxury product box, velvet interior, ribbon, premium unboxing, soft shadows",
  beverage: "branded cup, café setting, steam rising, warm lighting, bokeh background",
  digital: "device mockup, MacBook or iPhone screen, clean desk setup, minimal workspace",
  bag: "lifestyle shot, neutral background, natural lighting, premium texture detail",
  chocolate: "premium chocolate packaging, kraft paper, gold foil, elegant label, dark background",
  generic: "clean product packaging box, white background, soft shadows, professional studio"
};

export const NEGATIVE_PROMPTS = {
  food: "cartoon, illustration, plastic look, unreadable text, distorted letters, neon colors, oversaturated, blurry label, low quality, watermark",
  apparel: "cartoon, mannequin, distorted body, extra limbs, wrong proportions, plastic fabric, blurry print, low resolution, watermark",
  accessory: "cartoon, plastic, cheap look, distorted shape, wrong reflections, blurry details, oversaturated, fake metal, watermark",
  beverage: "cartoon, plastic cup, distorted shape, wrong text, blurry label, oversaturated, low quality, watermark",
  digital: "cartoon, distorted screen, wrong UI elements, blurry text, unrealistic device, watermark, neon glow",
  bag: "cartoon, distorted shape, plastic texture, unnatural stitching, blurry logo, fake leather, watermark",
  chocolate: "cartoon, plastic wrap, unreadable text, distorted letters, cheap look, oversaturated, blurry, watermark",
  generic: "cartoon, distorted shape, unreadable text, plastic look, oversaturated, blurry label, low quality, watermark"
};

export const MOCKUP_TYPE_SELECTOR = (productType) => {
  const type = productType?.toLowerCase();
  if (type?.includes("food") || type?.includes("snack")) return "food";
  if (type?.includes("apparel") || type?.includes("cloth") || type?.includes("shirt")) return "apparel";
  if (type?.includes("accessory") || type?.includes("jewelry") || type?.includes("watch")) return "accessory";
  if (type?.includes("beverage") || type?.includes("drink") || type?.includes("coffee")) return "beverage";
  if (type?.includes("digital") || type?.includes("app") || type?.includes("software")) return "digital";
  if (type?.includes("bag") || type?.includes("purse") || type?.includes("luggage")) return "bag";
  if (type?.includes("chocolate") || type?.includes("candy") || type?.includes("sweet")) return "chocolate";
  return "generic";
};
