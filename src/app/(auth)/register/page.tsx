import { RegisterForm } from "./register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your ElonEdge account</h1>
      <p className="mt-2 text-sm text-muted">
        Open your investment account in minutes. Bank-grade security, zero hidden fees.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <a className="text-accent hover:underline" href="/login">
          Sign in
        </a>
      </p>
    </div>
  );
}
