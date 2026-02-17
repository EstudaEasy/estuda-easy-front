"use client";

import { useState, useEffect } from "react";
import styles from "@/components/FormInput/styles.module.css";
import Image, { StaticImageData } from "next/image";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: StaticImageData;
  onIconClick?: () => void;
}

export function Input({ icon, onIconClick, type, ...props }: InputProps) {
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    setInputType(type);
  }, [type]);

  const handleFocus = () => {
    if (type === "date") setInputType("date");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === "date" && !e.target.value) setInputType("text");
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        {...props}
        type={inputType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.input} ${type === "date" && inputType === "text" ? styles.placeholderDate : ""}`}
      />
      {icon && (
        <button type="button" className={styles.eyeIcon} onClick={onIconClick}>
          <Image src={icon} alt="icon" />
        </button>
      )}
    </div>
  );
}
