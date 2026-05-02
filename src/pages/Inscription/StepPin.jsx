export default function StepPin({ pin, error, onChange, onKeyDown }) {
  return (
    <div>
      <p style={{ color: '#8aa5ad', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Choisissez un code PIN à 6 chiffres pour sécuriser votre compte.
      </p>
      <label style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8aa5ad', marginBottom: '0.75rem' }}>
        Code PIN (6 chiffres)
      </label>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {pin.map((digit, i) => (
          <input
            key={i}
            id={`pin-${i}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            style={{
              width: 52, height: 60,
              background: '#243e47',
              border: error ? '1.5px solid #fc8181' : '1.5px solid transparent',
              borderRadius: '0.4rem',
              color: '#fff', fontSize: '1.4rem', fontWeight: 700,
              textAlign: 'center', outline: 'none',
              transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.border = '1.5px solid #7bdff2'}
            onBlur={e => e.target.style.border = error ? '1.5px solid #fc8181' : '1.5px solid transparent'}
          />
        ))}
      </div>
      {error && <p style={{ color: '#fc8181', fontSize: '0.78rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
    </div>
  )
}