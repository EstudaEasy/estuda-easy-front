import * as React from "react";
import { TypographVariant, ColorVariant } from "@/styles/variants";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: TypographVariant;
  color?: ColorVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TypographVariant;
  color?: ColorVariant;
  as?: "p" | "span" | "div";
}

export interface SectionDropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  text?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}
