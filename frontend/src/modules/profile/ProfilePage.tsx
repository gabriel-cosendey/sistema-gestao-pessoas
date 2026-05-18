import { useState } from "react";
import { useAuth } from "../auth/authContext";

export function ProfilePage() {
  const { user } = useAuth();
  const [name] = useState(user?.nome ?? "");
  const [email] = useState(user?.email ?? "");

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Meu Perfil</h1>
        <p>Dados da sua conta e acesso ao sistema.</p>
      </header>

      <div className="page-section">
        <label>
          Nome
          <input value={name} readOnly />
        </label>
        <label>
          Email
          <input value={email} readOnly />
        </label>
        <label>
          Permissão
          <input value={user?.role ?? "-"} readOnly />
        </label>
      </div>
    </div>
  );
}
