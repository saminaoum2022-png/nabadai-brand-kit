import { useEffect, useState } from 'react';
import Head from 'next/head';

const LOGO_URL = 'https://cdn.shopify.com/s/files/1/0822/6953/6481/files/IMG-6520.png?v=1775730509';

export default function Result() {
  const [kit, setKit] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('brandKit');
    if (data) setKit(JSON.parse(data));
    else window.location.href = '/';
  }, []);

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const element = document.getElementById('brand-kit-content');

    // Fix: prevent image page-break cuts
    const sections = element.querySelectorAll('.pdf-section');
    sections.forEach(s => {
      s.style.pageBreakInside = 'avoid';
      s.style.breakInside = 'avoid';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${kit.businessName}-brand-kit.pdf`);
  };

  const downloadLogo = async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${kit.businessName}-logo-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Check out my AI-generated Brand Kit for ${kit.businessName} — created with NabadAi! 🚀\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyEmailSignature = () => {
    const sig = document.getElementById('email-signature-html');
    navigator.clipboard.writeText(sig.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!kit) return (
    <div style={{ background: 'linear-gradient(160deg, #dff0f7 0%, #ffffff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a237e', fontFamily: 'Inter, sans-serif' }}>
      Loading your brand kit...
    </div>
  );

  const primaryColor = kit.colors?.[0]?.hex || '#1a237e';
  const secondaryColor = kit.colors?.[1]?.hex || '#4fc3f7';
  const accentColor = kit.colors?.[2]?.hex || '#e8eaf0';

  const mockupLabel = kit.mockupType ? {
    website_hero: '🖥️ Website Hero Mockup',
    instagram_post: '📱 Instagram Post Mockup',
    business_card: '💼 Business Card Mockup',
    packaging: '📦 Packaging Mockup',
    product_shot: '🛍️ Product Shot Mockup',
    ecommerce_listing: '🛒 E-commerce Listing Mockup',
    proposal_cover: '📄 Proposal Cover Mockup',
    email_header: '📧 Email Header Mockup',
    ad_banner: '🎯 Ad Banner Mockup',
  }[kit.mockupType] : 'Mockup';

  // Google Fonts URL from typography
  const fontNames = kit.typography?.map(t => t.name.replace(/ /g, '+')).join('&family=') || '';
  const googleFontsUrl = fontNames ? `https://fonts.googleapis.com/css2?family=${fontNames}:wght@400;700&family=Inter:wght@400;500;600&display=swap` : `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap`;

  const brandScore = kit.brandScore || null;

  return (
    <>
      <Head>
        <title>{kit.businessName} — Brand Kit</title>
        <link href={googleFontsUrl} rel="stylesheet" />
      </Head>

      <div style={s.page}>

        {/* Nav */}
        <div style={s.nav}>
          <img src={LOGO_URL} style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'multiply' }} alt="NabadAi" />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={shareOnWhatsApp} style={{ ...s.btnSecondary, background: '#25D366', color: '#fff', border: 'none' }}>💬 Share on WhatsApp</button>
            <button onClick={() => window.location.href = '/'} style={s.btnSecondary}>← New Kit</button>
            <button onClick={downloadPDF} style={s.btnPrimary}>📄 Download PDF</button>
          </div>
        </div>

        <div id="brand-kit-content" style={s.container}>

          {/* Header */}
          <div style={{ ...s.header }} className="pdf-section">
            <p style={s.eyebrow}>✦ NabadAi Brand Kit</p>
            <h1 style={s.title}>{kit.businessName}</h1>
            <p style={s.subtitle}>{kit.industry} · {kit.businessType === 'product' ? 'Product Business' : 'Service Business'}</p>
          </div>

          {/* Brand Score */}
          {brandScore && (
            <Section title="Brand Strength Score">
              <div style={{ ...s.card, textAlign: 'center' }} className="pdf-section">
                <div style={{
                  width: 120, height: 120, borderRadius: '50%',
                  background: `conic-gradient(${primaryColor} ${brandScore.total * 3.6}deg, #e8eaf0 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: primaryColor }}>{brandScore.total}</span>
                    <span style={{ fontSize: 11, color: '#aaa' }}>/ 100</span>
                  </div>
                </div>
                <div style={s.grid2}>
                  {brandScore.breakdown?.map((b, i) => (
                    <div key={i} style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>{b.label}</p>
                      <div style={{ background: '#f0f4ff', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${b.score}%`, height: '100%', background: primaryColor, borderRadius: 8 }} />
                      </div>
                      <p style={{ fontSize: 11, color: primaryColor, margin: '2px 0 0', fontWeight: 600 }}>{b.score}/100</p>
                    </div>
                  ))}
                </div>
                {brandScore.tip && <p style={{ color: '#666', fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>💡 {brandScore.tip}</p>}
              </div>
            </Section>
          )}

          {/* Beat the Competition */}
          {kit.competitiveEdge && (
            <Section title="🏆 Your Competitive Edge">
              <div style={{ ...s.card, borderLeft: `4px solid ${primaryColor}` }} className="pdf-section">
                <p style={{ color: primaryColor, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{kit.competitiveEdge.idea}</p>
                <p style={{ color: '#555', fontSize: 14, margin: 0 }}>{kit.competitiveEdge.explanation}</p>
              </div>
            </Section>
          )}

          {/* Color Palette */}
          <Section title="Color Palette">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }} className="pdf-section">
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
            <div style={s.grid2} className="pdf-section">
              {kit.typography?.map((t, i) => (
                <div key={i} style={s.card}>
                  <p style={s.cardLabel}>{t.role}</p>
                  <p style={{ color: '#1a237e', fontSize: 22, fontWeight: 700, margin: '4px 0', fontFamily: `'${t.name}', sans-serif` }}>{t.name}</p>
                  <p style={{ color: '#666', fontSize: 13, margin: 0 }}>{t.style}</p>
                  <p style={{ color: '#aaa', fontSize: 12, margin: '4px 0 8px' }}>Pairs with: {t.pairedWith}</p>
                  {/* Font preview */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10, marginTop: 4 }}>
                    <p style={{ fontFamily: `'${t.name}', sans-serif`, fontSize: 18, color: primaryColor, margin: 0, fontWeight: i === 0 ? 700 : 400 }}>
                      The future of your brand starts here.
                    </p>
                    <p style={{ fontFamily: `'${t.name}', sans-serif`, fontSize: 13, color: '#888', margin: '4px 0 0' }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ · 0123456789
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Slogans */}
          <Section title="Brand Slogans">
            {kit.slogans?.map((slogan, i) => (
              <div key={i} style={{ ...s.card, marginBottom: 10, fontSize: 18, fontWeight: 600, color: '#1a237e', fontStyle: 'italic', fontFamily: "'Playfair Display', Georgia, serif" }} className="pdf-section">
                "{slogan}"
              </div>
            ))}
          </Section>

          {/* Logo Concepts */}
          <Section title="Logo Concept">
            <div style={s.grid3} className="pdf-section">
              {kit.logos?.map((url, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e8eaf0', background: 'transparent', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, #fff 0% 50%) 0 0 / 16px 16px', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
                    <img src={url} alt={`Logo concept ${i + 1}`} style={{ maxWidth: '100%', maxHeight: 120, display: 'block', objectFit: 'contain' }} crossOrigin="anonymous" />
                  </div>
                  <div style={{ background: '#fff', padding: '10px', textAlign: 'center', borderTop: '1px solid #e8eaf0' }}>
                    <button onClick={() => downloadLogo(url, i)} style={{ ...s.btnSecondary, fontSize: 12, padding: '6px 14px', cursor: 'pointer' }}>⬇ Download PNG</button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Midjourney Prompts */}
          <Section title="Midjourney Logo Prompts">
            {kit.midjourneyPrompts?.map((p, i) => (
              <div key={i} style={{ ...s.card, marginBottom: 10, fontFamily: 'monospace', fontSize: 13, color: '#4fc3f7' }} className="pdf-section">
                /imagine {p}
              </div>
            ))}
          </Section>

          {/* Brand Voice */}
          <Section title="Brand Voice">
            <div style={s.card} className="pdf-section">
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
                  <p key={i} style={{ color: '#555', fontSize: 13, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${primaryColor}` }}>{c}</p>
                ))}
              </div>
            </div>
          </Section>

          {/* Legal */}
          <Section title="Legal Foundation">
            <div style={s.card} className="pdf-section">
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
            <div style={s.card} className="pdf-section">
              <InfoRow label="Target Audience" value={kit.marketing?.audienceProfile} />
              <div style={{ marginTop: 12 }}>
                <p style={s.cardLabel}>#️⃣ Hashtags</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {kit.marketing?.hashtags?.map((h, i) => (
                    <span key={i} style={{ background: accentColor, border: `1px solid ${secondaryColor}`, color: primaryColor, padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{h}</span>
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

          {/* Mockup */}
          {kit.mockups && kit.mockups.length > 0 && (
            <Section title={mockupLabel}>
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e8eaf0', background: '#f8f9fc', breakInside: 'avoid', pageBreakInside: 'avoid' }} className="pdf-section">
                <img src={kit.mockups[0]} alt="Mockup" style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                <div style={{ background: '#fff', padding: '10px', textAlign: 'center', borderTop: '1px solid #e8eaf0' }}>
                  <a href={kit.mockups[0]} download="mockup.png" style={{ color: '#1a237e', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>⬇ Download Mockup</a>
                </div>
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
              <div style={s.card} className="pdf-section">
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

          {/* HTML Email Signature */}
          <Section title="📧 Email Signature">
            <div style={s.card} className="pdf-section">
              {/* Preview */}
              <div style={{ borderRadius: 10, border: `1px solid ${accentColor}`, padding: 20, marginBottom: 16, background: '#fafafa' }}>
                <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: 16, borderRight: `3px solid ${primaryColor}`, verticalAlign: 'middle' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
                          {kit.businessName?.[0]}
                        </div>
                      </td>
                      <td style={{ paddingLeft: 16, verticalAlign: 'middle' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: primaryColor, fontSize: 15 }}>{kit.businessName}</p>
                        <p style={{ margin: '2px 0', color: secondaryColor, fontSize: 12 }}>{kit.industry}</p>
                        <p style={{ margin: '4px 0 0', color: '#888', fontSize: 11 }}>Powered by NabadAi</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Copy HTML */}
              <pre id="email-signature-html" style={{ display: 'none' }}>{`<table cellpadding="0" cellspacing="0" style="font-family:Inter,sans-serif"><tbody><tr><td style="padding-right:16px;border-right:3px solid ${primaryColor};vertical-align:middle"><div style="width:48px;height:48px;border-radius:50%;background:${primaryColor};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px">${kit.businessName?.[0]}</div></td><td style="padding-left:16px;vertical-align:middle"><p style="margin:0;font-weight:700;color:${primaryColor};font-size:15px">${kit.businessName}</p><p style="margin:2px 0;color:${secondaryColor};font-size:12px">${kit.industry}</p><p style="margin:4px 0 0;color:#888;font-size:11px">Powered by NabadAi</p></td></tr></tbody></table>`}</pre>
              <button onClick={copyEmailSignature} style={{ ...s.btnPrimary, width: '100%' }}>
                {copied ? '✅ Copied!' : '📋 Copy HTML Signature'}
              </button>
            </div>
          </Section>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid #e8eaf0' }}>
            <p style={{ color: '#1a237e', fontSize: 14, fontWeight: 600 }}>✦ Generated by NabadAi</p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>nabadai.com</p>
          </div>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }} className="pdf-section">
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
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#fff', borderBottom: '1px solid #e8eaf0', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 8 },
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
