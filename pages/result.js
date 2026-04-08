import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";


export default function Result() {
  const [kit, setKit] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("brandKit");
    if (data) setKit(JSON.parse(data));
  }, []);

  if (!kit) return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#2255cc" }}>Loading your brand kit...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 50%, #e0f0ff 100%)", color: "#1a1a2e", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#00b4d8", letterSpacing: 4, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>NABADAI — AI BRAND IDENTITY</p>
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 8, color: "#2255cc" }}>{kit.brandName}</h1>
          <p style={{ color: "#5577aa" }}>Your custom brand kit is ready</p>
        </div>

        {/* Logo Concepts */}
        {kit.logos && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(34,85,204,0.10)", border: "1px solid #e0eaff" }}>
            <h2 style={{ color: "#2255cc", marginBottom: 20, fontSize: 14, letterSpacing: 3 }}>AI LOGO CONCEPTS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {kit.logos.map((url, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <img src={url} alt={`Logo concept ${i + 1}`} style={{ width: "100%", borderRadius: 12, background: "#f0f6ff", padding: 8, border: "1px solid #e0eaff" }} />
                  <p style={{ color: "#5577aa", fontSize: 12, marginTop: 8 }}>Concept {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slogans */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(34,85,204,0.10)", border: "1px solid #e0eaff" }}>
          <h2 style={{ color: "#2255cc", marginBottom: 20, fontSize: 14, letterSpacing: 3 }}>SLOGAN OPTIONS</h2>
          {[kit.slogan1, kit.slogan2, kit.slogan3].map((s, i) => (
            <div key={i} style={{ padding: "16px 20px", background: "#f0f6ff", borderRadius: 8, marginBottom: 12, borderLeft: "4px solid #2255cc" }}>
              <p style={{ margin: 0, fontSize: 18, fontStyle: "italic", color: "#1a1a2e" }}>"{s}"</p>
            </div>
          ))}
        </div>

        {/* Colors */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(34,85,204,0.10)", border: "1px solid #e0eaff" }}>
          <h2 style={{ color: "#2255cc", marginBottom: 20, fontSize: 14, letterSpacing: 3 }}>COLOR PALETTE</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {kit.colors.map((color, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: color, marginBottom: 8, boxShadow: `0 4px 16px ${color}66` }} />
                <p style={{ margin: 0, fontSize: 12, color: "#5577aa" }}>{kit.colorNames[i]}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#aab" }}>{color}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(34,85,204,0.10)", border: "1px solid #e0eaff" }}>
          <h2 style={{ color: "#2255cc", marginBottom: 20, fontSize: 14, letterSpacing: 3 }}>TYPOGRAPHY</h2>
          {kit.fonts.map((font, i) => (
            <div key={i} style={{ padding: "12px 20px", background: "#f0f6ff", borderRadius: 8, marginBottom: 12, border: "1px solid #e0eaff" }}>
              <p style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>{font}</p>
            </div>
          ))}
        </div>

        {/* Brand Profile */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(34,85,204,0.10)", border: "1px solid #e0eaff" }}>
          <h2 style={{ color: "#2255cc", marginBottom: 20, fontSize: 14, letterSpacing: 3 }}>BRAND PROFILE</h2>
          {[
            { label: "Brand Archetype", value: kit.brandArchetype },
            { label: "Brand Personality", value: kit.brandPersonality },
            { label: "Target Audience", value: kit.targetAudience },
            { label: "Tone of Voice", value: kit.toneOfVoice },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #e0eaff" }}>
              <p style={{ color: "#00b4d8", fontSize: 12, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>{label.toUpperCase()}</p>
              <p style={{ color: "#1a1a2e", margin: 0, lineHeight: 1.6 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: 32 }}>
          <p style={{ color: "#aab", fontSize: 12 }}>Generated by NabadAi — AI-Powered Digital Agency</p>
          <p style={{ color: "#2255cc", fontSize: 12, fontWeight: 600 }}>nabadai.com</p>
        </div>

      </div>
    </div>
  );
}
