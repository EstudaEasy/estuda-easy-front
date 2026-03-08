"use client";

import { useIMask } from "react-imask";
import styles from "@/components/FormInput/styles.module.css";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  required = false,
  placeholder = "+55 (11) 98765-4321",
  className,
}: PhoneInputProps) {
  const { ref } = useIMask<HTMLInputElement>(
    {
      mask: "+55 (00) 00000-0000",
    },
    {
      onAccept: (maskedValue) => {
        onChange?.(maskedValue);
      },
    },
  );

  return (
    <input
      ref={ref}
      type="tel"
      placeholder={placeholder}
      className={className || styles.input}
      required={required}
      defaultValue={value}
    />
  );
}
