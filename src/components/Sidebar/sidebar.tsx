'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import UserService from '@/services/UserService';
import Item from './Item/item';

export default function Sidebar() {
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
  
    const handleLogout = () => {
      localStorage.clear();
      router.push('/login');
    };
  
    if (loading) return <div className={styles.loading}>Carregando...</div>;
  
  return (
    <div className={styles.sidebarContainer}>
      <main className={styles.topContent}>
        <h1 className={styles.logoText}>
          EstudaEasy
        </h1> 

        <p className={styles.line}></p>
      </main>
      
      <div className={styles.containerItems}>  
          <div className={styles.items}>
            <Item></Item>
          </div>
        </div>
      
      <div className={styles.padding}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair da conta
        </button>
        </div>
    </div>
  );
}