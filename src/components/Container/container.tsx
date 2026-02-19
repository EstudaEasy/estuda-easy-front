"use client";

import { ReactNode } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

interface ContainerProps {
  href: string;
  title: string;
  icon: ReactNode;
}

export default function Container({ href, title, icon }: ContainerProps) {
  return (
    <Link href={href} className={styles.toolsCard}>
      <div className={`${styles.style} ${poppins.variable} ${poppins.className}`}>
        <span className={styles.containerIcon}>{icon}</span>
        <div className={styles.containerTitle}>{title}</div>
      </div>
    </Link>
  );
}
