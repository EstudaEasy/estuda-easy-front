"use client";

import styles from "./styles.module.css";
import Container from "@/components/Container/container";
import { LuGlobe } from "react-icons/lu";
import CategoryTab from "@/components/CategoryTab/categoryTab";

export default function Tools() {
  return (
    <div>
      <div className={styles.containerManagement}>
        <div className={styles.Categories}>
          <CategoryTab></CategoryTab>
        </div>
        <main className={styles.tools}>
          <Container href="/home" title="Geografia" icon={<LuGlobe size={30} />} />
          <Container href="/home" title="Geografia" icon={<LuGlobe size={30} />} />
          <Container href="/home" title="Geografia" icon={<LuGlobe size={30} />} />
        </main>
      </div>
    </div>
  );
}
