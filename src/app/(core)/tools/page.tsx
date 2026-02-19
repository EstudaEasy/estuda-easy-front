"use client";

import styles from "./styles.module.css";
import CategoryTab from "@/components/CategoryTab/categoryTab";
import ViewFlashcards from "@/components/ViewFlashcards/viewFlashcards";
import ViewQuiz from "@/components/ViewQuiz/viewQuiz";
import ViewTasks from "@/components/ViewTasks/viewTasks";
import { useState } from "react";

export default function Tools() {
  const [activeTab, setActiveTab] = useState("flashcards");

  return (
    <div className={styles.containerTools}>
      <div className={styles.containerManagement}>
        <div className={styles.Categories}>
          <CategoryTab activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <main className={styles.tools}>
          {activeTab === "quiz" && <ViewQuiz />}

          {activeTab === "tarefas" && <ViewTasks />}

          {activeTab === "flashcards" && <ViewFlashcards />}
        </main>
      </div>
    </div>
  );
}
