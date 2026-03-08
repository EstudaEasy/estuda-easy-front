"use client";

import styles from "./styles.module.css";
interface CategoryTabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CategoryTab({ activeTab, setActiveTab }: CategoryTabProps) {
  return (
    <div className={styles.categories}>
      <button
        onClick={() => setActiveTab("quiz")}
        className={`${styles.category} ${activeTab === "quiz" ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Quiz</span>
      </button>

      <button
        onClick={() => setActiveTab("tarefas")}
        className={`${styles.category} ${activeTab === "tarefas" ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Tarefas</span>
      </button>

      <button
        onClick={() => setActiveTab("flashcards")}
        className={`${styles.category} ${activeTab === "flashcards" ? styles.active : ""}`}
      >
        <span className={styles.titleCategory}>Flashcards</span>
      </button>
    </div>
  );
}
