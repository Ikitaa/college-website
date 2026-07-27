import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth();

  // Auth check hudai xa bhane wait garne (page flicker rokan)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-200 border-t-maroon-600" />
      </div>
    );
  }

  // Login xaina bhane login page ma pathauне
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check — allowedRoles diyeko cha bhane, user ko role match hunuparcha
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="text-center">
          <p className="font-display text-6xl font-semibold text-maroon-200">403</p>
          <p className="mt-2 text-lg font-semibold text-ink-700">Access Forbidden</p>
          <p className="mt-1 text-sm text-ink-500">You don't have permission to view this page.</p>
          <a href="/" className="mt-4 inline-block text-sm font-semibold text-maroon-600 hover:underline">
            ← Back to home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}