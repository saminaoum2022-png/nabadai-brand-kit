import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
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
      setStep('🧠 Generating your brand strategy...');
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      let kitData = data.data;

      if (form.businessType === 'product') {
        setStep('📦 Generating product mockups...');
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

  return (
    <>
      <Head>
        <title>NabadAi Brand Kit Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>✦ AI-Powered</div>
            <h1 style={styles.title}>Brand Kit Generator</h1>
            <p style={styles.subtitle}>Get a complete brand identity, legal foundation & marketing strategy in seconds</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Business Type Toggle */}
            <div style={styles.toggleGroup}>
              <p style={styles.label}>What are you building?</p>
              <div style={styles.toggle}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, businessType: 'product' })}
                  style={form.businessType === 'product' ? styles.toggleActive : styles.toggleInactive}
                >
                  📦 Product Business
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, businessType: 'service' })}
                  style={form.businessType === 'service' ? styles.toggleActive : styles.toggleInactive}
                >
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

            {/* What you'll get */}
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

            <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
              {loading ? step || '⏳ Generating...' : '✦ Generate My Brand Kit'}
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
  btnDisabled: { width: '100%', padding: '16px', background: '#1e1e2e', border: 'none', borderRadius: '10px', color: '#666', fontSize: '16px', fontWeight: '700', cursor: 'not-allowed', letterSpacing: '0.5px' }
};
