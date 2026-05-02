import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLowCarbon } from '../../context/LowCarbonContext'
import LowCarbonToggle from '../../components/LowCarbonToggle'

export default function NavBar() {
  const navigate = useNavigate()
  const { lowCarbonMode } = useLowCarbon()
  const isLoggedIn = !!localStorage.getItem('token')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: isMobile ? '1rem 1.5rem' : '1.2rem 3rem',
      background: lowCarbonMode
        ? 'rgba(247,247,247,0.98)'
        : 'rgba(239,247,246,0.95)',
      backdropFilter: lowCarbonMode ? 'none' : 'blur(12px)',
      borderBottom: '1px solid rgba(26,58,69,0.08)',
      fontFamily: 'system-ui, sans-serif',
      transition: 'background 0.3s',
    }}>
      <Link to="/" style={{ textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, color: '#1a3a45' }}>
        Eco<span style={{ color: lowCarbonMode ? '#0d7a6a' : '#7bdff2' }}>Work</span>
      </Link>

      <div style={{ display: 'flex', gap: isMobile ? '0.2rem' : '0.8rem', alignItems: 'center' }}>
        {!isMobile && <LowCarbonToggle />}

        <Link to="/espaces" style={{ textDecoration: 'none', color: '#1a3a45', fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: 600, padding: isMobile ? '0.4rem 0.6rem' : '0.5rem 1rem' }}>
          Espaces
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid rgba(26,58,69,0.2)',
            color: '#1a3a45', fontSize: isMobile ? '0.72rem' : '0.82rem', fontWeight: 600,
            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
            borderRadius: '100px', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {isMobile ? 'Déconnexion' : 'Se déconnecter'}
          </button>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#3a5f66', fontSize: isMobile ? '0.75rem' : '0.85rem', padding: isMobile ? '0.4rem 0.6rem' : '0.5rem 1rem' }}>
              {isMobile ? 'Login' : 'Connexion'}
            </Link>
            <Link to="/inscription" style={{
              textDecoration: 'none',
              background: lowCarbonMode ? '#0d7a6a' : '#1a3a45',
              color: '#eff7f6',
              fontSize: isMobile ? '0.72rem' : '0.82rem', fontWeight: 600,
              padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
              borderRadius: '100px',
              transition: 'background 0.2s',
            }}>
              S'inscrire
            </Link>
          </>
        )}

        {isMobile && <LowCarbonToggle compact />}
      </div>
    </nav>
  )
}