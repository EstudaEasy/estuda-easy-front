'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Input } from '@/components/FormInput/page';
import { Button } from '@/components/Button/page';

import GoogleIcon from '@/assets/_Google.png';
import EyeIcon from '@/assets/eyeicon.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem('@EstudaEasy:accessToken', response.data.accessToken);
        localStorage.setItem('@EstudaEasy:refreshToken', response.data.refreshToken);

        alert('Login realizado com sucesso!');

        router.push('/dashboard'); 
      } else {
        alert("Erro: Token não recebido.");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'E-mail ou senha inválidos';
      alert(message);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.text}>
          Entre ou crie sua conta e simplifique sua rotina de estudos
        </p>

        <button type="button" className={styles.googleButton}>
          <Image src={GoogleIcon} alt="Google" width={22} />
          Google
        </button>

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

          <a href="#" className={styles.forgotPassword}>Esqueceu sua senha?</a>

          <Button text="Entrar" type="submit" />
        </form>

        <p className={styles.createAccount}>
          Ainda não tem uma conta? <Link href="/register" className={styles.link}>crie agora!</Link>
        </p>
      </main>
    </div>
  );
}