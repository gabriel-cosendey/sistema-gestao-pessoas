import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createUser, getUsers, removeUser, updateUser } from "../services/userApi";
import { useAuth } from "../../auth/authContext";
import type { UpdateUserData, User, Role } from "../../../types/user";

type UserFormState = {
  nome: string;
  email: string;
  senha: string;
  role: Role;
  ativo: boolean;
};

export function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formState, setFormState] = useState<UserFormState>({
    nome: "",
    email: "",
    senha: "",
    role: "rh",
    ativo: true,
  });
  const canEditAccess = user?.role === "admin";
  const canCreateAccess = user?.role === "admin";

  const loadUsers = async () => {
    try {
      setLoading(true);
      const list = await getUsers();
      setUsers(list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      if (editingUser) {
        const payload: UpdateUserData = {
          nome: formState.nome,
          email: formState.email,
          role: formState.role,
          ativo: formState.ativo,
        };

        if (formState.senha.trim()) {
          payload.senha = formState.senha;
        }

        await updateUser(editingUser.id, payload);
        setEditingUser(null);
      } else {
        await createUser(formState);
      }

      setFormState({ nome: "", email: "", senha: "", role: "rh", ativo: true });
      await loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setFormState({ nome: user.nome, email: user.email, senha: "", role: user.role, ativo: user.ativo });
  }

  function handleCancelEdit() {
    setEditingUser(null);
    setFormState({ nome: "", email: "", senha: "", role: "rh", ativo: true });
  }

  async function handleRemove(id: number) {
    if (!confirm("Excluir este acesso?")) return;
    try {
      await removeUser(id);
      await loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Acessos do sistema</h1>
        <p>Gerencie as contas que acessam o sistema.</p>
      </header>

      <section className="page-section">
        <h2>Lista de acessos</h2>

        {loading ? (
          <p>Carregando acessos...</p>
        ) : (
          <table className="table-list">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Permissão</th>
                <th>Ativo</th>
                <th>Último login</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((access) => (
                <tr key={access.id}>
                  <td>{access.nome}</td>
                  <td>{access.email}</td>
                  <td>{access.role}</td>
                  <td>{access.ativo ? "Sim" : "Não"}</td>
                  <td>{access.last_login ?? "Nunca"}</td>
                  <td>
                    {canEditAccess && (
                      <button onClick={() => handleEdit(access)} className="btn-editar">
                        Editar
                      </button>
                    )}
                    {user?.role === "admin" && (
                      <button onClick={() => handleRemove(access.id)} className="btn-deletar">
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="page-section">
        <h2>{editingUser ? "Editar acesso" : "Cadastrar novo acesso"}</h2>
        {canCreateAccess || editingUser ? (
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Nome
              <input
                value={formState.nome}
                onChange={(event) => setFormState({ ...formState, nome: event.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={formState.email}
                onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={formState.senha}
                onChange={(event) => setFormState({ ...formState, senha: event.target.value })}
                required={!editingUser}
                placeholder={editingUser ? "Deixe vazio para manter a senha" : ""}
              />
            </label>
            <label>
              Permissão
              {canCreateAccess ? (
                <select
                  value={formState.role}
                  onChange={(event) => setFormState({ ...formState, role: event.target.value as Role })}
                >
                  <option value="rh">RH</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <input value={formState.role} readOnly />
              )}
            </label>
            <label>
              Ativo
              <select
                value={formState.ativo ? "sim" : "nao"}
                onChange={(event) => setFormState({ ...formState, ativo: event.target.value === "sim" })}
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </label>
            <div className="form-acoes">
              <button type="submit" className="btn-primary">
                {editingUser ? "Salvar alterações" : "Criar acesso"}
              </button>
              {editingUser ? (
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="mensagem-aviso">Somente Admin pode criar novos acessos.</p>
        )}
      </section>

      {error && <p className="mensagem-erro">{error}</p>}
    </div>
  );
}
