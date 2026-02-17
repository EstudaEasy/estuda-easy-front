import styles from "@/components/Button/styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function Button({ text, ...props }: ButtonProps) {
  return (
    <button {...props} className={styles.button}>
      {text}
    </button>
  );
}
