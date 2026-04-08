import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Result() {
  const router = useRouter();
  const [kit, setKit] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("brandKit");
    if (!data) { router.push("/"); return; }
    setKit(JSON.parse(data));
  }, []);

  if (!kit) return null;

  const isProduct = kit.brandType === "Product";

  const sectionStyle = {
    background: "rgba(255,255,255,0.03)", border: "1px solid #1a3a6a",
    borderRadius: 16, padding: 32, marginBottom: 24,
  };
  const labelStyle = {
    color: "#00b4d8", fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 16, display: "block",
  };
  const headingStyle = {
    color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)", padding: "60px 24px" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }} className="fade-in">
          <img src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 16, filter: "drop-shadow(0 0 12px #00b4d8)" }} alt="NabadAi" />
          <p style={{ color: "#00b4d8", letterSpacing: 4, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>NABADAI — AI BRAND IDENTITY</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(90deg, #fff, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
            {kit.brandName} Brand Kit
          </h1>
          <p style={{ color: "#5577aa", fontSize: 14 }}>Your complete AI-generated brand identity is ready.</p>
        </div>

        {/* Slogans */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>BRAND SLOGANS</span>
          {kit.slogans?.map((s, i) => (
            <div key={i} style={{
              padding: "14px 20px", borderRadius: 10, marginBottom: 10,
              background: i === 0 ? "rgba(0,180,216,0.1)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${i === 0 ? "#00b4d8" : "#1a3a6a"}`,
              color: i === 0 ? "#fff" : "#8899bb", fontSize: 15, fontStyle: "italic", fontWeight: i === 0 ? 700 : 400,
            }}>
              {i === 0 && <span style={{ color: "#00b4d8", fontSize: 10, letterSpacing: 2, display: "block", marginBottom: 4 }}>★ RECOMMENDED</span>}
              "{s}"
            </div>
          ))}
        </div>

        {/* Colors */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>COLOR PALETTE</span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {kit.colors?.map((color, i) => (
              <div key={i} style={{ flex: "1 1 120px", minWidth: 100 }}>
                <div style={{ height: 80, borderRadius: 10, background: color, marginBottom: 8, boxShadow: `0 4px 20px ${color}44` }} />
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{kit.colorNames?.[i]}</p>
                <p style={{ color: "#00b4d8", fontSize: 12, margin: "0 0 2px", fontFamily: "monospace" }}>{color}</p>
                <p style={{ color: "#5577aa", fontSize: 11, margin: 0 }}>{kit.colorUsage?.[i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>TYPOGRAPHY</span>
          {kit.fonts?.map((font, i) => (
            <div key={i} style={{ marginBottom: 16, padding: "16px 20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1a3a6a" }}>
              <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 2, margin: "0 0 4px" }}>{kit.fontRoles?.[i]?.toUpperCase()}</p>
              <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{font}</p>
            </div>
          ))}
        </div>

        {/* Brand Archetype */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>BRAND ARCHETYPE & AUDIENCE</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: "20px", borderRadius: 10, background: "rgba(0,180,216,0.08)", border: "1px solid #00b4d8", textAlign: "center" }}>
              <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 2, margin: "0 0 8px" }}>ARCHETYPE</p>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>{kit.brandArchetype}</p>
            </div>
            <div style={{ padding: "20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1a3a6a" }}>
              <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 2, margin: "0 0 8px" }}>AUDIENCE PROFILE</p>
              <p style={{ color: "#8899bb", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{kit.targetAudienceProfile}</p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>SEO KEYWORDS</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {kit.keywords?.map((kw, i) => (
              <span key={i} style={{
                padding: "8px 16px", borderRadius: 20, background: "rgba(34,85,204,0.15)",
                border: "1px solid #2255cc", color: "#7799dd", fontSize: 13, fontWeight: 600,
              }}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Product Mockup */}
        {isProduct && kit.mockupUrl && (
          <div style={sectionStyle} className="fade-in">
            <span style={labelStyle}>AI PRODUCT MOCKUP</span>
            <p style={{ color: "#5577aa", fontSize: 13, marginBottom: 16 }}>Realistic AI-generated mockup based on your brand identity.</p>
            <img src={kit.mockupUrl} alt="Product Mockup"
              style={{ width: "100%", borderRadius: 12, border: "1px solid #1a3a6a", boxShadow: "0 8px 40px rgba(0,180,216,0.15)" }} />
          </div>
        )}

        {/* Legal Guidance */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>⚖️ LEGAL GUIDANCE</span>
          <p style={{ color: "#5577aa", fontSize: 13, marginBottom: 20 }}>Global legal requirements and recommendations for your brand.</p>
          {kit.legalGuidance && Object.entries({
            "Trademark Registration": kit.legalGuidance.trademark,
            "Business Registration": kit.legalGuidance.businessRegistration,
            "Certifications & Compliance": kit.legalGuidance.certifications,
            "IP Protection": kit.legalGuidance.ipProtection,
          }).map(([title, content]) => (
            <div key={title} style={{ marginBottom: 16, padding: "16px 20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1a3a6a" }}>
              <p style={{ color: "#00b4d8", fontSize: 12, letterSpacing: 1, fontWeight: 700, margin: "0 0 6px" }}>{title.toUpperCase()}</p>
              <p style={{ color: "#8899bb", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{content}</p>
            </div>
          ))}
          <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(0,180,216,0.08)", border: "1px solid #00b4d8" }}>
            <p style={{ color: "#00b4d8", fontSize: 12, letterSpacing: 1, fontWeight: 700, margin: "0 0 6px" }}>ESTIMATED LEGAL COST</p>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>{kit.legalGuidance?.estimatedLegalCost}</p>
          </div>
        </div>

        {/* Cost Estimator */}
        <div style={sectionStyle} className="fade-in">
          <span style={labelStyle}>💰 BRAND LAUNCH COST ESTIMATOR</span>
          <p style={{ color: "#5577aa", fontSize: 13, marginBottom: 20 }}>Estimated investment to launch your brand successfully.</p>
          {kit.costEstimator?.breakdown?.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "14px 20px", borderRadius: 10, marginBottom: 10,
              background: "rgba(255,255,255,0.02)", border: "1px solid #1a3a6a",
            }}>
              <div>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{item.item}</p>
                <p style={{ color: "#5577aa", fontSize: 12, margin: 0 }}>{item.note}</p>
              </div>
              <p style={{ color: "#00b4d8", fontSize: 15, fontWeight: 700, margin: 0, whiteSpace: "nowrap", marginLeft: 16 }}>{item.cost}</p>
            </div>
          ))}
          <div style={{ padding: "20px", borderRadius: 10, background: "rgba(0,180,216,0.08)", border: "1px solid #00b4d8", marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 2, margin: "0 0 4px" }}>TOTAL ESTIMATE</p>
                <p style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>{kit.costEstimator?.totalEstimate}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 2, margin: "0 0 4px" }}>TIMELINE</p>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{kit.costEstimator?.timelineWeeks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ ...sectionStyle, textAlign: "center", background: "rgba(0,180,216,0.05)", border: "1px solid #00b4d8" }} className="fade-in">
          <p style={{ color: "#00b4d8", fontSize: 11, letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>READY TO LAUNCH?</p>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Let NabadAi Build Your Brand</h2>
          <p style={{ color: "#5577aa", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
            From logo design to full digital presence — our AI-powered agency handles everything.
          </p>
          <a href="https://nabadai.myshopify.com" target="_blank" rel="noreferrer" style={{
            display: "inline-block", padding: "16px 40px", borderRadius: 12,
            background: "linear-gradient(90deg, #2255cc, #00b4d8)",
            color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 0 30px rgba(0,180,216,0.3)",
          }}>
            Get Started with NabadAi →
          </a>
          <p style={{ color: "#3a5a8a", fontSize: 12, marginTop: 16 }}>
            or <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#00b4d8", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
              Generate another brand kit
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
