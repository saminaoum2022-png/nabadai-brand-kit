import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const LOGO_URL = 'https://cdn.shopify.com/s/files/1/0822/6953/6481/files/IMG-6520.png?v=1775730509';

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(160deg, #dff0f7 0%, #ffffff 100%)" }}>
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
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(26,35,126,0.3)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 28px rgba(26,35,126,0.5)); }
        }
        @keyframes fadeMsg {
          0% { opacity: 0; transform: translateY(8px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-120px); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(120px); opacity: 0; }
        }
        .ring1-wrap { animation: ring1 3.2s ease-in-out infinite; transform-origin: center; }
        .ring2-wrap { animation: ring2 3.8s ease-in-out infinite; transform-origin: center; }
        .ring3-wrap { animation: ring3 2.9s ease-in-out infinite; transform-origin: center; }
        .core-wrap { animation: corePulse 2.4s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div style={{ position: "relative", width: 200, height: 200, marginBottom: 40 }}>
        <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,35,126,0.08) 0%, transparent 70%)", animation: "corePulse 2.4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "50%", left: "10%", width: "80%", height: 2, background: "linear-gradient(90deg, transparent, #1a237e, transparent)", borderRadius: 2, animation: "scanLine 2.4s ease-in-out infinite", zIndex: 10 }} />

        <div className="ring1-wrap" style={{ position: "absolute", inset: 0 }}>
          <img src={LOGO_URL} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.6, mixBlendMode: "multiply" }} alt="" />
        </div>
        <div className="ring2-wrap" style={{ position: "absolute", inset: 20 }}>
          <img src={LOGO_URL} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.5, mixBlendMode: "multiply" }} alt="" />
        </div>
        <div className="ring3-wrap" style={{ position: "absolute", inset: 40 }}>
          <img src={LOGO_URL} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.9, mixBlendMode: "multiply" }} alt="" />
        </div>

        <div className="core-wrap" style={{ position: "absolute", inset: 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,35,126,0.15) 0%, transparent 70%)" }} />

        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 5, height: 5, borderRadius: "50%",
            background: i % 2 === 0 ? "#1a237e" : "#4fc3f7",
            boxShadow: `0 0 6px ${i % 2 === 0 ? "#1a237e" : "#4fc3f7"}`,
            transform: `rotate(${deg}deg) translateX(95px)`,
            animation: `ring${(i % 3) + 1} ${2.5 + i * 0.3}s ease-in-out infinite`,
            transformOrigin: "-95px 0",
          }} />
        ))}
      </div>

      <div style={{ height: 32, overflow: "hidden", textAlign: "center" }}>
        <p key={msgIndex} style={{
          color: "#1a237e", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: 600,
          letterSpacing: 2, margin: 0, animation: "fadeMsg 1.8s ease-in-out forwards"
        }}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
      <p style={{ color: "#aaa", fontSize: 11, fontFamily: "Georgia, serif", marginTop: 12, letterSpacing: 2 }}>
        NABADAI AI ENGINE
      </p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', industry: '', description: '',
    audience: '', budget: '', businessType: 'product', productType: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      let kitData = data.data;
      if (form.businessType === 'product') {
        const mockupRes = await fetch('/api/mockup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessName: form.businessName, industry: form.industry, productType: form.productType, colors: kitData.colors })
        });
        const mockupData = await mockupRes.json();
        if (mockupData.success) kitData.mockups = mockupData.mockups;
      }
      sessionStorage.setItem('brandKit', JSON.stringify(kitData));
      router.push('/result');
    } catch (err) {
      alert('Error: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) return <LogoLoader />;

  return (
    <>
      <Head>
        <title>NabadAi Brand Kit Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>
        <div style={s.container}>

          <div style={s.header}>
            <img src={LOGO_URL} style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 20, mixBlendMode: "multiply" }} alt="NabadAi" />
            <p style={s.eyebrow}>AI-Powered Brand Identity</p>
            <h1 style={s.title}>Build Your Brand Kit</h1>
            <p style={s.subtitle}>Answer a few questions. Get a complete brand identity in seconds.</p>
          </div>

          <div style={s.card}>
            <form onSubmit={handleSubmit}>

              <div style={s.section}>
                <p style={s.sectionLabel}>What are you building?</p>
                <div style={s.toggle}>
                  <button type="button" onClick={() => setForm({ ...form, businessType: 'product' })}
                    style={form.businessType === 'product' ? s.toggleActive : s.toggleInactive}>
                    Product Business
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, businessType: 'service' })}
                    style={form.businessType === 'service' ? s.toggleActive : s.toggleInactive}>
                    Service Business
                  </button>
                </div>
              </div>

              <div style={s.divider} />

              <div style={s.grid}>
                <div>
                  <label style={s.label}>Business Name</label>
                  <input name="businessName" required value={form.businessName} onChange={handleChange} placeholder="e.g. NabadAi" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Industry</label>
                  <input name="industry" required value={form.industry} onChange={handleChange} placeholder="e.g. AI Technology" style={s.input} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>Business Description</label>
                <textarea name="description" required value={form.description} onChange={handleChange}
                  placeholder="What does your business do? What problem does it solve?"
                  style={s.textarea} rows={3} />
              </div>

              <div style={s.grid}>
                <div>
                  <label style={s.label}>Target Audience</label>
                  <input name="audience" required value={form.audience} onChange={handleChange} placeholder="e.g. Professionals 25–35" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Budget Range</label>
                  <select name="budget" value={form.budget} onChange={handleChange} style={s.input}>
                    <option value="">Select budget</option>
                    <option value="bootstrap">Bootstrap ($0–$1K)</option>
                    <option value="startup">Startup ($1K–$10K)</option>
                    <option value="growth">Growth ($10K–$50K)</option>
                    <option value="enterprise">Enterprise ($50K+)</option>
                  </select>
                </div>
              </div>

              {form.businessType === 'product' && (
                <div style={{ marginBottom: 20 }}>
                  <label style={s.label}>Product Type</label>
                  <input name="productType" value={form.productType} onChange={handleChange}
                    placeholder="e.g. Skincare, Electronics, Clothing" style={s.input} />
                </div>
              )}

              <div style={s.divider} />

              <div style={s.deliverables}>
                <p style={s.delTitle}>What you'll receive</p>
                <div style={s.delGrid}>
                  {['Color Palette', 'Typography', '3 Slogans', 'Brand Voice', 'Legal Guide', 'Marketing Kit', 'Logo Concepts', form.businessType === 'product' ? 'Mockups' : 'Service Kit', 'PDF Download'].map((item) => (
                    <div key={item} style={s.delItem}>
                      <span style={s.delDot} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" style={s.btn}>
                Generate My Brand Kit
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #dff0f7 0%, #ffffff 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', fontFamily: "'Inter', sans-serif" },
  container: { width: '100%', maxWidth: '660px' },
  header: { textAlign: 'center', marginBottom: '48px' },
  eyebrow: { color: '#4fc3f7', fontSize: '12px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 16px' },
  title: { fontSize: '40px', fontWeight: '700', color: '#1a237e', margin: '0 0 14px', fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.2 },
  subtitle: { color: '#666', fontSize: '16px', margin: 0, lineHeight: 1.6 },
  card: { background: '#ffffff', borderRadius: '20px', padding: '40px', boxShadow: '0 8px 40px rgba(26,35,126,0.08)', border: '1px solid rgba(26,35,126,0.06)' },
  section: { marginBottom: '24px' },
  sectionLabel: { color: '#1a237e', fontSize: '13px', fontWeight: '600', marginBottom: '12px', letterSpacing: '0.5px' },
  toggle: { display: 'flex', gap: '10px' },
  toggleActive: { flex: 1, padding: '12px', background: '#1a237e', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  toggleInactive: { flex: 1, padding: '12px', background: '#f5f7ff', border: '1px solid #e0e4f0', borderRadius: '10px', color: '#888', cursor: 'pointer', fontSize: '14px' },
  divider: { height: 1, background: '#f0f2f8', margin: '24px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  label: { display: 'block', color: '#555', fontSize: '12px', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { width: '100%', background: '#f8f9fc', border: '1px solid #e8eaf0', borderRadius: '10px', padding: '12px 14px', color: '#1a237e', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: "'Inter', sans-serif" },
  textarea: { width: '100%', background: '#f8f9fc', border: '1px solid #e8eaf0', borderRadius: '10px', padding: '12px 14px', color: '#1a237e', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: "'Inter', sans-serif" },
  deliverables: { background: '#f5f7ff', borderRadius: '12px', padding: '20px', marginBottom: '28px' },
  delTitle: { color: '#1a237e', fontSize: '12px', fontWeight: '700', margin: '0 0 14px', letterSpacing: '1px', textTransform: 'uppercase' },
  delGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  delItem: { color: '#555', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
  delDot: { width: 5, height: 5, borderRadius: '50%', background: '#1a237e', display: 'inline-block', flexShrink: 0 },
  btn: { width: '100%', padding: '16px', background: '#1a237e', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" },
};
