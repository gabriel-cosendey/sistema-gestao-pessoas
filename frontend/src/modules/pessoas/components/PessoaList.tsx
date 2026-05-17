import type { Pessoa } from "../types/pessoa";

type PessoaListProps = {
  pessoas: Pessoa[];
  onEditar?: (pessoa: Pessoa) => void;
  onDeletar?: (id: number) => void;
  canManage?: boolean;
};

export function PessoaList({ pessoas, onEditar, onDeletar, canManage = false }: PessoaListProps) {
  return (
    <>
      <div className="tabela-header">
        <h2>Pessoas Cadastradas</h2>
        <span className="total-badge">{pessoas.length} resultado{pessoas.length !== 1 ? "s" : ""}</span>
      </div>

      {pessoas.length === 0 ? (
        <p className="lista-vazia">Nenhuma pessoa encontrada.</p>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cargo</th>
                <th>Nascimento</th>
                {canManage && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.email}</td>
                  <td>{pessoa.telefone || "-"}</td>
                  <td>{pessoa.cargo || "-"}</td>
                  <td>{pessoa.data_nascimento || "-"}</td>
                  {canManage && (
                    <td>
                      <button onClick={() => onEditar?.(pessoa)} className="btn-editar">
                        Editar
                      </button>
                      <button onClick={() => onDeletar?.(pessoa.id)} className="btn-deletar">
                        Deletar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}