'use client';

import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('@EstudaEasy:accessToken');
    localStorage.removeItem('@EstudaEasy:refreshToken');
    localStorage.removeItem('@EstudaEasy:token'); 

    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <main>
        <h1>Olá</h1>
        <p>
          Parabéns! Você está logado no EstudaEasy.
        </p>

        <button 
          onClick={handleLogout}
          className={styles.button}
        >
          Sair da conta
        </button>
      </main>
    </div>
  );
}