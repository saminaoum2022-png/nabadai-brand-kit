import { useEffect, useState } from 'react';
import Head from 'next/head';

const LOGO_URL = 'https://cdn.shopify.com/s/files/1/0822/6953/6481/files/IMG-6520.png?v=1775730509';

export default function Result() {
  const [kit, setKit] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('brandKit');
    if (data) setKit(JSON.parse(data));
    else window.location.href = '/';
  }, []);

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const element = document.getElementById('brand-kit-content');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${kit.businessName}-brand-kit.pdf`);
  };

  if (!kit) return (
    <div style={{ background: 'linear-gradient(160deg, #dff0f7 0%, #ffffff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a237e', fontFamily: 'Inter, sans-serif' }}>
      Loading your brand kit...
    </div>
  );

  return (
    <>
      <Head>
        <title>{kit.businessName} — Brand Kit</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>

        {/* Nav */}
        <div style={s.nav}>
          <img src={LOGO_URL} style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'multiply' }} alt="NabadAi" />
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => window.location.href = '/'} style={s.btnSecondary}>← New Kit</button>
            <button onClick={downloadPDF} style={s.btnPrimary}>📄 Download PDF</button>
          </div>
        </div>

        <div id="brand-kit-content" style={s.container}>

          {/* Header */}
          <div style={s.header}>
            <p style={s.eyebrow}>✦ NabadAi Brand Kit</p>
            <h1 style={s.title}>{kit.businessName}</h1>
            <p style={s.subtitle}>{kit.industry} · {kit.businessType === 'product' ? 'Product Business' : 'Service Business'}</p>
          </div>

          {/* Color Palette */}
          <Section title="Color Palette">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {kit.colors?.map((c, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: i === 0 ? 72 : i === 1 ? 60 : 48,
                    height: i === 0 ? 72 : i === 1 ? 60 : 48,
                    borderRadius: '50%',
                    background: c.hex,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    border: '3px solid #fff',
                    marginBottom: 8,
                  }} />
                  <p style={{ fontSize: 10, color: '#888', margin: 0, fontFamily: 'monospace' }}>{c.hex}</p>
                  <p style={{ fontSize: 11, color: '#1a237e', margin: '2px 0 0', fontWeight: 600 }}>{c.name}</p>
                  {c.usage && <p style={{ fontSize: 10, color: '#aaa', margin: '2px 0 0', maxWidth: 72 }}>{c.usage}</p>}
                </div>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div style={s.grid2}>
              {kit.typography?.map((t, i) => (
                <div key={i} style={s.card}>
                  <p style={s.cardLabel}>{t.role}</p>
                  <p style={{ color: '#1a237e', fontSize: 22, fontWeight: 700, margin: '4px 0' }}>{t.name}</p>
                  <p style={{ color: '#666', fontSize: 13, margin: 0 }}>{t.style}</p>
                  <p style={{ color: '#aaa', fontSize: 12, margin: '4px 0 0' }}>Pairs with: {t.pairedWith}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Slogans */}
          <Section title="Brand Slogans">
            {kit.slogans?.map((slogan, i) => (
              <div key={i} style={{ ...s.card, marginBottom: 10, fontSize: 18, fontWeight: 600, color: '#1a237e', fontStyle: 'italic', fontFamily: "'Playfair Display', Georgia, serif" }}>
                "{slogan}"
              </div>
            ))}
          </Section>

          {/* Logo Concepts */}
          <Section title="Logo Concepts">
            <div style={s.grid3}>
              {kit.logos?.map((url, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e8eaf0', background: '#f8f9fc' }}>
                  <img src={url} alt={`Logo concept ${i + 1}`} style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                  <div style={{ background: '#fff', padding: '10px', textAlign: 'center', borderTop: '1px solid #e8eaf0' }}>
                    <a href={url} download={`logo-concept-${i + 1}.png`} style={{ color: '#1a237e', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>⬇ Download</a>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Midjourney Prompts */}
          <Section title="Midjourney Logo Prompts">
            {kit.midjourneyPrompts?.map((p, i) => (
              <div key={i} style={{ ...s.card, marginBottom: 10, fontFamily: 'monospace', fontSize: 13, color: '#4fc3f7' }}>
                /imagine {p}
              </div>
            ))}
          </Section>

          {/* Brand Voice */}
          <Section title="Brand Voice">
            <div style={s.card}>
              <p style={{ color: '#1a237e', marginBottom: 16 }}><strong>Tone:</strong> {kit.brandVoice?.tone}</p>
              <div style={s.grid2}>
                <div>
                  <p style={{ color: '#2e7d32', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>✅ Do</p>
                  {kit.brandVoice?.doList?.map((d, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>• {d}</p>)}
                </div>
                <div>
                  <p style={{ color: '#c62828', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>❌ Don't</p>
                  {kit.brandVoice?.dontList?.map((d, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>• {d}</p>)}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <p style={s.cardLabel}>📱 Sample Captions</p>
                {kit.brandVoice?.captions?.map((c, i) => (
                  <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid #1a237e' }}>{c}</p>
                ))}
              </div>
            </div>
          </Section>

          {/* Legal */}
          <Section title="Legal Foundation">
            <div style={s.card}>
              <InfoRow label="Business Structure" value={kit.legal?.businessStructure} />
              <InfoRow label="Trademark Advice" value={kit.legal?.trademarkAdvice} />
              <div style={{ marginTop: 12 }}>
                <p style={s.cardLabel}>🛡️ IP Protection</p>
                {kit.legal?.ipProtection?.map((t, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>• {t}</p>)}
              </div>
            </div>
          </Section>

          {/* Marketing */}
          <Section title="Marketing Strategy">
            <div style={s.card}>
              <InfoRow label="Target Audience" value={kit.marketing?.audienceProfile} />
              <div style={{ marginTop: 12 }}>
                <p style={s.cardLabel}>#️⃣ Hashtags</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {kit.marketing?.hashtags?.map((h, i) => (
                    <span key={i} style={{ background: '#f0f4ff', border: '1px solid #c5cae9', color: '#1a237e', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{h}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={s.cardLabel}>🔍 Competitor Gaps</p>
                {kit.marketing?.competitorGaps?.map((g, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>• {g}</p>)}
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={s.cardLabel}>📅 30-Day Content Calendar</p>
                {kit.marketing?.contentCalendar?.map((w, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>Week {i + 1}: {w}</p>)}
              </div>
            </div>
          </Section>

          {/* Product Mockups */}
          {kit.mockups && kit.mockups.length > 0 && (
            <Section title="Product Mockups">
              <div style={s.grid3}>
                {kit.mockups.map((url, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e8eaf0' }}>
                    <img src={url} alt={`Mockup ${i + 1}`} style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                    <div style={{ background: '#fff', padding: '10px', textAlign: 'center', borderTop: '1px solid #e8eaf0' }}>
                      <a href={url} download={`mockup-${i + 1}.png`} style={{ color: '#1a237e', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>⬇ Download</a>
                    </div>
                  </div>
                ))}
              </div>
              {kit.productDeliverables && (
                <div style={{ ...s.card, marginTop: 16 }}>
                  <InfoRow label="Photography Style" value={kit.productDeliverables.photographyStyle} />
                  <InfoRow label="Unboxing Experience" value={kit.productDeliverables.unboxingExperience} />
                  <InfoRow label="Listing Copy" value={kit.productDeliverables.listingCopy} />
                </div>
              )}
            </Section>
          )}

          {/* Service Deliverables */}
          {kit.businessType === 'service' && kit.serviceDeliverables && (
            <Section title="Service Business Kit">
              <div style={s.card}>
                <InfoRow label="Social Media Bio" value={kit.serviceDeliverables.socialBio} />
                <InfoRow label="Pricing Guide" value={kit.serviceDeliverables.pricingGuide} />
                <InfoRow label="Proposal Structure" value={kit.serviceDeliverables.proposalTemplate} />
                <div style={{ marginTop: 12 }}>
                  <p style={s.cardLabel}>✅ Client Onboarding</p>
                  {kit.serviceDeliverables.onboardingChecklist?.map((item, i) => <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>• {item}</p>)}
                </div>
              </div>
            </Section>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid #e8eaf0' }}>
            <p style={{ color: '#1a237e', fontSize: 14, fontWeight: 600 }}>✦ Generated by NabadAi</p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>nabadai.myshopify.com</p>
          </div>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ color: '#1a237e', fontSize: 18, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #e8eaf0', fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return value ? (
    <div style={{ marginBottom: 12 }}>
      <p style={{ color: '#4fc3f7', fontSize: 12, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ color: '#444', fontSize: 14, margin: 0 }}>{value}</p>
    </div>
  ) : null;
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #dff0f7 0%, #ffffff 60%)', fontFamily: "'Inter', sans-serif", paddingBottom: 60 },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#fff', borderBottom: '1px solid #e8eaf0', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: 860, margin: '0 auto', padding: '48px 20px' },
  header: { textAlign: 'center', marginBottom: 48 },
  eyebrow: { color: '#4fc3f7', fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px' },
  title: { fontSize: 48, fontWeight: 700, color: '#1a237e', margin: '0 0 8px', fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: -1 },
  subtitle: { color: '#888', fontSize: 16, margin: 0 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: { background: '#fff', border: '1px solid #e8eaf0', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(26,35,126,0.04)' },
  cardLabel: { color: '#4fc3f7', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' },
  btnPrimary: { background: '#1a237e', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { background: '#f5f7ff', border: '1px solid #e0e4f0', borderRadius: 10, color: '#1a237e', padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
};
