"use client";

import { Typography } from "@/components/base/Typography";
import styles from "./styles.module.css";

export function FlashcardsContent() {
  return (
    <div className={styles.container}>
      <Typography variant="heading-1" color="primary" className={styles.title}>
        Flashcards
      </Typography>
      <Typography variant="body-1" color="secondary">
        Conteúdo de flashcards será implementado aqui
      </Typography>
    </div>
  );
}
