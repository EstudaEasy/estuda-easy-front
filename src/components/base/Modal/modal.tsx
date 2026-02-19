"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { ModalProps } from "./modal.types";
import styles from "./modal.module.css";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalSizeClass = {
    sm: styles.modalSm,
    md: styles.modalMd,
    lg: styles.modalLg,
    xl: styles.modalXl,
    full: styles.modalFull,
  }[size];

  const modalContent = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={cn(styles.modal, modalSizeClass, className)}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <button onClick={onClose} className={styles.closeButton} aria-label="Fechar">
                <LuX size={20} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.displayName = "Modal";

export default Modal;
