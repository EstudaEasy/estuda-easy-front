"use client";

import { ChevronRight, LucideProps } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type IconComponent = ComponentType<{ size?: number | string } | LucideProps>;

export type NavSubItem = {
  name: string;
  url: string;
};

export type CollapsibleNavItemProps = {
  name: string;
  url: string;
  icon: IconComponent;
  badge?: ReactNode;
  action?: { icon: IconComponent; label: string; onClick: () => void };
  subItems?: NavSubItem[];
  isActive?: boolean;
};

export default function CollapsibleNavItem({
  name,
  icon: Icon,
  badge,
  action,
  subItems,
  isActive,
}: CollapsibleNavItemProps) {
  const pathname = usePathname();

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={name} isActive={isActive}>
            <Icon size={18} />
            <span>{name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {badge !== undefined && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}

        {action && (
          <SidebarMenuAction title={action.label} onClick={action.onClick}>
            <action.icon size={14} />
          </SidebarMenuAction>
        )}

        {subItems && subItems.length > 0 && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {subItems.map((sub) => (
                <SidebarMenuSubItem key={sub.name}>
                  <SidebarMenuSubButton asChild isActive={pathname === sub.url}>
                    <Link href={sub.url}>{sub.name}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
