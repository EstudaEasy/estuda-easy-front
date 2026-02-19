"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/FormInput/page";

import GoogleIcon from "@/assets/_Google.png";
import EyeIcon from "@/assets/eyeicon.png";
import { Button, Typography } from "@/components/base";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.replace("/home");
    } catch (error) {
      console.log("Erro no login:", error);
      alert("Erro no login");
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

          <a href="#" className={styles.forgotPassword}>
            Esqueceu sua senha?
          </a>

          <Button type="submit" variant="primary" size="full" disabled={isLoading}>
            <Typography variant="body-1">Entrar</Typography>
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
