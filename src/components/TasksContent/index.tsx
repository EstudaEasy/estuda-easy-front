"use client";

import { Typography } from "@/components/base/Typography";
import styles from "./styles.module.css";

export function TasksContent() {
  return (
    <div className={styles.container}>
      <Typography variant="heading-1" color="primary" className={styles.title}>
        Tasks
      </Typography>
      <Typography variant="body-1" color="secondary">
        Conteúdo de tarefas será implementado aqui
      </Typography>
    </div>
  );
}
