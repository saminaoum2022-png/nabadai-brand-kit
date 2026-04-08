import { useState } from "react";
import { useRouter } from "next/router";

const LOADING_MESSAGES = [
  "Scanning brand DNA...",
  "Analyzing your industry...",
  "Generating color palette...",
  "Crafting your slogans...",
  "Building typography system...",
  "Mining SEO keywords...",
  "Writing your brand story...",
  "Calculating launch costs...",
  "Reviewing legal requirements...",
  "Generating product mockup...",
  "Assembling your identity...",
  "Almost ready...",
];

function LogoLoader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh",
      background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)",
    }}>
      <style>{`
        @keyframes ring1 {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          40% { transform: rotate(180deg) scale(1.3); opacity: 0.4; }
          70% { transform: rotate(300deg) scale(0.85); opacity: 0.7; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes ring2 {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          35% { transform: rotate(-150deg) scale(1.25); opacity: 0.3; }
          65% { transform: rotate(-280deg) scale(0.9); opacity: 0.6; }
          100% { transform: rotate(-360deg) scale(1); opacity: 1; }
        }
        @keyframes ring3 {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          45% { transform: rotate(200deg) scale(1.2); opacity: 0.5; }
          75% { transform: rotate(320deg) scale(0.88); opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 12px #00b4d8); }
          50% { transform: scale(1.08); opacity: 0.85; filter: drop-shadow(0 0 28px #00b4d8) drop-shadow(0 0 48px #2255cc); }
        }
        @keyframes fadeMsg {
          0% { opacity: 0; transform: translateY(8px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-120px); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(120px); opacity: 0; }
        }
        @keyframes particleOrbit {
          0% { transform: rotate(var(--start-deg)) translateX(110px) scale(1); opacity: 1; }
          50% { transform: rotate(calc(var(--start-deg) + 180deg)) translateX(130px) scale(1.8); opacity: 0.3; }
          100% { transform: rotate(calc(var(--start-deg) + 360deg)) translateX(110px) scale(1); opacity: 1; }
        }
        .ring1-wrap { animation: ring1 3.2s ease-in-out infinite; transform-origin: center; }
        .ring2-wrap { animation: ring2 3.8s ease-in-out infinite; transform-origin: center; }
        .ring3-wrap { animation: ring3 2.9s ease-in-out infinite; transform-origin: center; }
        .core-wrap { animation: corePulse 2.4s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div style={{ position: "relative", width: 240, height: 240, marginBottom: 40 }}>
        <div style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)",
          animation: "corePulse 2.4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "10%", width: "80%", height: 2,
          background: "linear-gradient(90deg, transparent, #00b4d8, transparent)",
          borderRadius: 2, animation: "scanLine 2.4s ease-in-out infinite", zIndex: 10,
        }} />
        <div className="ring1-wrap" style={{ position: "absolute", inset: 0 }}>
          <img src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.5, filter: "hue-rotate(10deg) brightness(1.2)" }} alt="" />
        </div>
        <div className="ring2-wrap" style={{ position: "absolute", inset: 20 }}>
          <img src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.6, filter: "hue-rotate(-20deg) brightness(1.3) saturate(1.4)" }} alt="" />
        </div>
        <div className="ring3-wrap" style={{ position: "absolute", inset: 40 }}>
          <img src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.8, filter: "hue-rotate(30deg) brightness(1.5) saturate(1.6)" }} alt="" />
        </div>
        <div className="core-wrap" style={{
          position: "absolute", inset: 70, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.3) 0%, transparent 70%)",
        }} />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: i % 2 === 0 ? 6 : 4, height: i % 2 === 0 ? 6 : 4,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#00b4d8" : "#2255cc",
            boxShadow: `0 0 ${i % 2 === 0 ? 10 : 6}px ${i % 2 === 0 ? "#00b4d8" : "#2255cc"}`,
            "--start-deg": `${deg}deg`,
            animation: `particleOrbit ${2.5 + i * 0.4}s ease-in-out infinite`,
            transformOrigin: "-110px 0",
          }} />
        ))}
      </div>

      <h2 style={{
        fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10,
        fontFamily: "sans-serif", letterSpacing: 1, textAlign: "center",
      }}>
        Your Brand Kit is on the way
      </h2>
      <p style={{ color: "#3a6a9a", fontSize: 13, fontFamily: "sans-serif", marginBottom: 24, letterSpacing: 1 }}>
        NABADAI AI ENGINE RUNNING
      </p>

      <div style={{ height: 32, overflow: "hidden", textAlign: "center" }}>
        <p key={msgIndex} style={{
          color: "#00b4d8", fontSize: 14, fontFamily: "sans-serif", fontWeight: 600,
          letterSpacing: 2, margin: 0, animation: "fadeMsg 1.8s ease-in-out forwards",
        }}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      <div style={{
        marginTop: 40, display: "flex", gap: 8,
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00b4d8", opacity: 0.3 + i * 0.3,
            animation: `corePulse ${1 + i * 0.3}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const CHIP_OPTIONS = {
  audience: ["Gen Z", "Millennials", "Professionals", "Parents", "Luxury Buyers", "Mass Market"],
  targetMarket: ["Local", "Regional", "Global"],
  personality: ["Bold", "Elegant", "Playful", "Trustworthy", "Innovative", "Minimal"],
  colorPrefs: ["Neutrals", "Earth Tones", "Vibrant", "Dark & Moody", "Pastels", "No Preference"],
  packagingStyle: ["Minimalist", "Luxury", "Playful", "Eco-Friendly", "Bold"],
};

function ChipSelect({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)} style={{
          padding: "8px 16px", borderRadius: 20, border: "1px solid",
          borderColor: selected.includes(opt) ? "#00b4d8" : "#1a3a6a",
          background: selected.includes(opt) ? "rgba(0,180,216,0.15)" : "transparent",
          color: selected.includes(opt) ? "#00b4d8" : "#5577aa",
          fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
        }}>{opt}</button>
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brandName: "", industry: "", brandStory: "", productName: "", productSpecial: "",
    style: "Minimalist", brandType: "Service", storeType: "Online Store",
    productCategory: "Fashion",
    audience: [], targetMarket: [], personality: [], colorPrefs: [], packagingStyle: [],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        audience: form.audience.join(", "),
        targetMarket: form.targetMarket.join(", "),
        personality: form.personality.join(", "),
        colorPrefs: form.colorPrefs.join(", "),
        packagingStyle: form.packagingStyle.join(", "),
      };
      const [res] = await Promise.all([
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise(resolve => setTimeout(resolve, 5000)),
      ]);
      const data = await res.json();
      localStorage.setItem("brandKit", JSON.stringify({ ...data, brandName: form.brandName, style: form.style }));
      router.push("/result");
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <LogoLoader />;

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #1a3a6a",
    background: "#0a1628", color: "#fff", fontSize: 15, marginBottom: 20,
    boxSizing: "border-box", outline: "none",
  };
  const labelStyle = {
    color: "#00b4d8", fontSize: 12, letterSpacing: 2, fontWeight: 700,
    marginBottom: 6, display: "block",
  };
  const sectionStyle = {
    borderTop: "1px solid #1a3a6a", paddingTop: 28, marginTop: 28,
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <img src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 20, filter: "drop-shadow(0 0 12px #00b4d8)" }} alt="NabadAi" />
          <p style={{ color: "#00b4d8", letterSpacing: 4, fontSize: 11, marginBottom: 12, fontWeight: 700 }}>NABADAI — AI BRAND IDENTITY</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, background: "linear-gradient(90deg, #fff, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Build Your Brand Kit
          </h1>
          <p style={{ color: "#5577aa", fontSize: 15 }}>Answer a few questions. Get a complete AI-powered brand identity, legal guide, cost estimate & product mockup.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* BRAND BASICS */}
          <label style={labelStyle}>BRAND NAME *</label>
          <input style={inputStyle} placeholder="e.g. NabadAi" value={form.brandName}
            onChange={e => set("brandName", e.target.value)} required />

          <label style={labelStyle}>INDUSTRY *</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.industry} onChange={e => set("industry", e.target.value)} required>
            <option value="">Select your industry...</option>
            {["Skincare & Beauty", "Food & Beverage", "Fashion & Apparel", "Technology", "Health & Wellness", "Education", "Finance", "Real Estate", "Hospitality", "E-commerce", "Consulting", "Other"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label style={labelStyle}>BRAND STORY (ONE SENTENCE) *</label>
          <input style={inputStyle} placeholder="e.g. We help businesses grow using AI-powered tools"
            value={form.brandStory} onChange={e => set("brandStory", e.target.value)} required />

          <label style={labelStyle}>TARGET AUDIENCE</label>
          <ChipSelect options={CHIP_OPTIONS.audience} selected={form.audience} onChange={v => set("audience", v)} />

          <label style={labelStyle}>TARGET MARKET</label>
          <ChipSelect options={CHIP_OPTIONS.targetMarket} selected={form.targetMarket} onChange={v => set("targetMarket", v)} />

          <label style={labelStyle}>BRAND PERSONALITY</label>
          <ChipSelect options={CHIP_OPTIONS.personality} selected={form.personality} onChange={v => set("personality", v)} />

          <label style={labelStyle}>COLOR PREFERENCES</label>
          <ChipSelect options={CHIP_OPTIONS.colorPrefs} selected={form.colorPrefs} onChange={v => set("colorPrefs", v)} />

          <label style={labelStyle}>STYLE PREFERENCE</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.style} onChange={e => set("style", e.target.value)}>
            {["Minimalist", "Bold", "Luxury", "Playful", "Corporate", "Futuristic"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* BRAND TYPE */}
          <div style={sectionStyle}>
            <label style={labelStyle}>BRAND TYPE *</label>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {["Product", "Service"].map(t => (
                <button key={t} type="button" onClick={() => set("brandType", t)} style={{
                  flex: 1, padding: "14px", borderRadius: 10, border: "1px solid",
                  borderColor: form.brandType === t ? "#00b4d8" : "#1a3a6a",
                  background: form.brandType === t ? "rgba(0,180,216,0.15)" : "transparent",
                  color: form.brandType === t ? "#00b4d8" : "#5577aa",
                  fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                }}>{t === "Product" ? "📦 Product" : "🛠️ Service"}</button>
              ))}
            </div>

            {form.brandType === "Product" && (
              <>
                <label style={labelStyle}>STORE TYPE</label>
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {["Online Store", "Physical Store", "Both"].map(t => (
                    <button key={t} type="button" onClick={() => set("storeType", t)} style={{
                      flex: 1, padding: "12px", borderRadius: 10, border: "1px solid",
                      borderColor: form.storeType === t ? "#00b4d8" : "#1a3a6a",
                      background: form.storeType === t ? "rgba(0,180,216,0.15)" : "transparent",
                      color: form.storeType === t ? "#00b4d8" : "#5577aa",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    }}>{t}</button>
                  ))}
                </div>

                <label style={labelStyle}>PRODUCT NAME</label>
                <input style={inputStyle} placeholder="e.g. GlowSerum Pro"
                  value={form.productName} onChange={e => set("productName", e.target.value)} />

                <label style={labelStyle}>PRODUCT CATEGORY</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.productCategory} onChange={e => set("productCategory", e.target.value)}>
                  {["Skincare", "Food & Beverage", "Fashion", "Electronics", "Home & Living", "Health", "Sports", "Other"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <label style={labelStyle}>PACKAGING STYLE</label>
                <ChipSelect options={CHIP_OPTIONS.packagingStyle} selected={form.packagingStyle} onChange={v => set("packagingStyle", v)} />

                <label style={labelStyle}>WHAT MAKES YOUR PRODUCT SPECIAL?</label>
                <input style={inputStyle} placeholder="e.g. Organic ingredients, sustainable packaging, unique formula"
                  value={form.productSpecial} onChange={e => set("productSpecial", e.target.value)} />
              </>
            )}
          </div>

          <button type="submit" style={{
            width: "100%", padding: "18px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(90deg, #2255cc, #00b4d8)",
            color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: 1, marginTop: 32,
            boxShadow: "0 0 30px rgba(0,180,216,0.3)",
          }}>
            Generate My Brand Kit →
          </button>

          <p style={{ textAlign: "center", color: "#3a5a8a", fontSize: 12, marginTop: 16, letterSpacing: 1 }}>
            Powered by GPT-4o + DALL-E 3 · Results in ~30 seconds
          </p>
        </form>
      </div>
    </div>
  );
}
