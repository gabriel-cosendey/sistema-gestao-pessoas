import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PessoaEditForm } from "../components/PessoaEditForm";
import { pessoaApi } from "../services/pessoaApi";
import type { Pessoa } from "../types/pessoa";

export function PessoaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    pessoaApi.getById(Number(id))
      .then(setPessoa)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Carregando pessoa...</p>;
  }

  if (error) {
    return <p className="mensagem-erro">{error}</p>;
  }

  if (!pessoa) {
    return <p>Pessoa não encontrada.</p>;
  }

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Editar {pessoa.nome}</h1>
      </header>
      <PessoaEditForm
        pessoa={pessoa}
        onAtualizado={() => navigate("/pessoas")}
        onCancelar={() => navigate("/pessoas")}
      />
    </div>
  );
}
