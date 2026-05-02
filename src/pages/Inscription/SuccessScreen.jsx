import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function SuccessScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.type_de_compte === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <CheckCircle size={64} color="#7bdff2" style={{ marginBottom: '1.5rem' }} />
      <h3 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '0.5rem' }}>
        Compte créé !
      </h3>
      <p style={{ color: '#8aa5ad', fontSize: '0.95rem' }}>
        Redirection en cours...
      </p>
    </div>
  )
}