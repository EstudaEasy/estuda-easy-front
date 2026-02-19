import * as React from "react";
import { cn } from "@/lib/utils";
import { ModalBodyProps } from "./modal.types";
import styles from "./modal.module.css";

const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return <div className={cn(styles.body, className)}>{children}</div>;
};

ModalBody.displayName = "ModalBody";

export default ModalBody;
