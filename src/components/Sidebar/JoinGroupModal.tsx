"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GroupService from "@/services/group/GroupService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JoinGroupModal({ isOpen, onClose, onSuccess }: JoinGroupModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      toast.error("Por favor, insira o código de convite.");
      return;
    }

    try {
      setIsLoading(true);
      // O backend expõe o endpoint POST /groups/join para entrar em um grupo via código
      const response = await GroupService.join(inviteCode.trim());

      toast.success("Você entrou no grupo com sucesso!");
      onSuccess();
      router.push(`/groups/${response.data.id}`);
      onClose();
    } catch (error: any) {
      console.error("Erro ao entrar no grupo:", error);
      toast.error(
        error.response?.data?.message ||
          "Erro ao entrar no grupo. Verifique o código e tente novamente.",
      );
    } finally {
      setIsLoading(false);
      setInviteCode("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar e Entrar em um Grupo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray-500">
            Insira o código de convite fornecido pelo dono ou administrador do grupo.
          </p>
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Ex: ABC123XYZ"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleJoin} disabled={isLoading || !inviteCode.trim()}>
            {isLoading ? "Entrando..." : "Entrar no Grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
