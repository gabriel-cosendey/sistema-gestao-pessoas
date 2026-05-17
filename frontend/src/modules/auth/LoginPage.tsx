import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await login({ email, senha });
      navigate("/dashboard");
    } catch (error: any) {
      setErro(error.message || "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {erro && <p className="mensagem-erro">{erro}</p>}
      </form>
    </div>
  );
}
