import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If the user got redirected here from a protected page (e.g. /dashboard),
  // send them back there after a successful login instead of always to home.
  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success("Logged in successfully");

      // Role anusaar redirect garne
      // Role anusaar redirect garne
if (loggedInUser?.role === "admin") {
  navigate("/admin", { replace: true });
} else {
  // if user was redirected from a protected page, go back there
  navigate(redirectTo, { replace: true });
}
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center text-center">
          <img
  src="/logo.png"
  alt="College logo"
  className="h-24 w-24 object-contain"
/>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="rounded-xl border border-maroon-100 bg-cream-50 p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-maroon-200 bg-maroon-50 px-3 py-2.5 text-sm text-maroon-600"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-maroon-500 hover:text-maroon-600"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 pr-10 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-500 hover:text-ink-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-maroon-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            New student?{" "}
            <Link
              to="/register"
              className="font-semibold text-maroon-500 hover:text-maroon-600"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          <Link to="/" className="hover:text-maroon-500">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}