"use client";

import { ReactNode } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { LuEllipsisVertical } from "react-icons/lu";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

interface ContainerProps {
  href: string;
  title: string;
  icon: ReactNode;
  onEditClick?: (e: React.MouseEvent) => void;
}

export default function Container({ href, title, icon, onEditClick }: ContainerProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onEditClick) {
      onEditClick(e);
    }
  };

  return (
    <Link href={href} className={styles.toolsCard}>
      <div className={`${styles.style} ${poppins.variable} ${poppins.className}`}>
        <span className={styles.containerIcon}>{icon}</span>
        <div className={styles.containerTitle}>{title}</div>

        <button className={styles.editButton} onClick={handleEditClick}>
          <LuEllipsisVertical size={20} />
        </button>
      </div>
    </Link>
  );
}
