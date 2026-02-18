"use client";

import styles from "./styles.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHouse, LuLayoutGrid, LuSparkles, LuUsers, LuUser } from "react-icons/lu";

export default function Item() {
  const pathname = usePathname();

  return (
    <div className={styles.items}>
      <Link href="/home" className={`${styles.item} ${pathname === "/home" ? styles.active : ""}`}>
        <LuHouse />
        <span>Início</span>
      </Link>

      <Link
        href="/tools"
        className={`${styles.item} ${pathname === "/tools" ? styles.active : ""}`}
      >
        <LuLayoutGrid />
        <span>Ferramentas</span>
      </Link>

      <Link href="/tia" className={`${styles.item} ${pathname === "/tia" ? styles.active : ""}`}>
        <LuSparkles />
        <span>TIA</span>
      </Link>

      <Link
        href="/groups"
        className={`${styles.item} ${pathname === "/groups" ? styles.active : ""}`}
      >
        <LuUsers />
        <span>Grupos</span>
      </Link>

      <Link
        href="/profile"
        className={`${styles.item} ${pathname === "/profile" ? styles.active : ""}`}
      >
        <LuUser />
        <span>Perfil</span>
      </Link>
    </div>
  );
}
