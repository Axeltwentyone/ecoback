import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { apiGetEspaces } from '../../services/api'
import NavBar from './NavBar'
import SearchBar from './SearchBar'
import EspaceCard from './EspaceCard'
import Pagination from '../../components/Pagination'
import { useLowCarbon } from '../../context/LowCarbonContext'

export default function Espaces() {
  const { lowCarbonMode } = useLowCarbon()

  const [espaces, setEspaces] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [typeActif, setTypeActif] = useState('Tous')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const { ok, data } = await apiGetEspaces(page)
      if (!ok) {
        setError('Impossible de charger les espaces.')
        setLoading(false)
        return
      }
      
      const list = data?.data?.data || data?.data || data || []
      setEspaces(Array.isArray(list) ? list : [])
      setPagination(data?.data?.meta || data?.pagination || null)
      setLoading(false)
    }
    load()
  }, [page])

  const filtres = espaces.filter(e => {
    const matchType = typeActif === 'Tous' || e.type === typeActif
    const matchSearch = e.nom?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: lowCarbonMode ? '#f7f7f7' : '#eff7f6',
      fontFamily: 'system-ui, sans-serif',
      transition: 'background 0.3s',
    }}>
      <NavBar />

      <SearchBar
        search={search}
        onSearch={setSearch}
        typeActif={typeActif}
        onType={setTypeActif}
      />

      <div style={{ padding: isMobile ? '1.5rem 1rem' : '2rem 3rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            {lowCarbonMode ? (
              <p style={{ fontSize: '0.9rem', color: '#4a7a85' }}>Chargement...</p>
            ) : (
              <Loader2 size={32} color="#1a3a45" style={{ animation: 'spin 1s linear infinite' }} />
            )}
          </div>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#e53e3e', padding: '4rem' }}>{error}</p>
        ) : (
          <>
            {lowCarbonMode && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: '#e8faf8', border: '1px solid #b2e8de',
                borderRadius: '10px', padding: '0.7rem 1rem',
                marginBottom: '1.5rem',
              }}>
                <span>🌿</span>
                <span style={{ fontSize: '0.8rem', color: '#0d7a6a', fontWeight: 500 }}>
                  Mode Low Carbon actif — images désactivées pour réduire l'empreinte carbone.
                </span>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#3d6b75', marginBottom: '1.5rem' }}>
              {filtres.length} espace{filtres.length > 1 ? 's' : ''} disponible{filtres.length > 1 ? 's' : ''}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {filtres.map(e => (
                <EspaceCard key={e.id} espace={e} />
              ))}
            </div>

            {filtres.length === 0 && (
              <p style={{ textAlign: 'center', color: '#4a7a85', padding: '4rem' }}>
                Aucun espace ne correspond à votre recherche.
              </p>
            )}

            <Pagination pagination={pagination} page={page} onPage={setPage} />
          </>
        )}
      </div>

      {!lowCarbonMode && (
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      )}
    </div>
  )
}