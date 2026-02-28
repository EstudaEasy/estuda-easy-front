"use client";

import { LucideProps } from "lucide-react";
import { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

type IconComponent = ComponentType<{ size?: number | string } | LucideProps>;

export type NavSubItem = {
  name: string;
  url: string;
};

export type NavItemProps = {
  name: string;
  url: string;
  icon: IconComponent;
  badge?: ReactNode;
  action?: { icon: IconComponent; label: string; onClick: () => void };
  subItems?: NavSubItem[];
  isActive?: boolean;
};

export default function NavItem({
  name,
  url,
  icon: Icon,
  badge,
  action,
  subItems,
  isActive,
}: NavItemProps) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem key={name}>
      <SidebarMenuButton asChild isActive={isActive} tooltip={name}>
        <Link href={url}>
          <Icon size={18} />
          <span>{name}</span>
        </Link>
      </SidebarMenuButton>

      {badge !== undefined && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}

      {action && (
        <SidebarMenuAction title={action.label} onClick={action.onClick}>
          <action.icon size={14} />
        </SidebarMenuAction>
      )}

      {subItems && subItems.length > 0 && (
        <SidebarMenuSub>
          {subItems.map((sub) => (
            <SidebarMenuSubItem key={sub.name}>
              <SidebarMenuSubButton asChild isActive={pathname === sub.url}>
                <Link href={sub.url}>{sub.name}</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
