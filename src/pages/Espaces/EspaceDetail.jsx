import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetEspace, apiCreateReservation, API_URL } from '../../services/api'

const TYPE_LABELS = { bureau: 'Bureau', salle_reunion: 'Réunion', conference: 'Conférence' }
const TYPE_COLORS = {
  bureau: { bg: '#e8faf8', text: '#0a6b5c' },
  salle_reunion: { bg: '#e0f6fb', text: '#0a5a6b' },
  conference: { bg: '#fdf0f4', text: '#6b0a2a' },
}

export default function EspaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [espace, setEspace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [reserving, setReserving] = useState(false)
  const [reserveSuccess, setReserveSuccess] = useState(false)
  const [reserveError, setReserveError] = useState(null)
  const [unavailableDates, setUnavailableDates] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const token = localStorage.getItem('token')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    
    apiGetEspace(id).then(res => {
      if (res.ok) {
        const data = res.data?.data?.data || res.data?.data || res.data
        setEspace(data)
        // Extraire les dates indisponibles
        const dates = []
        const resList = data.reservations?.data || data.reservations || []
        resList.forEach(r => {
          let current = new Date(r.date_debut)
          const last = new Date(r.date_fin)
          while (current <= last) {
            dates.push(current.toISOString().split('T')[0])
            current.setDate(current.getDate() + 1)
          }
        })
        setUnavailableDates(dates)
      }
      else setError('Espace introuvable.')
      setLoading(false)
    })

    return () => window.removeEventListener('resize', handleResize)
  }, [id])

  // Génération des jours du mois pour le calendrier
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    
    // Ajouter les jours du mois précédent pour aligner le premier jour (Lundi = 1, Dimanche = 0)
    let firstDayOfWeek = firstDay.getDay()
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Convertir en Lundi=0
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    
    return days
  }

  const calendarDays = getDaysInMonth(currentMonth)

  const handleDateClick = (date) => {
    if (!date) return
    const dateStr = date.toISOString().split('T')[0]
    
    
    if (date < new Date(new Date().setHours(0,0,0,0)) || unavailableDates.includes(dateStr)) return

    if (!dateDebut || (dateDebut && dateFin)) {
      setDateDebut(dateStr)
      setDateFin('')
    } else {
      if (new Date(dateStr) < new Date(dateDebut)) {
        setDateDebut(dateStr)
        setDateFin('')
      } else {
        if (!isRangeUnavailable(dateDebut, dateStr)) {
          setDateFin(dateStr)
        } else {
          setDateDebut(dateStr)
          setDateFin('')
        }
      }
    }
  }

  // Vérifier si une plage de dates contient des dates indisponibles
  const isRangeUnavailable = (start, end) => {
    if (!start || !end) return false
    let current = new Date(start)
    const last = new Date(end)
    while (current <= last) {
      if (unavailableDates.includes(current.toISOString().split('T')[0])) return true
      current.setDate(current.getDate() + 1)
    }
    return false
  }

  const rangeError = isRangeUnavailable(dateDebut, dateFin)

  const jours = dateDebut && dateFin && !rangeError
    ? Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86400000) + 1)
    : 0
  const total = jours * (espace?.tarif_jour || 0)

const handleReserver = async () => {
  if (!token) { 
    navigate('/login', { state: { from: `/espaces/${id}` } }); 
    return 
  }
  if (!dateDebut || !dateFin) return
  setReserving(true)
  setReserveError(null)
  
  const res = await apiCreateReservation({ espace_id: id, date_debut: dateDebut, date_fin: dateFin })
  
  if (res.ok) {
    setReserveSuccess(true)
    setDateDebut('')
    setDateFin('')
    setTimeout(() => navigate('/dashboard'), 2000)
  } else {
    setReserveError(res.data?.message || 'Erreur lors de la réservation.')
  }
  setReserving(false)
}

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff7f6' }}>
      <div style={{ fontSize: '0.9rem', color: '#4a7a85' }}>Chargement...</div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff7f6' }}>
      <div style={{ fontSize: '0.9rem', color: '#ef4444' }}>{error}</div>
    </div>
  )

  const typeColor = TYPE_COLORS[espace.type] || { bg: '#f0f4f5', text: '#4a7a85' }

  return (
    <div style={{ minHeight: '100vh', background: '#eff7f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: isMobile ? '1rem 1.5rem' : '1.2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239,247,246,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,58,69,0.06)' }}>
        <a href="/" style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, color: '#3a5f66', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          Eco<span style={{ color: '#7bdff2' }}>Work</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.8rem' : '1.5rem' }}>
          <a href="/espaces" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#4a7a85', textDecoration: 'none', fontWeight: 500 }}>
            {isMobile ? '← Retour' : '← Tous les espaces'}
          </a>
          {token
            ? <a href="/dashboard" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#3a5f66', textDecoration: 'none', fontWeight: 600, background: '#7bdff2', padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem', borderRadius: '8px' }}>
                {isMobile ? 'Dashboard' : 'Mon espace'}
              </a>
            : <a href="/login" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#3a5f66', textDecoration: 'none', fontWeight: 600, background: '#7bdff2', padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem', borderRadius: '8px' }}>
                {isMobile ? 'Login' : 'Se connecter'}
              </a>
          }
        </div>
      </nav>

      <div style={{ paddingTop: 72, position: 'relative', height: isMobile ? 320 : 460, overflow: 'hidden' }}>
        {espace.photo ? (
          <img src={`${API_URL}/storage/${espace.photo}`} loading="lazy" alt={espace.nom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #3a5f66 0%, #0d2530 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: isMobile ? '3rem' : '5rem', opacity: 0.15 }}>
              {espace.type === 'bureau' ? '🖥️' : espace.type === 'salle_reunion' ? '📽️' : '🎤'}
            </span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,22,0.7) 0%, transparent 60%)' }} />

        <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '2.5rem', left: isMobile ? '1.5rem' : '2.5rem', right: isMobile ? '1.5rem' : '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <span style={{ background: typeColor.bg, color: typeColor.text, fontSize: isMobile ? '0.65rem' : '0.72rem', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {TYPE_LABELS[espace.type] || espace.type}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#eff7f6', fontSize: isMobile ? '0.65rem' : '0.72rem', fontWeight: 600, padding: '0.3rem 0.9rem', borderRadius: '100px' }}>
              {espace.surface} m²
            </span>
          </div>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#eff7f6', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {espace.nom}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '3rem 2rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '1.5rem' : '3rem', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 1px 12px rgba(26,58,69,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3a5f66', margin: 0 }}>
                Disponibilités
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  style={{ background: '#f8fbfc', border: '1px solid #eee', borderRadius: '8px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                >
                  ‹
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3a5f66', minWidth: 100, textAlign: 'center' }}>
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  style={{ background: '#f8fbfc', border: '1px solid #eee', borderRadius: '8px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                >
                  ›
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#4a7a85', paddingBottom: '0.5rem' }}>{d}</div>
              ))}
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} />
                
                const dateStr = date.toISOString().split('T')[0]
                const isUnavailable = unavailableDates.includes(dateStr)
                const isPast = date < new Date(new Date().setHours(0,0,0,0))
                const isSelected = dateStr === dateDebut || dateStr === dateFin
                const isInRange = dateDebut && dateFin && dateStr > dateDebut && dateStr < dateFin
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateClick(date)}
                    disabled={isUnavailable || isPast}
                    style={{
                      aspectRatio: '1',
                      border: 'none',
                      borderRadius: '10px',
                      background: isSelected ? '#7bdff2' : isInRange ? 'rgba(123,223,242,0.1)' : isUnavailable || isPast ? '#f3f4f6' : 'white',
                      color: isSelected ? '#3a5f66' : isUnavailable || isPast ? '#ccc' : '#3a5f66',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: isUnavailable || isPast ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {date.getDate()}
                    {isUnavailable && !isPast && (
                      <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#ccc' }} />
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Disponible', color: 'white', border: '#eee' },
                { label: 'Indisponible', color: '#f3f4f6', border: 'none' },
                { label: 'Sélectionné', color: '#7bdff2', border: 'none' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '3px', background: item.color, border: `1px solid ${item.border}` }} />
                  <span style={{ fontSize: '0.75rem', color: '#4a7a85' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {espace.equipements?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 1px 12px rgba(26,58,69,0.06)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3a5f66', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
                Équipements inclus
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.8rem' }}>
                {espace.equipements.map(eq => (
                  <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', background: '#f8fbfc', borderRadius: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7bdff2', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#3a5f66' }}>{eq.libelle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 1px 12px rgba(26,58,69,0.06)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3a5f66', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
              Informations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Type', value: TYPE_LABELS[espace.type] || espace.type },
                { label: 'Surface', value: `${espace.surface} m²` },
                { label: 'Tarif', value: `${Number(espace.tarif_jour).toLocaleString('fr-FR')} € /jour` },
                { label: 'Équipements', value: `${espace.equipements?.length || 0} inclus` },
              ].map(info => (
                <div key={info.label} style={{ padding: '1rem', background: '#f8fbfc', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4a7a85', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{info.label}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#3a5f66' }}>{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div style={{ position: isMobile ? 'static' : 'sticky', top: '5.5rem', width: '100%' }}>
          <div style={{ background: '#3a5f66', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 8px 40px rgba(26,58,69,0.2)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7bdff2', marginBottom: '0.4rem' }}>
                Tarif
              </p>
              <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#eff7f6', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {Number(espace.tarif_jour).toLocaleString('fr-FR')} €
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(239,247,246,0.4)' }}>/jour</span>
              </div>
            </div>

            {reserveSuccess ? (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>✅</div>
                <p style={{ fontSize: '0.88rem', color: '#4ade80', fontWeight: 600, marginBottom: '0.4rem' }}>Réservation confirmée !</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(239,247,246,0.4)' }}>Retrouvez-la dans votre dashboard.</p>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', background: '#7bdff2', color: '#3a5f66', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Voir mon dashboard →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reserveError && (
                  <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.82rem', color: '#f87171' }}>
                    {reserveError}
                  </div>
                )}

                {rangeError && (
                  <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                    Certaines dates dans cette plage sont déjà réservées.
                  </div>
                )}

                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(239,247,246,0.4)' }}>
                    Date de début
                  </label>
                  <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ background: 'rgba(239,247,246,0.07)', border: '1px solid rangeError ? "rgba(251,191,36,0.5)" : "rgba(239,247,246,0.1)"', borderRadius: '8px', padding: '0.8rem 1rem', color: '#eff7f6', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
                </div>

                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(239,247,246,0.4)' }}>
                    Date de fin
                  </label>
                  <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                    min={dateDebut || new Date().toISOString().split('T')[0]}
                    style={{ background: 'rgba(239,247,246,0.07)', border: '1px solid rangeError ? "rgba(251,191,36,0.5)" : "rgba(239,247,246,0.1)"', borderRadius: '8px', padding: '0.8rem 1rem', color: '#eff7f6', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
                </div>

                {jours > 0 && !rangeError && (
                  <div style={{ background: 'rgba(239,247,246,0.05)', border: '1px solid rgba(239,247,246,0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(239,247,246,0.4)' }}>
                      {jours} jour{jours > 1 ? 's' : ''} × {Number(espace.tarif_jour).toLocaleString('fr-FR')} €
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7bdff2' }}>
                      {Number(total).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                )}

                <button
                  onClick={handleReserver}
                  disabled={reserving || !dateDebut || !dateFin || rangeError}
                  style={{ background: !dateDebut || !dateFin || rangeError ? 'rgba(123,223,242,0.4)' : '#7bdff2', color: '#3a5f66', border: 'none', padding: '1rem', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 700, cursor: !dateDebut || !dateFin || rangeError ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {reserving ? 'Réservation...' : rangeError ? 'Dates indisponibles' : token ? 'Réserver cet espace' : 'Se connecter pour réserver'}
                </button>

                {!token && (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(239,247,246,0.3)', textAlign: 'center', margin: 0 }}>
                    Vous serez redirigé vers la page de connexion
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}