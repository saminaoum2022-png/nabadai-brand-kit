import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Result() {
  const [kit, setKit] = useState(null);

  useEffect(() => {const data = sessionStorage.getItem('brandKit');
    if (data) setKit(JSON.parse(data));
    else window.location.href = '/';
  }, []);

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const element = document.getElementById('brand-kit-content');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0a0a0f', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${kit.businessName}-brand-kit.pdf`);
  };

  if (!kit) return <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c8d4', fontFamily: 'Inter, sans-serif' }}>Loading your brand kit...</div>;

  return (
    <>
      <Head><title>{kit.businessName} — Brand Kit</title></Head>
      <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>

        {/* Download Button */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button onClick={downloadPDF} style={{ background: 'linear-gradient(135deg, #00c8d4, #0066ff)', border: 'none', borderRadius: '10px', color: '#fff', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginRight: '12px' }}>
            📄 Download PDF
          </button>
          <button onClick={() => window.location.href = '/'} style={{ background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: '10px', color: '#aaa', padding: '14px 32px', fontSize: '16px', cursor: 'pointer' }}>
            ← Generate Another
          </button>
        </div>

        <div id="brand-kit-content" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(0,200,212,0.1)', border: '1px solid rgba(0,200,212,0.3)', color: '#00c8d4', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px' }}>✦ NabadAi Brand Kit</div>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', margin: '0 0 8px', letterSpacing: '-2px' }}>{kit.businessName}</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>{kit.industry} · {kit.businessType === 'product' ? 'Product Business' : 'Service Business'}</p>
          </div>

          {/* Color Palette */}
          <Section title="🎨 Color Palette">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {kit.colors?.map((c, i) => (
                <div key={i} style={{ flex: '1', minWidth: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e2e' }}>
                  <div style={{ height: '80px', background: c.hex }} />
                  <div style={{ padding: '12px', background: '#111118' }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>{c.name}</div>
                    <div style={{ color: '#00c8d4', fontSize: '12px', fontFamily: 'monospace' }}>{c.hex}</div>
                    <div style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>{c.usage}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section title="✍️ Typography">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {kit.typography?.map((t, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ color: '#00c8d4', fontSize: '12px', marginBottom: '6px' }}>{t.role}</div>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700' }}>{t.name}</div>
                  <div style={{ color: '#888', fontSize: '13px' }}>{t.style}</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>Pairs with: {t.pairedWith}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Slogans */}
          <Section title="💡 Brand Slogans">
            {kit.slogans?.map((s, i) => (
              <div key={i} style={{ ...cardStyle, marginBottom: '10px', fontSize: '18px', fontWeight: '600', color: '#fff', fontStyle: 'italic' }}>
                "{s}"
              </div>
            ))}
          </Section>

          {/* Logo Concepts */}
          <Section title="🖼️ Logo Concepts">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {kit.logos?.map((url, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e2e', background: '#fff' }}>
                  <img src={url} alt={`Logo concept ${i + 1}`} style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                  <div style={{ background: '#111118', padding: '10px', textAlign: 'center' }}>
                    <a href={url} download={`logo-concept-${i + 1}.png`} style={{ color: '#00c8d4', fontSize: '13px', textDecoration: 'none' }}>⬇ Download</a>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Midjourney Prompts */}
          <Section title="🎯 Midjourney Logo Prompts">
            {kit.midjourneyPrompts?.map((p, i) => (
              <div key={i} style={{ ...cardStyle, marginBottom: '10px', fontFamily: 'monospace', fontSize: '13px', color: '#00c8d4' }}>
                /imagine {p}
              </div>
            ))}
          </Section>

          {/* Brand Voice */}
          <Section title="🗣️ Brand Voice">
            <div style={cardStyle}>
              <div style={{ color: '#fff', marginBottom: '12px' }}><strong>Tone:</strong> {kit.brandVoice?.tone}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>✅ Do</div>
                  {kit.brandVoice?.doList?.map((d, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>• {d}</div>)}
                </div>
                <div>
                  <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '8px' }}>❌ Don't</div>
                  {kit.brandVoice?.dontList?.map((d, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>• {d}</div>)}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>📱 Sample Captions</div>
                {kit.brandVoice?.captions?.map((c, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '6px', paddingLeft: '12px', borderLeft: '2px solid #00c8d4' }}>{c}</div>)}
              </div>
            </div>
          </Section>

          {/* Legal */}
          <Section title="⚖️ Legal Foundation">
            <div style={cardStyle}>
              <InfoRow label="Business Structure" value={kit.legal?.businessStructure} />
              <InfoRow label="Trademark Advice" value={kit.legal?.trademarkAdvice} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>🛡️ IP Protection</div>
                {kit.legal?.ipProtection?.map((t, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>• {t}</div>)}
              </div>
            </div>
          </Section>

          {/* Marketing */}
          <Section title="📱 Marketing Strategy">
            <div style={cardStyle}>
              <InfoRow label="Target Audience" value={kit.marketing?.audienceProfile} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>#️⃣ Hashtags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {kit.marketing?.hashtags?.map((h, i) => <span key={i} style={{ background: 'rgba(0,200,212,0.1)', border: '1px solid rgba(0,200,212,0.2)', color: '#00c8d4', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' }}>{h}</span>)}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>🔍 Competitor Gaps</div>
                {kit.marketing?.competitorGaps?.map((g, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>• {g}</div>)}
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>📅 30-Day Content Calendar</div>
                {kit.marketing?.contentCalendar?.map((w, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>Week {i + 1}: {w}</div>)}
              </div>
            </div>
          </Section>

          {/* Product Mockups */}
          {kit.businessType === 'product' && kit.mockups && (
            <Section title="📦 Product Mockups">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {kit.mockups.map((url, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e2e' }}>
                    <img src={url} alt={`Mockup ${i + 1}`} style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                    <div style={{ background: '#111118', padding: '10px', textAlign: 'center' }}>
                      <a href={url} download={`mockup-${i + 1}.png`} style={{ color: '#00c8d4', fontSize: '13px', textDecoration: 'none' }}>⬇ Download</a>
                    </div>
                  </div>
                ))}
              </div>
              {kit.productDeliverables && (
                <div style={{ ...cardStyle, marginTop: '16px' }}>
                  <InfoRow label="Photography Style" value={kit.productDeliverables.photographyStyle} />
                  <InfoRow label="Unboxing Experience" value={kit.productDeliverables.unboxingExperience} />
                  <InfoRow label="Listing Copy" value={kit.productDeliverables.listingCopy} />
                </div>
              )}
            </Section>
          )}

          {/* Service Deliverables */}
          {kit.businessType === 'service' && kit.serviceDeliverables && (
            <Section title="🏢 Service Business Kit">
              <div style={cardStyle}>
                <InfoRow label="Social Media Bio" value={kit.serviceDeliverables.socialBio} />
                <InfoRow label="Pricing Guide" value={kit.serviceDeliverables.pricingGuide} />
                <InfoRow label="Proposal Structure" value={kit.serviceDeliverables.proposalTemplate} />
                <div style={{ marginTop: '12px' }}>
                  <div style={{ color: '#00c8d4', fontSize: '13px', marginBottom: '8px' }}>✅ Client Onboarding</div>
                  {kit.serviceDeliverables.onboardingChecklist?.map((s, i) => <div key={i} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>• {s}</div>)}
                </div>
              </div>
            </Section>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e1e2e' }}>
            <div style={{ color: '#00c8d4', fontSize: '14px', fontWeight: '600' }}>✦ Generated by NabadAi</div>
            <div style={{ color: '#444', fontSize: '12px', marginTop: '4px' }}>nabadai.myshopify.com</div>
          </div>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1e1e2e' }}>{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return value ? (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ color: '#00c8d4', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#ccc', fontSize: '14px' }}>{value}</div>
    </div>
  ) : null;
}

const cardStyle = { background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px' };
