import * as React from "react";
import { cn } from "@/lib/utils";
import { ModalHeaderProps } from "./modal.types";
import styles from "./modal.module.css";

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return <div className={cn(styles.header, className)}>{children}</div>;
};

ModalHeader.displayName = "ModalHeader";

export default ModalHeader;
