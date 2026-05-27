import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to your ElonEdge account to access your portfolio.
      </p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <a className="text-accent hover:underline" href="/register">
          Create a free account
        </a>
      </p>
    </div>
  );
}
