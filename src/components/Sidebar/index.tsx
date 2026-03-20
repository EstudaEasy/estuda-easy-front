"use client";
import React, { useState, useEffect } from "react";

import { LucideAlbum, LucideHome, LucideProps, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuButton,
  SidebarMenuAction,
} from "../ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import GroupMemberService from "@/services/group/GroupMemberService";
import { toast } from "sonner";
import { ComponentType } from "react";
import { usePathname } from "next/navigation";
import NavItem, { NavItemProps } from "./navItem";
import CollapsibleNavItem from "./collapsibleNavItem";
import { NavUser } from "./navUser";
import { useAuth } from "@/context/auth";
import Image from "next/image";
import LogoPrincipal from "@/assets/EstudaEasyLogoPrincipal.png";
import LogoReduzida from "@/assets/EstudaEasyLogoReduzida.png";
import { Group } from "@/types";
import GroupService from "@/services/group/GroupService";
import JoinGroupModal from "./JoinGroupModal";
import Link from "next/link";

type IconComponent = ComponentType<{ size?: number | string } | LucideProps>;

export interface NavGroupItem extends NavItemProps {
  isCollapsible?: boolean;
}

export type NavGroup = {
  label: string;
  action?: { icon: IconComponent; label: string; onClick: () => void };
  items: NavGroupItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Plataforma",
    items: [
      { name: "Dashboard", url: "/home", icon: LucideHome },
      {
        name: "Ferramentas",
        url: "/tools",
        icon: LucideAlbum,
        subItems: [
          { name: "Quiz", url: "/tools/quiz" },
          { name: "Flashcards", url: "/tools/flashcards" },
          { name: "Compartilhados", url: "/tools/shared-resources" },
          { name: "Pomodoro", url: "/tools/pomodoro" },
          { name: "Tasks", url: "/tools/tasks" },
          { name: "Diário", url: "/tools/diary" },
          { name: "WhiteBoard", url: "/tools/whiteboard" },
        ],
        isCollapsible: true,
      },
    ],
  },
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState<Group | null>(null);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await GroupService.list();
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error("Erro ao buscar grupos", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user, pathname]);

  const handleLeaveGroup = async () => {
    if (!groupToLeave || !user) return;
    try {
      setIsLeavingGroup(true);
      const res = await GroupMemberService.list(groupToLeave.id);
      const members = Array.isArray(res.data) ? res.data : (res.data as any).members || [];
      const myMember = members.find((m: any) => m.userId === user.id);
      if (myMember) {
        if (myMember.role === "owner") {
          toast.error("Como dono do grupo, repasse a posse ou apague-o nas configurações.", {
            duration: 4000,
          });
          return;
        }
        await GroupMemberService.removeMember(groupToLeave.id, myMember.id.toString());
        toast.success("Você saiu do grupo com sucesso");
        fetchGroups();
      } else {
        toast.error("Você não é membro deste grupo");
      }
    } catch (error) {
      console.error("Erro ao sair do grupo", error);
      toast.error("Erro ao sair do grupo");
    } finally {
      setIsLeavingGroup(false);
      setGroupToLeave(null);
    }
  };

  function handleNavRender(item: NavGroupItem) {
    const isActive =
      item.url === pathname ||
      (item.subItems?.some((subItem) => subItem.url === pathname) ?? false);

    return item.isCollapsible ? (
      <CollapsibleNavItem key={item.name} {...item} isActive={isActive} />
    ) : (
      <NavItem key={item.name} {...item} isActive={isActive} />
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-start border-b border-sidebar-border/60 px-4 py-2 pt-10 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Image
          src={LogoPrincipal}
          alt="EstudaEasy"
          className="h-auto w-30 object-contain group-data-[collapsible=icon]:hidden"
          priority
        />
        <Image
          src={LogoReduzida}
          alt="EstudaEasy"
          className="hidden h-6 w-6 origin-center object-contain group-data-[collapsible=icon]:block group-data-[collapsible=icon]:scale-125"
          priority
        />
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label}>
            {groupIndex > 0 && <SidebarSeparator />}
            <SidebarGroup>
              {group.action && (
                <SidebarGroupAction title={group.action.label} onClick={group.action.onClick}>
                  <group.action.icon size={16} />
                </SidebarGroupAction>
              )}

              <SidebarGroupContent>
                <SidebarMenu>{group.items.map((item) => handleNavRender(item))}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}

        <SidebarGroup>
          <div className="flex items-center justify-between pointer-events-none group-data-[collapsible=icon]:opacity-0 pb-2 px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring">
            <span>Grupos</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="pointer-events-auto">
                <button className="h-5 w-5 flex text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2">
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/groups">Meus Grupos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsJoinModalOpen(true)}>
                  Buscar Grupo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {groups.slice(0, 5).map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/groups/${group.id}`}>
                    <Link href={`/groups/${group.id}`}>
                      <LucideAlbum size={18} />
                      <span>{group.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal size={14} />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => setGroupToLeave(group)}>
                        Sair do Grupo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              {groups.length === 0 && (
                <SidebarMenuItem>
                  <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-sidebar-foreground/50">
                    <span className="truncate">Nenhum grupo encontrado</span>
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            avatar: user?.photoUrl || "",
            email: user?.email || "",
            name: user?.name || "",
          }}
        />
      </SidebarFooter>

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchGroups}
      />

      <AlertDialog open={!!groupToLeave} onOpenChange={(open) => !open && setGroupToLeave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair do grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair do grupo "{groupToLeave?.name}"? Você perderá o acesso aos
              recursos compartilhados por ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeavingGroup}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleLeaveGroup();
              }}
              disabled={isLeavingGroup}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLeavingGroup ? "Saindo..." : "Sair do grupo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
