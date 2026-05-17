import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pessoaApi } from "../services/pessoaApi";
import type { Pessoa } from "../types/pessoa";

export function PessoaDetailsPage() {
  const { id } = useParams();
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
    return <p>Carregando dados...</p>;
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
        <h1>Perfil de {pessoa.nome}</h1>
      </header>

      <section className="page-section detalhes-card">
        <p><strong>Nome:</strong> {pessoa.nome}</p>
        <p><strong>CPF:</strong> {pessoa.cpf}</p>
        <p><strong>Email:</strong> {pessoa.email}</p>
        <p><strong>Telefone:</strong> {pessoa.telefone || "-"}</p>
        <p><strong>Cargo:</strong> {pessoa.cargo || "-"}</p>
        <p><strong>Data de nascimento:</strong> {pessoa.data_nascimento || "-"}</p>
        <p><strong>Cadastrado em:</strong> {pessoa.created_at}</p>
      </section>
    </div>
  );
}
