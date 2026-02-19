"use client";

import styles from "./styles.module.css";
import Item from "./Item/item";
import { Button } from "@/components/base";
import { Typography } from "../base";
import { useAuth } from "@/context/auth";

export default function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.sidebarContainer}>
      <main className={styles.topContent}>
        <h1 className={styles.logoText}>EstudaEasy</h1>

        <p className={styles.line}></p>
      </main>

      <div className={styles.containerItems}>
        <div className={styles.items}>
          <Item></Item>
        </div>
      </div>

      <div className={styles.padding}>
        <Button onClick={handleLogout} variant="primary" size="full">
          <Typography variant="body-1">Sair da conta</Typography>
        </Button>
      </div>
    </div>
  );
}
