"use client";

import styles from "./styles.module.css";
import QuickAccessSection from "@/components/feature/dashboard/sections/QuickAccessSection";
import ActivitySection from "@/components/feature/dashboard/sections/ActivitySection";
// import DashboardSection from "@/components/feature/dashboard/sections/DashboardSection";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className={styles.estudante}>Olá, {user?.name || "Estudante"}!</h1>
            <h1 className={cn(styles.welcomeText, "text-sm sm:text-base mt-1 sm:mt-2")}>
              Bem-vindo de Volta!
            </h1>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-6 sm:gap-8">
        <QuickAccessSection />
        <ActivitySection />
        {/* <DashboardSection /> */}
      </div>
    </main>
  );
}
