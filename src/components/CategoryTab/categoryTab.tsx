"use client";

import styles from "./styles.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryTab() {
  const pathname = usePathname();

  return (
    <div className={styles.categories}>
      <Link
        href="/tools/quiz"
        className={`${styles.category} ${pathname.startsWith("/tools/quiz") ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Quiz</span>
      </Link>

      <Link
        href="/tools/tasks"
        className={`${styles.category} ${pathname.startsWith("/tools/tasks") ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Tarefas</span>
      </Link>

      <Link
        href="/tia"
        className={`${styles.category} ${pathname.startsWith("/tools") ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Flashcards</span>
      </Link>
    </div>
  );
}
