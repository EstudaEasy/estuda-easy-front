"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import AuthService from "@/services/auth/AuthService";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadUser } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const accessTokenURL = searchParams.get("accessToken");
    const refreshTokenURL = searchParams.get("refreshToken");

    if (accessTokenURL && refreshTokenURL) {
      const finalizeLogin = async () => {
        try {
          // 1. Fazemos o REFRESH imediato para invalidar os tokens da URL
          // Enviamos o refreshToken que veio na URL para receber um novo par
          const { data: newData } = await AuthService.refreshToken({
            refreshToken: refreshTokenURL,
          });

          const { accessToken, refreshToken } = newData;

          // 2. Salva os NOVOS tokens (seguros) no LocalStorage
          localStorage.setItem("@EstudaEasy:accessToken", accessToken);
          localStorage.setItem("@EstudaEasy:refreshToken", refreshToken);

          // 3. Sincroniza os NOVOS cookies com o servidor Next.js
          await fetch("/api/auth/set-cookies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, refreshToken }),
          });

          // 4. Carrega os dados do usuário e limpa a rota
          await loadUser();

          toast.success("Conexão segura estabelecida!");
          router.replace("/home");
        } catch (error) {
          console.error("Erro ao rotacionar tokens:", error);
          toast.error("Falha na validação de segurança do Google.");
          router.replace("/login");
        }
      };

      finalizeLogin();
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, loadUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">Autenticando com Google</h2>
        <p className="text-sm text-gray-500">Estamos preparando seu ambiente de estudos...</p>
      </div>
    </div>
  );
}
