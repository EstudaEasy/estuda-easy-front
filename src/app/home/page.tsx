"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import UserService from "@/services/user/UserService";
import Sidebar from "@/components/Sidebar/sidebar";
import { User } from "@/types";

import DashboardSection from "@/components/feature/dashboard/sections/DashboardSection";
import ActivitySection from "@/components/feature/dashboard/sections/ActivitySection";
import QuickAccessSection from "@/components/feature/dashboard/sections/QuickAccessSection";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@EstudaEasy:accessToken");
    const userId = localStorage.getItem("@EstudaEasy:userId");

    if (!token || !userId || userId === "undefined") {
      console.log("Acesso negado, redirecionando...");
      router.push("/login");
      return;
    }

    if (!token || !userId) {
      console.log("Acesso negado, redirecionando...");
      router.push("/login");
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
      <aside className={styles.sidebar}>
        <Sidebar></Sidebar>
      </aside>
      <main className={styles.card}>
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className={styles.estudante}>Olá, {userData?.name || "Estudante"}!</h1>
              <h1 className={styles.welcomeText}>Bem-vindo de Volta!</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center text-center bg-primary-dark text-white rounded-full w-12 h-12">
                <span className="text-heading-1">{userData?.name[0]}</span>
              </button>
            </div>
          </div>
        </header>

        <DashboardSection />
        <ActivitySection />
        <QuickAccessSection />
      </main>
    </div>
  );
}
