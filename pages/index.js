import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0a0f" }}>
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
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px #00c8d4); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 28px #00c8d4) drop-shadow(0 0 48px #0066ff); }
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
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(110px); }
          100% { transform: rotate(360deg) translateX(110px); }
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
          background: "radial-gradient(circle, rgba(0,200,212,0.12) 0%, transparent 70%)",
          animation: "corePulse 2.4s ease-in-out infinite"
        }} />

        {/* Scan line */}
        <div style={{
          position: "absolute", top: "50%", left: "10%", width: "80%", height: 2,
          background: "linear-gradient(90deg, transparent, #00c8d4, transparent)",
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
          background: "radial-gradient(circle, rgba(0,200,212,0.3) 0%, transparent 70%)",
        }} />

        {/* Orbiting particles */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 6, height: 6,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#00c8d4" : "#0066ff",
            boxShadow: `0 0 8px ${i % 2 === 0 ? "#00c8d4" : "#0066ff"}`,
            transform: `rotate(${deg}deg) translateX(110px)`,
            animation: `ring${(i % 3) + 1} ${2.5 + i * 0.3}s ease-in-out infinite`,
            transformOrigin: "-110px 0",
          }} />
        ))}
      </div>

      {/* Cycling message */}
      <div style={{ height: 32, overflow: "hidden", textAlign: "center" }}>
        <p key={msgIndex} style={{
          color: "#00c8d4", fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 600,
          letterSpacing: 2, margin: 0, animation: "fadeMsg 1.8s ease-in-out forwards"
        }}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      <p style={{ color: "#333", fontSize: 12, fontFamily: "'Inter', sans-serif", marginTop: 12, letterSpacing: 1 }}>
        NABADAI AI ENGINE RUNNING
      </p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    description: '',
    audience: '',
    budget: '',
    businessType: 'product',
    productType: ''
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
          body: JSON.stringify({
            businessName: form.businessName,
            industry: form.industry,
            productType: form.productType,
            colors: kitData.colors
          })
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
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.badge}>✦ AI-Powered</div>
            <h1 style={styles.title}>Brand Kit Generator</h1>
            <p style={styles.subtitle}>Get a complete brand identity, legal foundation & marketing strategy in seconds</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.toggleGroup}>
              <p style={styles.label}>What are you building?</p>
              <div style={styles.toggle}>
                <button type="button" onClick={() => setForm({ ...form, businessType: 'product' })}
                  style={form.businessType === 'product' ? styles.toggleActive : styles.toggleInactive}>
                  📦 Product Business
                </button>
                <button type="button" onClick={() => setForm({ ...form, businessType: 'service' })}
                  style={form.businessType === 'service' ? styles.toggleActive : styles.toggleInactive}>
                  🏢 Service Business
                </button>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Business Name *</label>
                <input name="businessName" required value={form.businessName} onChange={handleChange} placeholder="e.g. NabadAi" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Industry / Niche *</label>
                <input name="industry" required value={form.industry} onChange={handleChange} placeholder="e.g. AI Technology, Fashion, Food" style={styles.input} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Business Description *</label>
              <textarea name="description" required value={form.description} onChange={handleChange} placeholder="What does your business do? What problem does it solve?" style={styles.textarea} rows={3} />
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Target Audience *</label>
                <input name="audience" required value={form.audience} onChange={handleChange} placeholder="e.g. Young professionals 25-35" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange} style={styles.input}>
                  <option value="">Select budget</option>
                  <option value="bootstrap">Bootstrap ($0 - $1K)</option>
                  <option value="startup">Startup ($1K - $10K)</option>
                  <option value="growth">Growth ($10K - $50K)</option>
                  <option value="enterprise">Enterprise ($50K+)</option>
                </select>
              </div>
            </div>

            {form.businessType === 'product' && (
              <div style={styles.field}>
                <label style={styles.label}>Product Type</label>
                <input name="productType" value={form.productType} onChange={handleChange} placeholder="e.g. Skincare, Food & Beverage, Electronics, Clothing" style={styles.input} />
              </div>
            )}

            <div style={styles.deliverables}>
              <p style={styles.deliverablesTitle}>✦ What you'll receive</p>
              <div style={styles.delGrid}>
                <span style={styles.delItem}>🎨 Color Palette</span>
                <span style={styles.delItem}>✍️ Typography</span>
                <span style={styles.delItem}>💡 3 Slogans</span>
                <span style={styles.delItem}>🗣️ Brand Voice</span>
                <span style={styles.delItem}>⚖️ Legal Guide</span>
                <span style={styles.delItem}>📱 Marketing Kit</span>
                <span style={styles.delItem}>🖼️ Logo Concepts</span>
                {form.businessType === 'product' ? <span style={styles.delItem}>📦 Mockups</span> : <span style={styles.delItem}>🏢 Service Kit</span>}
                <span style={styles.delItem}>📄 PDF Download</span>
              </div>
            </div>

            <button type="submit" style={styles.btn}>
              ✦ Generate My Brand Kit
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Inter', sans-serif" },
  container: { width: '100%', maxWidth: '680px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  badge: { display: 'inline-block', background: 'rgba(0,200,212,0.1)', border: '1px solid rgba(0,200,212,0.3)', color: '#00c8d4', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '20px' },
  title: { fontSize: '42px', fontWeight: '700', color: '#ffffff', margin: '0 0 12px', letterSpacing: '-1px' },
  subtitle: { color: '#888', fontSize: '16px', margin: 0 },
  form: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '36px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '8px', fontWeight: '500' },
  input: { width: '100%', background: '#0a0a0f', border: '1px solid #2a2a3e', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', background: '#0a0a0f', border: '1px solid #2a2a3e', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' },
  toggleGroup: { marginBottom: '24px' },
  toggle: { display: 'flex', gap: '12px', marginTop: '8px' },
  toggleActive: { flex: 1, padding: '12px', background: 'rgba(0,200,212,0.15)', border: '1px solid #00c8d4', borderRadius: '8px', color: '#00c8d4', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  toggleInactive: { flex: 1, padding: '12px', background: '#0a0a0f', border: '1px solid #2a2a3e', borderRadius: '8px', color: '#666', cursor: 'pointer', fontSize: '14px' },
  deliverables: { background: 'rgba(0,200,212,0.05)', border: '1px solid rgba(0,200,212,0.15)', borderRadius: '10px', padding: '20px', marginBottom: '24px' },
  deliverablesTitle: { color: '#00c8d4', fontSize: '13px', fontWeight: '600', margin: '0 0 12px' },
  delGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  delItem: { color: '#ccc', fontSize: '13px' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00c8d4, #0066ff)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' },
};
