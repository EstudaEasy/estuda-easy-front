"use client";

import { Suspense, useState } from "react";
import styles from "../auth.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/FormInput/page";

import GoogleIcon from "@/assets/_Google.png";
import EyeIcon from "@/assets/eyeicon.png";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessage";

function LoginPageContent() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      const redirectPath = searchParams.get("redirect");
      router.replace(redirectPath || "/home");
    } catch (error) {
      console.log("Erro no login:", error);
      toast.error(getErrorMessage(error, "Erro no login"));
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.text}>Entre ou crie sua conta e simplifique sua rotina de estudos</p>

        <Button type="button" variant="outline" className={styles.googleButton}>
          <Image src={GoogleIcon} alt="Google" width={22} />
          Google
        </Button>

        <div className={styles.or}>
          <span>Ou</span>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={EyeIcon}
            onIconClick={() => setShowPassword(!showPassword)}
            required
          />

          <Link href="/forgot-password" className={styles.forgotPassword}>
            Esqueceu sua senha?
          </Link>

          <Button type="submit" variant={"default"} className={styles.button} disabled={isLoading}>
            Entrar
          </Button>
        </form>

        <p className={styles.createAccount}>
          Ainda não tem uma conta?{" "}
          <Link href="/register" className={styles.link}>
            Crie agora!
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <LoginPageContent />
    </Suspense>
  );
}
