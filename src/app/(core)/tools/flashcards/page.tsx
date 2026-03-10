"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewFlashcards from "@/components/ViewFlashcards/viewFlashcards";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import styles from "@/components/ViewFlashcards/styles.module.css";

export default function Flashcards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | number | null>(null);
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");

  const openCreateModal = () => {
    setEditingDeckId(null);
    setDeckName("");
    setDeckDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (deck: Deck) => {
    setEditingDeckId(deck.id);
    setDeckName(deck.name);
    setDeckDescription(deck.description || "");
    setIsModalOpen(true);
  };

  const handleSaveDeck = async () => {
    if (!deckName || !deckDescription || isSaving || isDeleting) return;

    setIsSaving(true);
    const payload = {
      name: deckName,
      description: deckDescription,
    };

    try {
      if (editingDeckId !== null) {
        await DeckService.update(String(editingDeckId), payload);
      } else {
        await DeckService.create(payload);
      }

      setIsModalOpen(false);
      setEditingDeckId(null);
      setDeckName("");
      setDeckDescription("");

      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 400);
    } catch (error) {
      console.error("Erro ao salvar deck:", error);
      alert("Falha ao salvar o deck. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (editingDeckId === null || isSaving || isDeleting) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este deck e todos os seus flashcards?",
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await DeckService.delete(String(editingDeckId));

      setIsModalOpen(false);
      setEditingDeckId(null);
      setDeckName("");
      setDeckDescription("");

      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 400);
    } catch (error) {
      console.error("Erro ao excluir deck:", error);
      alert("Falha ao excluir o deck.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page>
      <Page.Header
        title="Flashcards"
        subtitle="Reforce seu aprendizado e memorize informações de forma eficaz com nossos flashcards interativos!"
        buttonText="Criar Deck"
        onButtonClick={openCreateModal}
      />
      <Page.Content>
        <ViewFlashcards refreshTrigger={refreshTrigger} onEditDeck={openEditModal} />
      </Page.Content>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {editingDeckId !== null ? "Editar Deck" : "Criar Novo Deck"}
            </h3>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Nome do Deck</label>
              <input
                type="text"
                placeholder="Ex: Vocabulário de Inglês"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className={styles.inputField}
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Descrição</label>
              <input
                type="text"
                placeholder="Ex: Flashcards para estudar vocabulário"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                className={styles.inputField}
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className={styles.modalActions}>
              <div>
                {editingDeckId !== null && (
                  <button
                    onClick={handleDeleteDeck}
                    className={styles.btnDelete}
                    disabled={isSaving || isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                )}
              </div>
              <div className={styles.modalActionsRight}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnCancel}
                  disabled={isSaving || isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDeck}
                  className={styles.btnSubmit}
                  disabled={isSaving || isDeleting}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
