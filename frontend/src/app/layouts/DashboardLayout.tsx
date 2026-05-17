import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/authContext";
import { useTheme } from "../../modules/theme/ThemeContext";
import "../../styles/dashboard.css";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const showAcessos = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Gestão</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pessoas">Pessoas</Link>
          {showAcessos && <Link to="/acessos">Acessos</Link>}
          <Link to="/perfil">Perfil</Link>
          <Link to="/configuracoes">Configurações</Link>
        </nav>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div>
            <span className="welcome">Olá, {user?.nome}</span>
            <span className="role-tag">{user?.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="theme-toggle" onClick={toggle} aria-label="Alternar tema">
              <span className="theme-icon">{dark ? "🌙" : "☀️"}</span>
              <span className="theme-label">{dark ? "Escuro" : "Claro"}</span>
            </button>

            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
