'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/FormInput/page';
import { Button } from '@/components/Button/page';
import UserService from '@/services/UserService';
import { jwtDecode } from 'jwt-decode';

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
      const response = await UserService.login({ email, password });
      const { accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem('@EstudaEasy:accessToken', accessToken);
        
        const decoded: any = jwtDecode(accessToken);
        const userId = decoded.user?.id; 

        if (userId) {
          localStorage.setItem('@EstudaEasy:userId', String(userId));
          alert('Login realizado com sucesso!');
          router.push('/home');
        } else {
          console.error("ID não encontrado dentro de decoded.user:", decoded.user);
          alert("Erro ao identificar o ID do usuário.");
        }
      }
    } catch (error: any) {
      alert("Erro no login");
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
          Ainda não tem uma conta? <Link href="/register" className={styles.link}>Crie agora!</Link>
        </p>
      </main>
    </div>
  );
}