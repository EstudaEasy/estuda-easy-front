import * as React from "react";
import {
  TypographVariant,
  ColorVariant,
  BackgroundColorVariant,
  SizeVariant,
  FontSizeVariant,
} from "@/styles/variants";

export type CardProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

export type CardHeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

export type CardFooterProps = {
  className?: string;
  children?: React.ReactNode;
};

export type CardContentProps = {
  className?: string;
  children?: React.ReactNode;
};

export interface CardTitleProps extends Omit<
  React.HTMLAttributes<HTMLHeadingElement>,
  "className"
> {
  variant?: TypographVariant;
  color?: ColorVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface CardDescriptionProps extends Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "className"
> {
  variant?: TypographVariant;
  color?: ColorVariant;
  as?: "p" | "span" | "div";
}

export type CardIconVariant =
  | "rounded-sm"
  | "rounded-md"
  | "rounded-lg"
  | "square-sm"
  | "square-md"
  | "square-lg";

export interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: BackgroundColorVariant;
  color?: ColorVariant;
  icon: string;
  iconSize?: FontSizeVariant;
  variant?: CardIconVariant;
}

export const CARD_ICON_VARIANTS: Record<CardIconVariant, string> = {
  "rounded-sm": "w-10 h-10 rounded-full",
  "rounded-md": "w-14 h-14 rounded-full",
  "rounded-lg": "w-20 h-20 rounded-full",
  "square-sm": "w-10 h-10 rounded-md",
  "square-md": "w-14 h-14 rounded-lg",
  "square-lg": "w-20 h-20 rounded-xl",
};

export const ICONS_SIZES: Record<SizeVariant, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};
