import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { apiRegister } from '../../services/api'
import StepInfo from './StepInfo'
import StepPin from './StepPin'
import SuccessScreen from './SuccessScreen'

const INITIAL = { nom: '', prenom: '', email: '', numero: '', adresse_postale: '' }

export default function Inscription() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL)
  const [pin, setPin] = useState(Array(6).fill(''))
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const handlePinChange = (i, value) => {
    if (value !== '' && !/^\d$/.test(value)) return
    const next = [...pin]
    next[i] = value
    setPin(next)
    if (errors.pin) setErrors(e => ({ ...e, pin: null }))
    if (value !== '' && i < 5) document.getElementById(`pin-${i + 1}`)?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && pin[i] === '' && i > 0)
      document.getElementById(`pin-${i - 1}`)?.focus()
  }

  const handleNext = () => {
    const newErrors = {}
    if (!form.nom) newErrors.nom = 'Champ requis'
    if (!form.prenom) newErrors.prenom = 'Champ requis'
    if (!form.email) newErrors.email = 'Champ requis'
    if (!form.numero) newErrors.numero = 'Champ requis'
    if (!form.adresse_postale) newErrors.adresse_postale = 'Champ requis'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setStep(2)
  }

  const handleSubmit = async () => {
    if (pin.some(d => d === '')) { setErrors({ pin: 'PIN incomplet' }); return }
    setLoading(true)
    setErrors({})

    const { ok, status, data } = await apiRegister({ ...form, pin: pin.join('') })
    setLoading(false)

    if (!ok) {
      if (status === 422 && data.errors) {
        const flat = Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, v[0]]))
        const hasInfoErrors = Object.keys(flat).some(k => k !== 'pin')
        setErrors(flat)
        if (hasInfoErrors) setStep(1)
      } else {
        setErrors({ general: data.message || 'Une erreur est survenue.' })
      }
      return
    }

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setSuccess(true)
    setStep(3)

    
    setTimeout(() => {
      if (data.user.type_de_compte === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard') 
      }
    }, 1000)
  }

  const s = {
    page: {
      display: 'flex', minHeight: '100vh',
      background: '#0f1f24', fontFamily: 'system-ui, sans-serif', color: '#fff',
      flexDirection: isMobile ? 'column' : 'row',
    },
    left: {
      flex: 1, display: isMobile ? 'none' : 'flex',
      background: 'linear-gradient(135deg, #0a1f24 0%, #051014 100%)',
      flexDirection: 'column', justifyContent: 'center', padding: '4rem',
      position: 'relative', overflow: 'hidden',
    },
    right: {
      width: '100%', maxWidth: isMobile ? 'none' : 580,
      background: '#162830',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: isMobile ? '4rem 1.5rem 2rem' : '3rem',
      overflowY: 'auto',
      flex: isMobile ? 1 : 'none',
    },
  }

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(123,223,242,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', left: '2.5rem', fontWeight: 700, fontSize: '1.1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          EcoWork
        </button>
        <div style={{ width: 60, height: 3, background: '#7bdff2', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2.8rem', fontWeight: 300, lineHeight: 1.2, margin: 0 }}>
          Rejoignez<br />
          <span style={{ fontWeight: 700, color: '#7bdff2' }}>l'expérience.</span>
        </h1>
        <p style={{ color: '#8aa5ad', marginTop: '1.5rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Réservez vos espaces de travail en toute simplicité.
        </p>
      </div>

     
      <div style={s.right}>
        {isMobile && (
            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontWeight: 700, fontSize: '1.1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              EcoWork
            </button>
        )}

        {success ? (
          <div style={{ textAlign: 'center', color: '#7bdff2' }}>
            <h2>Inscription réussie !</h2>
            <p>Redirection en cours...</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7bdff2', marginBottom: '0.5rem' }}>
              Inscription
            </p>
            <p style={{ color: '#8aa5ad', fontSize: '0.78rem', marginTop: '0.5rem' }}>
              Étape {Math.min(step, 2)} / 2
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, margin: '0 0 2rem', lineHeight: 1.2 }}>
              {step === 1 ? 'Vos informations.' : 'Votre code PIN.'}
            </h2>
            <div style={{ marginBottom: '3rem', display: 'flex', gap: '0.75rem' }}>
              {[1, 2].map(n => (
                <div key={n} style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: step >= n ? '#7bdff2' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {errors.general && (
              <div style={{
                marginBottom: '1.5rem', padding: '0.75rem 1rem',
                background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)',
                borderRadius: '0.4rem', color: '#fc8181', fontSize: '0.85rem',
              }}>
                {errors.general}
              </div>
            )}

            {step === 1 && <StepInfo form={form} errors={errors} onChange={handleChange} />}
            {step === 2 && <StepPin pin={pin} error={errors.pin} onChange={handlePinChange} onKeyDown={handleKeyDown} />}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: '1rem',
                    background: 'transparent', border: '1.5px solid rgba(123,223,242,0.3)',
                    color: '#7bdff2', fontWeight: 600, fontSize: '0.95rem',
                    borderRadius: '0.4rem', cursor: 'pointer',
                  }}
                >
                  Retour
                </button>
              )}
              <button
              data-cy="btn-continuer"
                onClick={step === 1 ? handleNext : handleSubmit}
                disabled={loading}
                style={{
                  flex: 1, padding: '1rem',
                  background: loading ? '#3a5a65' : '#7bdff2',
                  color: '#0f1f24', fontWeight: 700, fontSize: '0.95rem',
                  border: 'none', borderRadius: '0.4rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi...</> : step === 1 ? 'Continuer →' : 'Créer mon compte'}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#8aa5ad' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#7bdff2', textDecoration: 'none', fontWeight: 600 }}>
                Se connecter
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}