"use client";

import { LucideAlbum, LucideHome, LucideProps, GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "../ui/sidebar";
import { ComponentType } from "react";
import { usePathname } from "next/navigation";
import NavItem, { NavItemProps } from "./navItem";
import CollapsibleNavItem from "./collapsibleNavItem";
import { NavUser } from "./navUser";
import { useAuth } from "@/context/auth";
import Image from "next/image";
import LogoPrincipal from "@/assets/EstudaEasyLogoPrincipal.png";
import LogoReduzida from "@/assets/EstudaEasyLogoReduzida.png";

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
          { name: "Pomodoro", url: "/tools/pomodoro" },
          { name: "Tasks", url: "/tools/tasks" },
          { name: "Diário", url: "/tools/diary" },
          { name: "WhiteBoard", url: "/tools/whiteboard" },
        ],
        isCollapsible: true,
      },
      { name: "Grupos", url: "/groups", icon: LucideAlbum },
    ],
  },
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const pathname = usePathname();

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
<<<<<<< HEAD
      {/* Logo Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center space-x-2">
        <div
          style={{ backgroundColor: "#3461fd" }}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-sm text-gray-900 truncate group-data-[collapsible=icon]:hidden">
          EstudaEasy
        </span>
      </div>
=======
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
          className="hidden h-7 w-7 origin-center object-contain group-data-[collapsible=icon]:block group-data-[collapsible=icon]:scale-125"
          priority
        />
      </SidebarHeader>
>>>>>>> 9aaf244 (feat: adds system logos to the sidebar (main and reduced))

      <SidebarContent>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label}>
            {groupIndex > 0 && <SidebarSeparator />}
            <SidebarGroup>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

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
    </Sidebar>
  );
}
