import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { pessoaApi } from "../services/pessoaApi";
import type { Pessoa } from "../types/pessoa";
import { PessoaForm } from "../components/PessoaForm";
import { PessoaEditForm } from "../components/PessoaEditForm";
import { PessoaList } from "../components/PessoaList";
import "../styles/pessoas.css";

export function PessoasPage() {
  const { user } = useAuth();
  const canManagePessoas = user?.role === "admin" || user?.role === "rh";
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa | null>(null);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaCargo, setBuscaCargo] = useState("");

  async function carregarPessoas(nome?: string, cargo?: string) {
    const data = await pessoaApi.getAll(nome, cargo);
    setPessoas(data);
  }

  async function handleBuscar() {
    await carregarPessoas(buscaNome, buscaCargo);
  }

  function handleLimparBusca() {
    setBuscaNome("");
    setBuscaCargo("");
    carregarPessoas();
  }

  async function handleDeletar(id: number) {
    if (confirm("Tem certeza que deseja deletar esta pessoa?")) {
      await pessoaApi.remove(id);
      carregarPessoas(buscaNome, buscaCargo);
    }
  }

  function handleEditar(pessoa: Pessoa) {
    setPessoaEditando(pessoa);
  }

  function handleAtualizado() {
    setPessoaEditando(null);
    carregarPessoas(buscaNome, buscaCargo);
  }
  async function handlePessoaCriada() {
    setBuscaNome("");
    setBuscaCargo("");
    await carregarPessoas();
  }
  function handleCancelar() {
    setPessoaEditando(null);
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  return (
    <div className="pessoas-page">
      <header className="pessoas-header">
        <div className="header-info">
          <h1>Sistema de Gestão de Pessoas</h1>
          <p>Cadastre, liste, edite e remova pessoas.</p>
        </div>
        <span className="header-badge">{pessoas.length} pessoa{pessoas.length !== 1 ? "s" : ""}</span>
      </header>

      <div className="pessoas-body">
        <div className="pessoas-card">
          <div className="card-section">
            {pessoaEditando ? (
              <PessoaEditForm
                pessoa={pessoaEditando}
                onAtualizado={handleAtualizado}
                onCancelar={handleCancelar}
              />
            ) : canManagePessoas ? (
              <PessoaForm onPessoaCriada={handlePessoaCriada} />
            ) : (
              <div className="mensagem-aviso">
                Você não tem permissão para cadastrar ou editar pessoas. Somente RH e Admin podem fazer isso.
              </div>
            )}
          </div>

          <div className="card-divider" />

          <div className="card-section">
            <h2>Buscar Pessoas</h2>
            <div className="busca-grid busca-grid--panel">
              <label>
                Nome
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={buscaNome}
                  onChange={(e) => setBuscaNome(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                />
              </label>
              <label>
                Cargo
                <input
                  type="text"
                  placeholder="Buscar por cargo..."
                  value={buscaCargo}
                  onChange={(e) => setBuscaCargo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                />
              </label>
              <div className="busca-actions">
                <button className="btn-primary" onClick={handleBuscar}>Buscar</button>
                <button className="btn-limpar" onClick={handleLimparBusca}>Limpar</button>
              </div>
            </div>
          </div>

          <div className="card-divider" />

          <div className="card-section">
            <PessoaList
              pessoas={pessoas}
              onEditar={handleEditar}
              onDeletar={handleDeletar}
              canManage={canManagePessoas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}