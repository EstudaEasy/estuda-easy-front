import * as React from "react";
import { cn } from "@/lib/utils";
import { ModalFooterProps } from "./modal.types";
import styles from "./modal.module.css";

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return <div className={cn(styles.footer, className)}>{children}</div>;
};

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
