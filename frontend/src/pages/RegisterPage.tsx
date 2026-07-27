import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";

export default function RegisterPage() {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [faculty, setFaculty] = useState("");
  const [semester, setSemester] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent({
        name,
        email,
        password,
        ...(faculty && { faculty }),
        ...(semester && { semester: Number(semester) }),
        ...(rollNumber && { rollNumber }),
      });
      toast.success("Account created successfully");
      navigate("/dashboard", { replace: true });
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
            Create an account
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Register as a student to access your dashboard
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
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="faculty" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Faculty <span className="font-normal text-ink-500">(optional)</span>
                </label>
                <input
                  id="faculty"
                  name="faculty"
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="e.g. Science"
                  className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
                />
              </div>
              <div>
                <label htmlFor="semester" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Semester <span className="font-normal text-ink-500">(optional)</span>
                </label>
                <input
                  id="semester"
                  name="semester"
                  type="number"
                  min={1}
                  max={12}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rollNumber" className="mb-1.5 block text-sm font-medium text-ink-700">
                Roll number <span className="font-normal text-ink-500">(optional)</span>
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 2024-CS-014"
                className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-md border border-maroon-100 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-maroon-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-maroon-500 hover:text-maroon-600">
              Sign in
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