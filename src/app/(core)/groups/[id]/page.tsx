"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Page from "@/components/Page";
import GroupService from "@/services/group/GroupService";
import GroupMemberService from "@/services/group/GroupMemberService";
import { Group, GroupMember } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import GroupPosts from "@/components/GroupPosts";
import GroupMembers from "@/components/GroupMembers";
import GroupSettings from "@/components/GroupSettings";
import { getErrorMessage } from "@/lib/errorMessage";

export default function GroupDetails() {
  const params = useParams();
  const groupId = params.id as string;
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [currentUserMember, setCurrentUserMember] = useState<GroupMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroupData = async () => {
    if (!groupId || !user) return;
    try {
      setIsLoading(true);
      const [groupRes, membersRes] = await Promise.all([
        GroupService.getById(groupId),
        GroupMemberService.list(groupId),
      ]);

      setGroup(groupRes.data);

      const membersData = membersRes.data as any;
      const membersArray = Array.isArray(membersData) ? membersData : membersData.members || [];

      const member = membersArray.find((m: GroupMember) => m.userId === user.id);
      if (member) {
        setCurrentUserMember(member);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do grupo:", error);
      toast.error(getErrorMessage(error, "Erro ao carregar detalhes do grupo"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId, user]);

  if (isLoading) {
    return (
      <Page>
        <Page.Header title="Carregando..." />
        <Page.Content>
          <Skeleton className="w-full h-12 mb-6" />
          <Skeleton className="w-full h-64" />
        </Page.Content>
      </Page>
    );
  }

  if (!group || !currentUserMember) {
    return (
      <Page>
        <Page.Header title="Grupo não encontrado" />
        <Page.Content>
          <p className="text-gray-500">
            Você não tem permissão para ver este grupo ou ele não existe.
          </p>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header title={group.name} subtitle={group.description || "Sem descrição"} />
      <Page.Content className="overflow-hidden">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px] mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
            {(currentUserMember.role === "owner" || currentUserMember.role === "admin") && (
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <GroupPosts groupId={groupId} currentUserMember={currentUserMember} />
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <GroupMembers groupId={groupId} currentUserMember={currentUserMember} />
          </TabsContent>

          {(currentUserMember.role === "owner" || currentUserMember.role === "admin") && (
            <TabsContent value="settings" className="mt-0">
              <GroupSettings group={group} onUpdate={fetchGroupData} />
            </TabsContent>
          )}
        </Tabs>
      </Page.Content>
    </Page>
  );
}
