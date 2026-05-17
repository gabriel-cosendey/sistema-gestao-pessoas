import { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { apiGet } from "../../lib/api";

type DashboardData = {
  totalPessoas: number;
  totalUsuarios: number;
  pessoasRecentes: Array<{ id: number; nome: string; cargo?: string; email: string }>;
};

export function DashboardPage() {
  const { user } = useAuth();
  const canViewRecent = user?.role === "admin" || user?.role === "rh";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<DashboardData>("/dashboard")
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (error) {
    return <p className="mensagem-erro">{error}</p>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de gestão de pessoas.</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total de pessoas</h2>
          <strong>{data?.totalPessoas}</strong>
        </div>
        <div className="dashboard-card">
          <h2>Total de acessos</h2>
          <strong>{data?.totalUsuarios}</strong>
        </div>
      </div>

      {canViewRecent && (
        <section className="dashboard-section">
          <h2>Últimas pessoas cadastradas</h2>
          <ul className="dashboard-list">
            {data?.pessoasRecentes.map((pessoa) => (
              <li key={pessoa.id}>
                <strong>{pessoa.nome}</strong>
                <div className="meta">
                  <span className="role-tag">{pessoa.cargo || "Sem cargo"}</span>
                  <small className="email">{pessoa.email}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
