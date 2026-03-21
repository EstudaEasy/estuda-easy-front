import { useState, useEffect } from "react";
import GroupMemberService from "@/services/group/GroupMemberService";
import { GroupMember } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MoreVertical, Trash2, Shield, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getErrorMessage } from "@/lib/errorMessage";

interface GroupMembersProps {
  groupId: string;
  currentUserMember: GroupMember;
}

export default function GroupMembers({ groupId, currentUserMember }: GroupMembersProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await GroupMemberService.list(groupId);
      // O endpoint pode retornar os membros num array ou num objeto: {members: []}
      const data = res.data as any;
      setMembers(Array.isArray(data) ? data : data.members || []);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      toast.error(getErrorMessage(error, "Erro ao carregar membros do grupo"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const handleRemoveMember = async (memberId: string | number) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;
    try {
      await GroupMemberService.removeMember(groupId, String(memberId));
      toast.success("Membro removido com sucesso");
      setMembers((prev) => prev.filter((m) => String(m.id) !== String(memberId)));
    } catch (error) {
      console.error("Erro ao remover:", error);
      toast.error(getErrorMessage(error, "Erro ao remover membro"));
    }
  };

  const handleChangeRole = async (memberId: string | number, newRole: "admin" | "member") => {
    try {
      // Como definido no OpenAPI: /groups/{groupId}/members/{memberId}/role
      await GroupMemberService.updateRole(groupId, String(memberId), { role: newRole });
      toast.success("Permissão atualizada!");
      fetchMembers();
    } catch (error) {
      console.error("Erro ao atualizar papel:", error);
      toast.error(getErrorMessage(error, "Erro ao atualizar permissão"));
    }
  };

  const roleLabels: Record<string, string> = {
    owner: "Dono",
    admin: "Admin",
    member: "Membro",
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Membros do Grupo ({members.length})</h3>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 animate-pulse">Carregando membros...</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {members.map((member) => {
            const isMe = member.userId === currentUserMember.userId;
            const amIOwner = currentUserMember.role === "owner";
            const amIAdmin = currentUserMember.role === "admin";

            // Regras:
            // - Apenas owner pode alterar cargo de outras pessoas.
            // - Owner não pode alterar seu próprio cargo nesta tela (ele teria que passar o grupo para outro)
            const canChangeRole = amIOwner && !isMe;
            // - Owner pode remover qualquer um, exceto ele mesmo.
            // - Admin pode remover apenas membros (não admins ou owners).
            const canRemove =
              (amIOwner && !isMe) || (amIAdmin && member.role === "member" && !isMe);

            // Adaptação para extrair infos do usuário
            const user = (member as any).user || { name: "Usuário desconhecido", email: "" };

            return (
              <div key={member.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {user.name && user.name.length > 0 ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {user.name}
                      {isMe && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Você
                        </span>
                      )}
                    </p>
                    {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1 ${
                      member.role === "owner"
                        ? "bg-purple-100 text-purple-700"
                        : member.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member.role === "owner" && <Shield size={12} />}
                    {roleLabels[member.role] || member.role}
                  </div>

                  {(canChangeRole || canRemove) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-700"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {canChangeRole && member.role === "member" && (
                          <DropdownMenuItem onClick={() => handleChangeRole(member.id, "admin")}>
                            <Shield className="mr-2 h-4 w-4" /> Promover a Admin
                          </DropdownMenuItem>
                        )}
                        {canChangeRole && member.role === "admin" && (
                          <DropdownMenuItem onClick={() => handleChangeRole(member.id, "member")}>
                            <UserIcon className="mr-2 h-4 w-4" /> Rebaixar a Membro
                          </DropdownMenuItem>
                        )}
                        {canRemove && (
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remover do grupo
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
