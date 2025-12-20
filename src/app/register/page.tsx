'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserService from '@/services/UserService';
import { Input } from '@/components/FormInput/page';
import { Button } from '@/components/Button/page';

import GoogleIcon from '@/assets/_Google.png';
import EyeIcon from '@/assets/eyeicon.png';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const formattedBirthDate = birthDate ? new Date(birthDate).toISOString() : null;

      await UserService.registerUser({
        name,
        email,
        password,
        phoneNumber,
        birthdate: birthDate,
      });

      alert('Conta criada com sucesso!');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta.';
      alert(message);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <h1 className={styles.title}>Crie sua Conta</h1>
        <p className={styles.text}>
          Registe-se para começar a organizar os seus estudos.
        </p>

        <button type="button" className={styles.googleButton}>
          <Image src={GoogleIcon} alt="Google" width={22} />
          Google
        </button>

        <div className={styles.or}>
          <span>Ou</span>
        </div>

        <form className={styles.form} onSubmit={handleRegister}>
          <Input 
            type="text" 
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input 
            type="email" 
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input 
            type="text" 
            placeholder="Telefone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <Input 
            type="date" 
            placeholder="Data de Nascimento"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
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

          <Input 
            type="password" 
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button text="Criar conta" type="submit" />
        </form>

        <p className={styles.createAccount}>
          Já tem uma conta? <Link href="/login" className={styles.link}>Entre agora!</Link>
        </p>
      </main>
    </div>
  );
}