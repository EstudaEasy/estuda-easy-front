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

          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center text-center bg-primary-dark text-white rounded-full w-12 h-12">
              <span className="text-heading-1">{user?.name[0].toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      <DashboardSection />
      <ActivitySection />
      <QuickAccessSection />
    </main>
  );
}
