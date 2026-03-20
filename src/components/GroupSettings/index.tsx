import { useState } from "react";
import { Group } from "@/types";
import GroupService from "@/services/group/GroupService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GroupForm from "@/components/GroupForm";
import { GroupFormData } from "@/components/GroupForm/groupForm.schema";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Copy, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { getErrorMessage } from "@/lib/errorMessage";

interface GroupSettingsProps {
  group: Group;
  onUpdate: () => void;
}

export default function GroupSettings({ group, onUpdate }: GroupSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = async (data: GroupFormData) => {
    try {
      setIsUpdating(true);
      await GroupService.update(String(group.id), {
        name: data.name,
        description: data.description || undefined,
      });
      toast.success("Grupo atualizado com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao atualizar grupo"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRegenerateCode = async () => {
    if (
      !confirm("Tem certeza que deseja gerar um novo código? O código antigo não funcionará mais.")
    )
      return;
    try {
      setIsRegenerating(true);
      await GroupService.resetInviteCode(String(group.id));
      toast.success("Novo código de convite gerado!");
      onUpdate(); // reload group data
    } catch (error) {
      console.error("Erro ao gerar novo código:", error);
      toast.error(getErrorMessage(error, "Erro ao gerar novo código"));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setIsDeleting(true);
      await GroupService.delete(String(group.id));
      toast.success("Grupo deletado com sucesso!");
      router.push("/groups");
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao deletar grupo"));
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCopyCode = () => {
    if ((group as any).inviteCode) {
      navigator.clipboard.writeText((group as any).inviteCode);
      toast.success("Código copiado para a área de transferência!");
    } else {
      toast.error("Nenhum código disponível");
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Grupo</h3>
        <div className="mb-4">
          <GroupForm
            initialData={{
              name: group.name,
              description: group.description || "",
            }}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button type="submit" form="group-form" disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      {/* Código de Convite */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Código de Convite</h3>
        <p className="text-sm text-gray-500 mb-4">
          O código de convite permite que outras pessoas encontrem e entrem no grupo facilmente.
        </p>

        <div className="flex items-center gap-3">
          <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 font-mono text-lg font-semibold tracking-widest text-gray-800 flex-1 flex justify-between items-center shadow-inner">
            {(group as any).inviteCode || "••••••••"}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              title="Copiar código"
              disabled={!(group as any).inviteCode}
            >
              <Copy className="h-5 w-5 text-gray-400 hover:text-gray-700" />
            </Button>
          </div>
          <Button
            variant="outline"
            className="h-[52px]"
            onClick={handleRegenerateCode}
            disabled={isRegenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            Gerar Novo
          </Button>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-100 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white p-2.5 rounded-full text-red-500 shadow-sm border border-red-100 mt-1 sm:mt-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-1">
                Zona de Perigo: Deletar Grupo
              </h3>
              <p className="text-sm text-red-600/80">
                Esta ação é irreversível. Todos os posts, recursos compartilhados e a lista de
                membros serão perdidos permanentemente.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
            className="shrink-0"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deletando..." : "Deletar Grupo"}
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o grupo "<strong>{group.name}</strong>"? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Excluindo..." : "Sim, Deletar Grupo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
