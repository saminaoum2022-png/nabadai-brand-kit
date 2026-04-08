import { useEffect, useState, useRef } from "react";

const LOGO_STYLES = [
  {
    name: "Neon Slash",
    render: (letters, color1, color2, font) => `
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="clip1">
            <rect x="0" y="0" width="180" height="180" rx="20"/>
          </clipPath>
        </defs>
        <rect width="180" height="180" rx="20" fill="#050d1a"/>
        <rect width="180" height="180" rx="20" fill="none" stroke="url(#g1)" stroke-width="2"/>
        <!-- Diagonal slash accent -->
        <line x1="120" y1="10" x2="60" y2="170" stroke="${color2}" stroke-width="3" opacity="0.3" filter="url(#glow1)"/>
        <line x1="135" y1="10" x2="75" y2="170" stroke="${color2}" stroke-width="1" opacity="0.15"/>
        <!-- Letters with glow -->
        <text x="90" y="115" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="80" font-weight="900" fill="url(#g1)" filter="url(#glow1)" letter-spacing="-4">${letters}</text>
        <!-- Bottom accent line -->
        <rect x="30" y="148" width="120" height="3" rx="2" fill="url(#g1)" opacity="0.8" filter="url(#glow1)"/>
        <!-- Corner dots -->
        <circle cx="20" cy="20" r="3" fill="${color2}" opacity="0.6"/>
        <circle cx="160" cy="160" r="3" fill="${color1}" opacity="0.6"/>
      </svg>
    `,
  },
  {
    name: "Split Depth",
    render: (letters, color1, color2, font) => `
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
          <linearGradient id="g2b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${color2};stop-opacity:0.2"/>
            <stop offset="100%" style="stop-color:${color1};stop-opacity:0.05"/>
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="clip2top">
            <rect x="0" y="0" width="180" height="88"/>
          </clipPath>
          <clipPath id="clip2bot">
            <rect x="0" y="92" width="180" height="88"/>
          </clipPath>
        </defs>
        <rect width="180" height="180" rx="20" fill="#050d1a"/>
        <!-- Background grid lines -->
        <line x1="0" y1="60" x2="180" y2="60" stroke="${color1}" stroke-width="0.5" opacity="0.1"/>
        <line x1="0" y1="120" x2="180" y2="120" stroke="${color1}" stroke-width="0.5" opacity="0.1"/>
        <line x1="60" y1="0" x2="60" y2="180" stroke="${color1}" stroke-width="0.5" opacity="0.1"/>
        <line x1="120" y1="0" x2="120" y2="180" stroke="${color1}" stroke-width="0.5" opacity="0.1"/>
        <!-- Shadow/depth letter (offset) -->
        <text x="94" y="114" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="82" font-weight="900" fill="${color1}" opacity="0.15" letter-spacing="-4">${letters}</text>
        <!-- Top half of letter in color -->
        <text x="90" y="112" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="82" font-weight="900" fill="url(#g2)" clip-path="url(#clip2top)" letter-spacing="-4">${letters}</text>
        <!-- Bottom half slightly offset + dimmed -->
        <text x="92" y="112" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="82" font-weight="900" fill="${color2}" opacity="0.4" clip-path="url(#clip2bot)" letter-spacing="-4">${letters}</text>
        <!-- Split line with glow -->
        <rect x="20" y="89" width="140" height="2" rx="1" fill="url(#g2)" filter="url(#glow2)"/>
        <!-- Border -->
        <rect width="180" height="180" rx="20" fill="none" stroke="${color2}" stroke-width="1.5" opacity="0.4"/>
      </svg>
    `,
  },
  {
    name: "Outlined Glow",
    render: (letters, color1, color2, font) => `
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
          </linearGradient>
          <filter id="glow3a">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow3b">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="180" height="180" rx="20" fill="#050d1a"/>
        <!-- Outer glow ring -->
        <circle cx="90" cy="90" r="75" fill="none" stroke="${color2}" stroke-width="1" opacity="0.2" filter="url(#glow3a)"/>
        <circle cx="90" cy="90" r="68" fill="none" stroke="${color1}" stroke-width="0.5" opacity="0.3"/>
        <!-- Glow behind letter -->
        <text x="90" y="115" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="86" font-weight="900" fill="${color2}" opacity="0.15" filter="url(#glow3a)" letter-spacing="-4">${letters}</text>
        <!-- Outlined letter (stroke only) -->
        <text x="90" y="115" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="86" font-weight="900" fill="none" stroke="url(#g3)" stroke-width="2" filter="url(#glow3b)" letter-spacing="-4">${letters}</text>
        <!-- Solid letter on top slightly smaller -->
        <text x="90" y="115" text-anchor="middle" font-family="${font}, Arial Black, sans-serif" font-size="86" font-weight="900" fill="url(#g3)" opacity="0.9" letter-spacing="-4">${letters}</text>
        <!-- Arc accent top -->
        <path d="M 40 40 Q 90 10 140 40" fill="none" stroke="${color2}" stroke-width="1.5" opacity="0.4" filter="url(#glow3b)"/>
        <!-- Arc accent bottom -->
        <path d="M 40 140 Q 90 170 140 140" fill="none" stroke="${color1}" stroke-width="1.5" opacity="0.4" filter="url(#glow3b)"/>
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

  const handleDownload = () => window.print();

  const downloadSVG = (svgString, name) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-logo.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
        @import url('https://fonts.googleapis.com/css2?family=${(kit.fonts?.[0] || "Inter").replace(/ /g, "+")}:wght@400;700;900&family=${(kit.fonts?.[1] || "Inter").replace(/ /g, "+")}:wght@400;700&display=swap');
        @media print {
          body { background: #050d1a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
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
              {LOGO_STYLES.map((logoStyle, i) => {
                const svgString = logoStyle.render(letters, color1, color2, font);
                return (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ background: "#050d1a", borderRadius: 12, padding: 16, marginBottom: 10, border: "1px solid #1a3a6a", display: "flex", alignItems: "center", justifyContent: "center" }}
                      dangerouslySetInnerHTML={{ __html: svgString }}
                    />
                    <p style={{ color: "#5577aa", fontSize: 12, margin: "0 0 8px" }}>{logoStyle.name}</p>
                    <button
                      className="no-print"
                      onClick={() => downloadSVG(svgString, `${kit.brandName}-${logoStyle.name}`)}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #1a3a6a", background: "transparent", color: "#00b4d8", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                    >
                      ↓ Download SVG
                    </button>
                  </div>
                );
              })}
            </div>
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

          {/* Typography - rendered in actual font */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>TYPOGRAPHY</h2>
            {kit.fonts?.map((fontName, i) => (
              <div key={i} style={{ padding: "24px", background: "#050d1a", borderRadius: 10, marginBottom: 12, border: "1px solid #1a3a6a" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#00b4d8", letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>{kit.fontRoles?.[i]?.toUpperCase()}</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: `'${fontName}', sans-serif` }}>
                  {fontName}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 15, color: "#8899bb", fontFamily: `'${fontName}', sans-serif` }}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#3a5a8a", fontFamily: `'${fontName}', sans-serif` }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                </p>
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

          {/* Download PDF Button */}
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
