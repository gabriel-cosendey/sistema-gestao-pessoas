import { useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";

export function SettingsPage() {
  const { dark, toggle } = useTheme();

  useEffect(() => {
    // ensure body classes are consistent (ThemeProvider also manages this)
    document.body.classList.toggle("theme-dark", dark);
    document.body.classList.toggle("theme-light", !dark);
  }, [dark]);

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Configurações</h1>
        <p>Opções do sistema e preferências do usuário.</p>
      </header>

      <section className="page-section">
        <div className="settings-row">
          <div>
            <h3>Tema</h3>
            <p>Escolha entre tema claro e escuro.</p>
          </div>
          <div>
            <button className="theme-toggle big" onClick={toggle} aria-label="Alternar tema">
              <span className="theme-icon">{dark ? "🌙" : "☀️"}</span>
              <span className="theme-label">{dark ? "Escuro" : "Claro"}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
