const Field = ({ label, type = 'text', value, onChange, error, dataCy }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8aa5ad', marginBottom: '0.5rem' }}>
      {label}
    </label>
    <input
      data-cy={dataCy}
      type={type}
      value={value}
      onChange={onChange}
      style={{
        width: '100%', padding: '0.85rem', boxSizing: 'border-box',
        background: '#243e47', border: error ? '1.5px solid #fc8181' : '1.5px solid transparent',
        borderRadius: '0.4rem', color: '#fff', fontSize: '0.95rem', outline: 'none',
      }}
      onFocus={e => e.target.style.border = '1.5px solid #7bdff2'}
      onBlur={e => e.target.style.border = error ? '1.5px solid #fc8181' : '1.5px solid transparent'}
    />
    {error && <p style={{ color: '#fc8181', fontSize: '0.78rem', marginTop: '0.3rem' }}>{error}</p>}
  </div>
)

export default function StepInfo({ form, errors, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Nom" value={form.nom} onChange={e => onChange('nom', e.target.value)} error={errors.nom} dataCy="field-nom" />
        <Field label="Prénom" value={form.prenom} onChange={e => onChange('prenom', e.target.value)} error={errors.prenom} dataCy="field-prenom" />
      </div>
      <Field label="Email" type="email" value={form.email} onChange={e => onChange('email', e.target.value)} error={errors.email} dataCy="field-email" />
      <Field label="Téléphone" type="tel" value={form.numero} onChange={e => onChange('numero', e.target.value)} error={errors.numero} dataCy="field-telephone" />
      <Field label="Adresse postale" value={form.adresse_postale} onChange={e => onChange('adresse_postale', e.target.value)} error={errors.adresse_postale} dataCy="field-adresse" />
    </div>
  )
}