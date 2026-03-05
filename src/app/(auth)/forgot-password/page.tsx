"use client";

import { useState } from "react";
import styles from "../auth.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/FormInput/page";
import { Button } from "@/components/ui/button";
import AuthService from "@/services/auth/AuthService";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await AuthService.forgotPassword({ email });
      toast.success("E-mail de recuperação enviado. Verifique sua caixa de entrada.");
      router.push("/login");
    } catch {
      toast.success("Erro ao enviar e-mail de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <h1 className={styles.title}>Recuperar Senha</h1>
        <p className={styles.text}>
          Informe seu e-mail e enviaremos instruções para redefinir sua senha.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" variant="default" className={styles.button} disabled={isLoading}>
            Enviar e-mail
          </Button>
        </form>

        <p className={styles.createAccount}>
          Lembrou a senha?{" "}
          <Link href="/login" className={styles.link}>
            Voltar para o login
          </Link>
        </p>
      </main>
    </div>
  );
}
