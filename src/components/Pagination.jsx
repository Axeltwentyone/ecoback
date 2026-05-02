import { useLowCarbon } from '../context/LowCarbonContext'

export default function Pagination({ pagination, page, onPage }) {
  const { lowCarbonMode } = useLowCarbon()

  if (!pagination || pagination.last_page <= 1) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      {page > 1 && (
        <button onClick={() => onPage(page - 1)} style={{
          height: 36, padding: '0 1rem', borderRadius: '100px',
          background: 'transparent',
          color: '#1a3a45',
          border: '1px solid rgba(26,58,69,0.2)',
          cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          ← Préc.
        </button>
      )}

      {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: p === page
            ? (lowCarbonMode ? '#0d7a6a' : '#1a3a45')
            : 'transparent',
          color: p === page ? '#fff' : '#1a3a45',
          border: '1px solid rgba(26,58,69,0.2)',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          {p}
        </button>
      ))}

      {page < pagination.last_page && (
        <button onClick={() => onPage(page + 1)} style={{
          height: 36, padding: '0 1rem', borderRadius: '100px',
          background: 'transparent',
          color: '#1a3a45',
          border: '1px solid rgba(26,58,69,0.2)',
          cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          Suiv. →
        </button>
      )}
    </div>
  )
}
