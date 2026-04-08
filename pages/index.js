import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const LOADING_MESSAGES = [
  "Scanning brand DNA...",
  "Analyzing your industry...",
  "Generating color palette...",
  "Crafting your slogans...",
  "Building typography system...",
  "Mining SEO keywords...",
  "Writing your brand story...",
  "Assembling your identity...",
  "Almost ready...",
];

function LogoLoader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)" }}>
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
        .ring1-wrap { animation: ring1 3.2s ease-in-out infinite; transform-origin: center; }
        .ring2-wrap { animation: ring2 3.8s ease-in-out infinite; transform-origin: center; }
        .ring3-wrap { animation: ring3 2.9s ease-in-out infinite; transform-origin: center; }
        .core-wrap { animation: corePulse 2.4s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div style={{ position: "relative", width: 240, height: 240, marginBottom: 40 }}>

        {/* Outer glow */}
        <div style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)",
          animation: "corePulse 2.4s ease-in-out infinite"
        }} />

        {/* Scan line */}
        <div style={{
          position: "absolute", top: "50%", left: "10%", width: "80%", height: 2,
          background: "linear-gradient(90deg, transparent, #00b4d8, transparent)",
          borderRadius: 2, animation: "scanLine 2.4s ease-in-out infinite",
          zIndex: 10,
        }} />

        {/* Ring 1 - outer */}
        <div className="ring1-wrap" style={{ position: "absolute", inset: 0 }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.5, filter: "hue-rotate(10deg) brightness(1.2)" }}
            alt=""
          />
        </div>

        {/* Ring 2 - mid */}
        <div className="ring2-wrap" style={{ position: "absolute", inset: 20 }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.6, filter: "hue-rotate(-20deg) brightness(1.3) saturate(1.4)" }}
            alt=""
          />
        </div>

        {/* Ring 3 - inner */}
        <div className="ring3-wrap" style={{ position: "absolute", inset: 40 }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0822/6953/6481/files/download_1775583690592_faf21f31-373e-4e61-bb01-04c13f1bce34.jpg?v=1775654198"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.8, filter: "hue-rotate(30deg) brightness(1.5) saturate(1.6)" }}
            alt=""
          />
        </div>

        {/* Core pulse */}
        <div className="core-wrap" style={{
          position: "absolute", inset: 70, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.3) 0%, transparent 70%)",
        }} />

        {/* Orbiting particles */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 6, height: 6,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#00b4d8" : "#2255cc",
            boxShadow: `0 0 8px ${i % 2 === 0 ? "#00b4d8" : "#2255cc"}`,
            transform: `rotate(${deg}deg) translateX(110px)`,
            animation: `ring${(i % 3) + 1} ${2.5 + i * 0.3}s ease-in-out infinite`,
            transformOrigin: "-110px 0",
          }} />
        ))}
      </div>

      {/* Cycling message */}
      <div style={{ height: 32, overflow: "hidden", textAlign: "center" }}>
        <p key={msgIndex} style={{
          color: "#00b4d8", fontSize: 15, fontFamily: "sans-serif", fontWeight: 600,
          letterSpacing: 2, margin: 0, animation: "fadeMsg 1.8s ease-in-out forwards"
        }}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      <p style={{ color: "#3a5a8a", fontSize: 12, fontFamily: "sans-serif", marginTop: 12, letterSpacing: 1 }}>
        NABADAI AI ENGINE RUNNING
      </p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brandName: "", industry: "", audience: "", personality: "",
    colorPrefs: "", competitors: "", brandStory: "", style: "Minimalist",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      const data = await res.json();
      localStorage.setItem("brandKit", JSON.stringify({ ...data, brandName: form.brandName, style: form.style }));
      router.push("/result");
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #1a3a6a",
    background: "#0a1628", color: "#fff", fontSize: 15, marginBottom: 20,
    boxSizing: "border-box", outline: "none",
  };
  const labelStyle = { color: "#00b4d8", fontSize: 12, letterSpacing: 2, fontWeight: 700, marginBottom: 6, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #0d1f3c 100%)", color: "#fff", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#00b4d8", letterSpacing: 4, fontSize: 11, marginBottom: 12, fontWeight: 700 }}>NABADAI — AI BRAND IDENTITY</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, background: "linear-gradient(90deg, #fff, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Build Your Brand Kit
          </h1>
          <p style={{ color: "#5577aa", fontSize: 15 }}>Answer 8 questions. Get a complete AI-powered brand identity.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { key: "brandName", label: "BRAND NAME", placeholder: "e.g. NabadAi" },
            { key: "industry", label: "INDUSTRY", placeholder: "e.g. Tech, Fashion, Food, Fitness..." },
            { key: "audience", label: "TARGET AUDIENCE", placeholder: "e.g. Young professionals aged 25-35 in UAE" },
            { key: "personality", label: "BRAND PERSONALITY (3 WORDS)", placeholder: "e.g. Bold, Elegant, Trustworthy" },
            { key: "colorPrefs", label: "COLOR PREFERENCES", placeholder: "e.g. Deep blue, cyan, white — no dark backgrounds" },
            { key: "competitors", label: "BRANDS YOU ADMIRE", placeholder: "e.g. Apple, Nike, Notion" },
            { key: "brandStory", label: "BRAND STORY (ONE SENTENCE)", placeholder: "e.g. We help businesses grow using AI-powered tools" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle} placeholder={placeholder} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
            </div>
          ))}

          <label style={labelStyle}>STYLE PREFERENCE</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}>
            {["Minimalist", "Bold", "Luxury", "Playful", "Corporate", "Futuristic"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button type="submit" style={{
            width: "100%", padding: "16px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(90deg, #2255cc, #00b4d8)",
            color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: 1, marginTop: 8,
          }}>
            Generate My Brand Kit →
          </button>
        </form>
      </div>
    </div>
  );
}
