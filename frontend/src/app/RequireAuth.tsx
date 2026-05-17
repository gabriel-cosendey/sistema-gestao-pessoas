import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/authContext";
import type { Role } from "../types/user";

type RequireAuthProps = {
  children: JSX.Element;
  roles?: Role[];
};

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
