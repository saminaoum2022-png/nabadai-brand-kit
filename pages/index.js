import { useState } from "react";
import { useRouter } from "next/router";

const translations = {
  en: {
    title: "AI Brand Identity Pack",
    subtitle: "Fill in your details and we'll generate your custom brand kit",
    q1: "What's your brand name?",
    q2: "What industry are you in?",
    q3: "Who are your ideal customers? (age, gender, lifestyle)",
    q4: "Pick 3 words that describe your brand personality",
    q5: "Any color preferences or colors to avoid?",
    q6: "Name 2-3 brands you admire or compete with",
    q7: "In one sentence, what does your brand stand for?",
    q8: "Preferred style",
    styles: ["Minimalist", "Bold", "Luxury", "Playful", "Corporate"],
    submit: "Generate My Brand Kit",
    generating: "Generating your brand kit...",
  },
  ar: {
    title: "حزمة الهوية البصرية بالذكاء الاصطناعي",
    subtitle: "أدخل تفاصيلك وسنقوم بإنشاء هوية علامتك التجارية",
    q1: "ما اسم علامتك التجارية؟",
    q2: "في أي مجال تعمل؟",
    q3: "من هم عملاؤك المثاليون؟ (العمر، الجنس، نمط الحياة)",
    q4: "اختر 3 كلمات تصف شخصية علامتك التجارية",
    q5: "هل لديك تفضيلات للألوان أو ألوان تريد تجنبها؟",
    q6: "اذكر 2-3 علامات تجارية تعجبك أو تنافسها",
    q7: "في جملة واحدة، ماذا تمثل علامتك التجارية؟",
    q8: "الأسلوب المفضل",
    styles: ["بسيط", "جريء", "فاخر", "مرح", "مؤسسي"],
    submit: "إنشاء هويتي التجارية",
    generating: "جاري إنشاء هويتك التجارية...",
  },
};

export default function Home() {
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brandName: "", industry: "", audience: "",
    personality: "", colors: "", competitors: "",
    mission: "", style: "",
  });
  const router = useRouter();
  const t = translations[lang];
  const isRTL = lang === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lang }),
    });
    const data = await res.json();
    localStorage.setItem("brandKit", JSON.stringify({ ...data, brandName: form.brandName }));
    router.push("/result");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 50%, #e0f0ff 100%)",
      color: "#1a1a2e",
      fontFamily: "sans-serif",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setLang("en")} style={{
              padding: "8px 20px", borderRadius: 20, border: "2px solid #2255cc",
              cursor: "pointer", fontWeight: "bold",
              background: lang === "en" ? "#2255cc" : "transparent",
              color: lang === "en" ? "#fff" : "#2255cc",
            }}>English</button>
            <button onClick={() => setLang("ar")} style={{
              padding: "8px 20px", borderRadius: 20, border: "2px solid #2255cc",
              cursor: "pointer", fontWeight: "bold",
              background: lang === "ar" ? "#2255cc" : "transparent",
              color: lang === "ar" ? "#fff" : "#2255cc",
            }}>العربية</button>
          </div>
          <h1 style={{ color: "#2255cc", fontSize: 32, marginBottom: 8, fontWeight: 800 }}>{t.title}</h1>
          <p style={{ color: "#5577aa" }}>{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {[
            { key: "brandName", label: t.q1 },
            { key: "industry", label: t.q2 },
            { key: "audience", label: t.q3 },
            { key: "personality", label: t.q4 },
            { key: "colors", label: t.q5 },
            { key: "competitors", label: t.q6 },
            { key: "mission", label: t.q7 },
          ].map(({ key, label }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#2255cc", fontWeight: 600 }}>{label}</label>
              <input
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 8,
                  background: "#ffffff", border: "2px solid #00b4d833",
                  color: "#1a1a2e", fontSize: 16, boxSizing: "border-box",
                  boxShadow: "0 2px 8px rgba(34,85,204,0.08)",
                  outline: "none",
                }}
              />
            </div>
          ))}

          {/* Style selector */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", marginBottom: 12, color: "#2255cc", fontWeight: 600 }}>{t.q8}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {t.styles.map((s, i) => (
                <button key={i} type="button" onClick={() => setForm({ ...form, style: s })}
                  style={{
                    padding: "10px 20px", borderRadius: 20,
                    border: "2px solid #2255cc",
                    cursor: "pointer",
                    background: form.style === s ? "#2255cc" : "#fff",
                    color: form.style === s ? "#fff" : "#2255cc",
                    fontWeight: 600,
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "16px", borderRadius: 8, border: "none",
            background: loading ? "#aac" : "linear-gradient(135deg, #2255cc, #00b4d8)",
            color: "#fff", fontSize: 18, fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(34,85,204,0.3)",
          }}>
            {loading ? t.generating : t.submit}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ color: "#aab", fontSize: 12 }}>Powered by NabadAi — AI-Powered Digital Agency</p>
        </div>
      </div>
    </div>
  );
}
