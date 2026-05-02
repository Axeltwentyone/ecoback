import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Users from "./Users";
import Espaces from "./Espaces";
import Equipements from "./Equipements";
import Reservations from "./Reservations";
import { apiGetUsers, apiGetEspaces, apiAdminGetEspaces } from "../../../services/api";

const injectStyles = () => {
  const s = document.createElement("style");
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f0f4f5; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(26,58,69,0.15); border-radius: 4px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    input, select, button { font-family: inherit; }
    input:focus, select:focus { outline: none; }
  `;
  document.head.appendChild(s);
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [usersCount, setUsersCount] = useState(0);
  const [espacesCount, setEspacesCount] = useState(0);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      const [usersRes, espacesRes] = await Promise.all([apiGetUsers(), apiAdminGetEspaces()]);
      
      const users = usersRes.data?.data?.data || usersRes.data?.data || usersRes.data || [];
      const espaces = espacesRes.data?.data?.data || espacesRes.data?.data || espacesRes.data || [];

      setUsersCount(usersRes.data?.data?.meta?.total || usersRes.data?.pagination?.total || users.length);
      setEspacesCount(espacesRes.data?.data?.meta?.total || espacesRes.data?.pagination?.total || espaces.length);
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    injectStyles();
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    fetchData();

    // Rafraîchir les compteurs globaux toutes les minutes
    const interval = setInterval(fetchData, 60000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [refreshKey]);

  const sections = {
    overview: <Overview usersCount={usersCount} espacesCount={espacesCount} />,
    users: <Users />,
    espaces: <Espaces />,
    equipements: <Equipements />,
    reservations: <Reservations />,
  };

  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f5" }}>
      <Sidebar 
        active={active} 
        setActive={(id) => { setActive(id); setSidebarOpen(false); }} 
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
        />
      )}

      <main style={{ 
        marginLeft: isMobile ? 0 : 240, 
        flex: 1, 
        padding: isMobile ? "1rem" : "2.5rem", 
        minHeight: "100vh",
        width: "100%",
        transition: "margin 0.3s"
      }}>
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ 
              background: 'white', border: '1px solid rgba(26,58,69,0.1)', 
              borderRadius: '8px', padding: '0.6rem', marginBottom: '1rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            ☰ Menu
          </button>
        )}
        {sections[active]}
      </main>
    </div>
  );
}
