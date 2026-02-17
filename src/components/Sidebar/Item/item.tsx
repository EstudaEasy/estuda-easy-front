"use client";

import styles from "./styles.module.css";

import { LuHouse, LuLayoutGrid, LuSparkles, LuUsers, LuUser } from "react-icons/lu";
export default function Item() {
  return (
    <div className={styles.items}>
      <div className={styles.item}>
        <LuHouse />
        <span>Início</span>
      </div>

      <div className={styles.item}>
        <LuLayoutGrid />
        <span>Ferramentas</span>
      </div>

      <div className={styles.item}>
        <LuSparkles />
        <span>TIA</span>
      </div>

      <div className={styles.item}>
        <LuUsers />
        <span>Grupos</span>
      </div>

      <div className={styles.item}>
        <LuUser />
        <span>Perfil</span>
      </div>
    </div>
  );
}
