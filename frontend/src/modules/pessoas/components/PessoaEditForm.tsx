import { useState } from "react";
import type { FormEvent } from "react";
import { pessoaApi } from "../services/pessoaApi";
import type { Pessoa } from "../types/pessoa";

type PessoaEditFormProps = {
  pessoa: Pessoa;
  onAtualizado: () => void;
  onCancelar: () => void;
};

export function PessoaEditForm({ pessoa, onAtualizado, onCancelar }: PessoaEditFormProps) {
  const [formData, setFormData] = useState({
    nome: pessoa.nome,
    cpf: pessoa.cpf,
    email: pessoa.email,
    telefone: pessoa.telefone || "",
    cargo: pessoa.cargo || "",
    data_nascimento: pessoa.data_nascimento || "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setMensagem("");
      setErro(false);

      await pessoaApi.update(pessoa.id, formData);

      setMensagem("Pessoa atualizada com sucesso!");
      onAtualizado();
    } catch (error: any) {
      setErro(true);
      setMensagem(error.message || "Erro ao atualizar pessoa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Editar Pessoa</h2>

      <div className="form-grid">
        <label>
          Nome <span className="obrigatorio">*</span>
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </label>

        <label>
          CPF <span className="obrigatorio">*</span>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            required
          />
        </label>

        <label>
          Email <span className="obrigatorio">*</span>
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>

        <label>
          Telefone
          <input
            type="text"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </label>

        <label>
          Cargo
          <input
            type="text"
            placeholder="Ex: Desenvolvedor"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          />
        </label>

        <label>
          Data de Nascimento
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
          />
        </label>
      </div>

      <div className="form-acoes">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancelar}>
          Cancelar
        </button>
      </div>

      {mensagem && (
        <p className={erro ? "mensagem-erro" : "mensagem-sucesso"}>{mensagem}</p>
      )}
    </form>
  );
}