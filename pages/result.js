import { useEffect, useState, useRef } from "react";

const LOGO_STYLES = [
  {
    name: "Hexagon Badge",
    render: (letters, color1, color2, font) => `
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
        </defs>
        <polygon points="80,8 148,44 148,116 80,152 12,116 12,44" fill="url(#g1)" stroke="${color2}" stroke-width="2"/>
        <polygon points="80,20 136,52 136,108 80,140 24,108 24,52" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <text x="80" y="95" text-anchor="middle" font-family="${font}, sans-serif" font-size="52" font-weight="900" fill="white">${letters}</text>
      </svg>
    `,
  },
  {
    name: "Circle Monogram",
    render: (letters, color1, color2, font) => `
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="url(#g2)"/>
        <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
        <circle cx="80" cy="80" r="56" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="80" y="97" text-anchor="middle" font-family="${font}, sans-serif" font-size="56" font-weight="900" fill="white" letter-spacing="-2">${letters}</text>
      </svg>
    `,
  },
  {
    name: "Geometric Modern",
    render: (letters, color1, color2, font) => `
      <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="144" height="144" rx="24" fill="url(#g3)"/>
        <rect x="8" y="108" width="144" height="44" rx="0" fill="rgba(0,0,0,0.25)"/>
        <rect x="8" y="132" width="144" height="20" rx="0" ry="0" fill="rgba(0,0,0,0.15)"/>
        <rect x="8" y="148" width="144" height="4" rx="0" fill="${color2}" opacity="0.8"/>
        <text x="80" y="90" text-anchor="middle" font-family="${font}, sans-serif" font-size="64" font-weight="900" fill="white">${letters}</text>
        <rect x="30" y="108" width="100" height="1.5" fill="rgba(255,255,255,0.3)"/>
        <text x="80" y="130" text-anchor="middle" font-family="${font}, sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.7)" letter-spacing="4">BRAND</text>
      </svg>
    `,
  },
];

export default function Result() {
  const [kit, setKit] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem("brandKit");
    if (data) setKit(JSON.parse(data));
  }, []);

  const handleDownload = () => {
    window.print();
  };

  if (!kit) return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#00b4d8", fontFamily: "sans-serif" }}>Loading your brand kit...</p>
    </div>
  );

  const letters = kit.brandName.replace(/[^a-zA-Z]/g, "").substring(0, 2).toUpperCase();
  const color1 = kit.colors?.[0] || "#2255cc";
  const color2 = kit.colors?.[1] || "#00b4d8";
  const font = kit.fonts?.[0] || "Arial";

  const sectionStyle = {
    background: "#0a1628", borderRadius: 16, padding: 32, marginBottom: 24,
    border: "1px solid #1a3a6a", boxShadow: "0 4px 24px rgba(0,180,216,0.08)"
  };
  const headingStyle = { color: "#00b4d8", fontSize: 11, letterSpacing: 4, fontWeight: 700, marginBottom: 20 };

  return (
    <>
      <style>{`
        @media print {
          body { background: #050d1a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-page { page-break-after: always; }
        }
      `}</style>

      <div ref={printRef} style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)", color: "#fff", fontFamily: "sans-serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#00b4d8", letterSpacing: 4, fontSize: 11, marginBottom: 12, fontWeight: 700 }}>NABADAI — AI BRAND IDENTITY</p>
            <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8, background: "linear-gradient(90deg, #fff, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {kit.brandName}
            </h1>
            <p style={{ color: "#5577aa" }}>Your complete brand kit is ready</p>
          </div>

          {/* Lettermark Logos */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>LETTERMARK LOGO CONCEPTS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {LOGO_STYLES.map((logoStyle, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ background: "#050d1a", borderRadius: 12, padding: 20, marginBottom: 10, border: "1px solid #1a3a6a", display: "flex", alignItems: "center", justifyContent: "center" }}
                    dangerouslySetInnerHTML={{ __html: logoStyle.render(letters, color1, color2, font) }}
                  />
                  <p style={{ color: "#5577aa", fontSize: 12, margin: 0 }}>{logoStyle.name}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "#3a5a8a", fontSize: 12, marginTop: 16, textAlign: "center" }}>
              💡 These are SVG lettermarks — scalable to any size, ready to use
            </p>
          </div>

          {/* Slogans */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>SLOGAN OPTIONS</h2>
            {kit.slogans?.map((s, i) => (
              <div key={i} style={{ padding: "16px 20px", background: "#050d1a", borderRadius: 8, marginBottom: 12, borderLeft: `4px solid ${kit.colors?.[i] || "#00b4d8"}` }}>
                <p style={{ margin: 0, fontSize: 18, fontStyle: "italic", color: "#fff" }}>"{s}"</p>
              </div>
            ))}
          </div>

          {/* Color Palette */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>COLOR PALETTE</h2>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {kit.colors?.map((color, i) => (
                <div key={i} style={{ textAlign: "center", flex: "1", minWidth: 80 }}>
                  <div style={{ height: 80, borderRadius: 12, background: color, marginBottom: 10, boxShadow: `0 4px 20px ${color}55` }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#fff", fontWeight: 600 }}>{kit.colorNames?.[i]}</p>
                  <p style={{ margin: "4px 0", fontSize: 11, color: "#5577aa" }}>{color}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#3a5a8a" }}>{kit.colorUsage?.[i]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>TYPOGRAPHY</h2>
            {kit.fonts?.map((font, i) => (
              <div key={i} style={{ padding: "20px 24px", background: "#050d1a", borderRadius: 10, marginBottom: 12, border: "1px solid #1a3a6a" }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#fff" }}>{font}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#00b4d8", letterSpacing: 2 }}>{kit.fontRoles?.[i]}</p>
              </div>
            ))}
          </div>

          {/* SEO Keywords */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>10 SEO BRAND KEYWORDS</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {kit.keywords?.map((kw, i) => (
                <span key={i} style={{ padding: "8px 16px", background: "#050d1a", borderRadius: 20, border: "1px solid #1a3a6a", color: "#00b4d8", fontSize: 13, fontWeight: 600 }}>
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Email Template */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>BRAND INTRO EMAIL TEMPLATE</h2>
            <div style={{ background: "#050d1a", borderRadius: 10, padding: 24, border: "1px solid #1a3a6a" }}>
              <pre style={{ margin: 0, color: "#c0d8f0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}>
                {kit.emailTemplate}
              </pre>
            </div>
          </div>

          {/* Download Button */}
          <div className="no-print" style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "16px 48px", borderRadius: 10, border: "none", cursor: "pointer",
                background: "linear-gradient(90deg, #2255cc, #00b4d8)",
                color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: 1,
              }}
            >
              📄 Download Brand Kit PDF
            </button>
            <p style={{ color: "#3a5a8a", fontSize: 12, marginTop: 12 }}>Opens print dialog — save as PDF</p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", padding: 24, borderTop: "1px solid #1a3a6a" }}>
            <p style={{ color: "#3a5a8a", fontSize: 12 }}>Generated by NabadAi — AI-Powered Digital Agency</p>
          </div>

        </div>
      </div>
    </>
  );
}
