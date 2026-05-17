import { PessoaForm } from "../components/PessoaForm";
import { useNavigate } from "react-router-dom";

export function NewPessoaPage() {
  const navigate = useNavigate();

  function handlePessoaCriada() {
    navigate("/pessoas");
  }

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Cadastrar nova pessoa</h1>
        <p>Adicione uma nova pessoa à base de dados.</p>
      </header>
      <PessoaForm onPessoaCriada={handlePessoaCriada} />
    </div>
  );
}
