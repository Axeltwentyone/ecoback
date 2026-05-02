import { useLowCarbon } from '../context/LowCarbonContext'

export default function LowCarbonToggle({ compact = false, dark = false }) {
  const { lowCarbonMode, setLowCarbonMode } = useLowCarbon()

  if (compact) {
    return (
      <button
        onClick={() => setLowCarbonMode(prev => !prev)}
        title={lowCarbonMode ? 'Désactiver Low Carbon' : 'Activer Low Carbon'}
        style={{
          background: lowCarbonMode ? '#e8faf8' : 'rgba(26,58,69,0.06)',
          border: `1px solid ${lowCarbonMode ? '#7bdff2' : 'rgba(26,58,69,0.15)'}`,
          borderRadius: '100px', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s',
        }}
      >
        🌿
      </button>
    )
  }

  return (
    <button
      onClick={() => setLowCarbonMode(prev => !prev)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: lowCarbonMode ? '#e8faf8' : 'rgba(26,58,69,0.06)',
        border: `1px solid ${lowCarbonMode ? '#7bdff2' : 'rgba(26,58,69,0.15)'}`,
        borderRadius: '100px', padding: '0.45rem 1rem',
        fontSize: '0.8rem', fontWeight: 600,
        color: dark ? '#ffffff' : '#1a3a45',
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: lowCarbonMode ? '#0d7a6a' : (dark ? 'rgba(255,255,255,0.4)' : '#aaa'),
        display: 'inline-block', transition: 'background 0.2s',
      }} />
      {lowCarbonMode ? 'Low Carbon actif' : 'Mode standard'}
    </button>
  )
}