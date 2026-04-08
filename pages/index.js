import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    industry: "",
    audience: "",
    personality: "",
    colorPrefs: "",
    competitors: "",
    brandStory: "",
    style: "Minimalist",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
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
    background: "#0a1628", color: "#fff", fontSize: 15, marginBottom: 20, boxSizing: "border-box",
    outline: "none",
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
              <input
                style={inputStyle}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            </div>
          ))}

          <label style={labelStyle}>STYLE PREFERENCE</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}
          >
            {["Minimalist", "Bold", "Luxury", "Playful", "Corporate", "Futuristic"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "16px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#1a3a6a" : "linear-gradient(90deg, #2255cc, #00b4d8)",
              color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: 1, marginTop: 8,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "✨ Generating Your Brand Kit..." : "Generate My Brand Kit →"}
          </button>
        </form>
      </div>
    </div>
  );
}
