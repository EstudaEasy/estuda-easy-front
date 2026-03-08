"use client";

import styles from "./styles.module.css";
import DashboardSection from "@/components/feature/dashboard/sections/DashboardSection";
import ActivitySection from "@/components/feature/dashboard/sections/ActivitySection";
import QuickAccessSection from "@/components/feature/dashboard/sections/QuickAccessSection";
import { useAuth } from "@/context/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <main>
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className={styles.estudante}>Olá, {user?.name || "Estudante"}!</h1>
            <h1 className={styles.welcomeText}>Bem-vindo de Volta!</h1>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <DashboardSection />
        <ActivitySection />
        <QuickAccessSection />
      </div>
    </main>
  );
}
