'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import UserService from '@/services/UserService';
import Sidebar from '@/components/Sidebar/sidebar';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@EstudaEasy:accessToken'); 
    const userId = localStorage.getItem('@EstudaEasy:userId');

  if (!token || !userId || userId === "undefined") {
      console.log("Acesso negado, redirecionando...");
      router.push('/login');
      return;
  }

    if (!token || !userId) {
        console.log("Acesso negado, redirecionando...");
        router.push('/login');
        return;
    }

    async function loadUserProfile() {
        try {
            const response = await UserService.getById(userId as string);
            setUserData(response.data); 
        } catch (error) {
            console.error("Erro na API:", error);
        } finally {
            setLoading(false);
        }
    }

    loadUserProfile();
    }, [router]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar></Sidebar>
      </div>
      <main className={styles.card}>
        <h1 className={styles.estudante}>
          Olá, {userData?.name || 'Estudante'}!
        </h1>

        <h1 className={styles.welcomeText}>
         Bem-vindo de Volta!
        </h1>

      </main>
    </div>
  );
}