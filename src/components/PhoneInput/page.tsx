"use client";

import { useIMask } from "react-imask";
import styles from "@/components/FormInput/styles.module.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function PhoneInput({ value, onChange, required = false }: PhoneInputProps) {
  const { ref } = useIMask(
    {
      mask: "+55 (00) 00000-0000",
    },
    {
      onAccept: (value) => {
        onChange(value as string);
      },
    },
  );

  return (
    <input
      ref={ref}
      type="tel"
      placeholder="+55 (11) 98765-4321"
      className={styles.input}
      required={required}
      defaultValue={value}
    />
  );
}
