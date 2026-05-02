import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Inscription from './pages/Inscription';
import Login from './pages/Login';
import Espaces from './pages/Espaces';
import EspaceDetail from './pages/Espaces/EspaceDetail';
import UserDashboard from './pages/Dashboard/User'
import AdminDashboard from './pages/Dashboard/Admin'

// Lazy load home sections
const SectionSilence = lazy(() => import("./components/SectionSilence"));
const SectionBuilding = lazy(() => import("./components/SectionBuilding"));
const SectionFlow = lazy(() => import("./components/SectionFlow"));
const SectionCalendar = lazy(() => import("./components/SectionCalendar"));
const SectionCTA = lazy(() => import("./components/SectionCTA"));

function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#eff7f6' }} />}>
      <main>
        <SectionSilence />
        <SectionBuilding />
        <SectionFlow />
        <SectionCalendar />
        <SectionCTA />
      </main>
    </Suspense>
  );
}

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" />;
  if (role && user?.type_de_compte !== role) return <Navigate to="/dashboard" />;
  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    return user.type_de_compte === "admin"
      ? <Navigate to="/admin" />
      : <Navigate to="/dashboard" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/espaces" element={<Espaces />} />
        <Route path="/espaces/:id" element={<EspaceDetail />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/inscription" element={<Inscription />} />

        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}