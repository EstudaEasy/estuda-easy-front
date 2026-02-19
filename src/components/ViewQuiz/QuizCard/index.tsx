import * as React from "react";
import { LuClipboardList } from "react-icons/lu";
import { QuizCardProps } from "./quizCard.types";
import styles from "./quizCard.module.css";

const QuizCard = React.forwardRef<HTMLDivElement, QuizCardProps>(
  ({ title, questionsCount, onClick, className }, ref) => (
    <div 
      ref={ref}
      onClick={onClick}
      className={`${styles.quizCard} ${className || ''}`}
    >
      <div className={styles.cardContent}>
        <div className={styles.iconWrapper}>
          <LuClipboardList />
        </div>
        
        <div className={styles.textContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>
            {questionsCount} {questionsCount === 1 ? 'questão' : 'questões'}
          </div>
        </div>
      </div>
    </div>
  ),
);

QuizCard.displayName = "QuizCard";

export default QuizCard;
