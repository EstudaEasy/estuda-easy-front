"use client";

import { useState, useEffect, useMemo } from "react";
import Page from "@/components/Page";
import GroupForm from "@/components/GroupForm";
import { GroupFormData } from "@/components/GroupForm/groupForm.schema";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import GroupService from "@/services/group/GroupService";
import { Group, CreateGroupRequest } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errorMessage";

export default function Groups() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    return groups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [groups, searchTerm]);

  const fetchGroups = async () => {
    try {
      const response = await GroupService.list();
      setGroups(response.data.groups || []);
    } catch (error) {
      console.log("Error fetching groups:", error);
      toast.error(getErrorMessage(error, "Erro ao carregar grupos"));
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [refreshTrigger]);

  const handleCreateGroup = async (data: GroupFormData) => {
    try {
      setIsCreating(true);
      const groupData: CreateGroupRequest = {
        name: data.name,
        description: data.description || undefined,
      };
      await GroupService.create(groupData);
      setIsCreateModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Grupo criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao criar grupo. Tente novamente"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditGroup = async (data: GroupFormData) => {
    if (!editingGroup) return;

    try {
      setIsCreating(true);
      await GroupService.update(editingGroup.id, {
        name: data.name,
        description: data.description || undefined,
      });
      setIsEditModalOpen(false);
      setEditingGroup(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Grupo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao editar grupo. Tente novamente"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!editingGroup) return;

    try {
      setIsDeleting(true);
      await GroupService.delete(editingGroup.id);
      setIsDeleteDialogOpen(false);
      setIsEditModalOpen(false);
      setEditingGroup(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Grupo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao excluir grupo. Tente novamente"));
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (group: Group) => {
    setEditingGroup(group);
    setIsEditModalOpen(true);
  };

  return (
    <Page>
      <Page.Header
        title="Grupos"
        subtitle="Gerencie seus grupos de estudo"
        buttonIcon={<Plus />}
        buttonText="Criar Grupo"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />
      <Page.Content>
        <div className="w-full space-y-6">
          <div className="w-full">
            <input
              type="text"
              placeholder="Pesquisar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            />
          </div>

          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhum grupo encontrado com esse nome."
                  : "Nenhum grupo encontrado. Crie um novo grupo para começar!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => router.push(`/groups/${group.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/groups/${group.id}`);
                    }
                  }}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                  )}
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(group)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        setEditingGroup(group);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Page.Content>

      {/* Modal de Criação */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isCreating) setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
          </DialogHeader>
          <GroupForm onSubmit={handleCreateGroup} isLoading={isCreating} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" form="group-form" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <GroupForm
              initialData={{
                name: editingGroup.name,
                description: editingGroup.description || "",
              }}
              onSubmit={handleEditGroup}
              isLoading={isCreating}
            />
          )}
          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isCreating || isDeleting}
              >
                Cancelar
              </Button>
              <Button type="submit" form="group-form" disabled={isCreating}>
                {isCreating ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este grupo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
