import { Search } from 'lucide-react'
import { useLowCarbon } from '../../context/LowCarbonContext'

const TYPES = ['Tous', 'bureau', 'salle_reunion', 'conference']
const TYPE_LABELS = { Tous: 'Tous', bureau: 'Bureau', salle_reunion: 'Réunion', conference: 'Conférence' }

export default function SearchBar({ search, onSearch, typeActif, onType }) {
  const { lowCarbonMode } = useLowCarbon()

  return (
    <div style={{
      background: lowCarbonMode
        ? '#e8f4f0'
        : 'linear-gradient(to bottom, #1a3a45, #2a5060)',
      padding: '7rem 3rem 3rem',
      fontFamily: 'system-ui, sans-serif',
      transition: 'background 0.3s',
    }}>
      <h1 style={{
        color: lowCarbonMode ? '#1a3a45' : '#fff',
        fontSize: '2rem', fontWeight: 300,
        marginBottom: '2rem', letterSpacing: '-0.02em',
      }}>
        Nos <span style={{ fontWeight: 700, color: lowCarbonMode ? '#0d7a6a' : '#7bdff2' }}>espaces</span>
      </h1>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: lowCarbonMode ? '#4a7a85' : 'rgba(255,255,255,0.4)',
          }} />
          <input
            type="text"
            placeholder="Rechercher un espace..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            style={{
              background: lowCarbonMode ? '#fff' : 'rgba(255,255,255,0.1)',
              border: lowCarbonMode ? '1px solid #d0e8e4' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px', padding: '0.6rem 1rem 0.6rem 2.2rem',
              color: lowCarbonMode ? '#1a3a45' : '#fff',
              fontSize: '0.85rem', outline: 'none', width: 220,
              fontFamily: 'inherit',
            }}
          />
        </div>

        {TYPES.map(type => (
          <button key={type} onClick={() => onType(type)} style={{
            background: typeActif === type
              ? (lowCarbonMode ? '#0d7a6a' : '#7bdff2')
              : (lowCarbonMode ? 'rgba(26,58,69,0.08)' : 'rgba(255,255,255,0.1)'),
            color: typeActif === type
              ? (lowCarbonMode ? '#fff' : '#1a3a45')
              : (lowCarbonMode ? '#1a3a45' : 'rgba(255,255,255,0.7)'),
            border: lowCarbonMode
              ? '1px solid rgba(26,58,69,0.15)'
              : '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px', padding: '0.6rem 1.2rem',
            fontSize: '0.85rem', fontWeight: typeActif === type ? 700 : 500,
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
          }}>
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  )
}