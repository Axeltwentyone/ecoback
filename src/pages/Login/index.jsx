import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { apiLogin } from '../../services/api'
import PinInput from './PinInput'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
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

  const handleSubmit = async () => {
    if (pin.some(d => d === '')) {
      setErrors({ pin: 'PIN incomplet' })
      return
    }
    setLoading(true)
    setErrors({})
    const { ok, status, data } = await apiLogin({ email, pin: pin.join('') })
    setLoading(false)

    if (!ok) {
      if (status === 422 && data.errors) {
        setErrors(Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, v[0]])))
      } else {
        setErrors({ general: data.message || 'Identifiants invalides.' })
      }
      return
    }

    // Stockage local
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Affichage écran succès
    setSuccess(true)

    // Redirection
    setTimeout(() => {
      if (data.user.type_de_compte === 'admin') {
        navigate('/admin')
      } else {
        // Rediriger vers la page d'origine ou vers le dashboard par défaut
        const origin = location.state?.from || '/dashboard'
        navigate(origin)
      }
    }, 1000)
  }

  const s = {
    page: {
      display: 'flex', minHeight: '100vh', background: '#0f1f24',
      fontFamily: 'system-ui, sans-serif', color: '#fff',
      flexDirection: isMobile ? 'column' : 'row',
    },
    left: {
      display: isMobile ? 'none' : 'flex', flex: 1,
      background: 'linear-gradient(135deg, #0a1f24 0%, #051014 100%)',
      flexDirection: 'column', justifyContent: 'center', padding: '4rem',
      position: 'relative', overflow: 'hidden',
    },
    right: {
      width: '100%', maxWidth: isMobile ? 'none' : 560,
      background: '#162830',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: isMobile ? '2rem 1.5rem' : '3rem',
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
          Un espace.<br />
          <span style={{ fontWeight: 700, color: '#7bdff2' }}>Une respiration.</span>
        </h1>
      </div>

      
      <div style={s.right}>
        {isMobile && (
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', left: '2.5rem', fontWeight: 700, fontSize: '1.1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          EcoWork
        </button>
        )}

        {success ? (
          <div style={{ textAlign: 'center', color: '#7bdff2' }}>
            <h2>Connexion réussie !</h2>
            <p>Redirection en cours...</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7bdff2', marginBottom: '0.5rem' }}>
              Connexion
            </p>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 300, margin: '0 0 2.5rem', lineHeight: 1.2 }}>
              Bon retour<br />parmi nous.
            </h2>

            {errors.general && (
              <div style={{
                marginBottom: '1.5rem', padding: '0.75rem 1rem',
                background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)',
                borderRadius: '0.4rem', color: '#fc8181', fontSize: '0.85rem',
              }}>
                {errors.general}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8aa5ad', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(err => ({ ...err, email: null })) }}
                  style={{
                    width: '100%', padding: '0.85rem', boxSizing: 'border-box',
                    background: '#243e47', border: errors.email ? '1.5px solid #fc8181' : '1.5px solid transparent',
                    borderRadius: '0.4rem', color: '#fff', fontSize: '0.95rem', outline: 'none',
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #7bdff2'}
                  onBlur={e => e.target.style.border = errors.email ? '1.5px solid #fc8181' : '1.5px solid transparent'}
                />
                {errors.email && <p style={{ color: '#fc8181', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.email}</p>}
              </div>

              <PinInput pin={pin} error={errors.pin} onChange={handlePinChange} onKeyDown={handleKeyDown} />

              <button
                onClick={handleSubmit}
                disabled={loading || !email || pin.some(d => d === '')}
                style={{
                  width: '100%', padding: '1rem',
                  background: loading || !email || pin.some(d => d === '') ? '#3a5a65' : '#7bdff2',
                  color: '#0f1f24', fontWeight: 700, fontSize: '0.95rem',
                  border: 'none', borderRadius: '0.4rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Connexion...</> : 'Se connecter'}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#8aa5ad' }}>
              Pas encore de compte ?{' '}
              <Link to="/inscription" style={{ color: '#7bdff2', textDecoration: 'none', fontWeight: 600 }}>
                S'inscrire
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}