import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../modules/auth/authContext";
import { ThemeProvider } from "../modules/theme/ThemeContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "../modules/auth/LoginPage";
import { DashboardPage } from "../modules/dashboard/DashboardPage";
import { PessoasPage } from "../modules/pessoas/pages/PessoasPage";
import { NewPessoaPage } from "../modules/pessoas/pages/NewPessoaPage";
import { PessoaDetailsPage } from "../modules/pessoas/pages/PessoaDetailsPage";
import { PessoaEditPage } from "../modules/pessoas/pages/PessoaEditPage";
import { UsersPage } from "../modules/users/pages/UsersPage";
import { ProfilePage } from "../modules/profile/ProfilePage";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { RequireAuth } from "./RequireAuth";
import "../styles/global.css";
import "../styles/dashboard.css";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pessoas" element={<PessoasPage />} />
            <Route path="pessoas/novo" element={<NewPessoaPage />} />
            <Route path="pessoas/:id" element={<PessoaDetailsPage />} />
            <Route path="pessoas/:id/editar" element={<PessoaEditPage />} />
            <Route
              path="acessos"
              element={
                <RequireAuth roles={["admin", "rh"]}>
                  <UsersPage />
                </RequireAuth>
              }
            />
            <Route path="usuarios" element={<Navigate to="/acessos" replace />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}