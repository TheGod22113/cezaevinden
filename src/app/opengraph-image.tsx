import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Cezaevinden.com — Mahkumlar, Aileler ve Hukuk Platformu'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2540 60%, #1a1a2e 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />

        {/* Logo placeholder + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px',
          }}>⚖️</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '56px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
              Cezaevinden
              <span style={{ color: '#e53e3e' }}>.com</span>
            </span>
          </div>
        </div>

        <p style={{
          fontSize: '28px', color: 'rgba(255,255,255,0.85)', textAlign: 'center',
          maxWidth: '800px', lineHeight: 1.4, margin: '0 0 40px',
        }}>
          Mahkumlar, aileler ve gönüllü avukatların bir arada olduğu dayanışma platformu
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px' }}>
          {[
            { value: '24.5K', label: 'Üye' },
            { value: '380', label: 'Gönüllü Avukat' },
            { value: '8.2K', label: 'Yanıtlanan Soru' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#fbbf24' }}>{value}</span>
              <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
