"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container/container";
import { LuLayers, LuArrowLeft } from "react-icons/lu";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import styles from "./styles.module.css";
import FlashcardList from "./flashcardList";
import PageHeader from "../PageHeader";

export default function ViewFlashcards() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | number | null>(null);
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await DeckService.list();
      setDecks(response.data.decks);
    } catch (error) {
      console.error("Erro ao buscar decks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

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
    if (!deckName || !deckDescription) return;

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

      await fetchDecks();
      setIsModalOpen(false);
      setEditingDeckId(null);
      setDeckName("");
      setDeckDescription("");
    } catch (error) {
      console.error("Erro ao salvar deck:", error);
      alert("Falha ao salvar o deck. Verifique o console.");
    }
  };

  const handleDeleteDeck = async () => {
    if (editingDeckId === null) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este deck e todos os seus flashcards?",
    );
    if (!confirmDelete) return;

    try {
      await DeckService.delete(String(editingDeckId));
      await fetchDecks();
      setIsModalOpen(false);
      setEditingDeckId(null);
      setDeckName("");
      setDeckDescription("");
    } catch (error) {
      console.error("Erro ao excluir deck:", error);
      alert("Falha ao excluir o deck.");
    }
  };
  if (loading && decks.length === 0) return <p>Carregando decks...</p>;

  if (selectedDeck) {
    return (
      <div className={styles.flashcarsArea}>
        <div className={styles.headerWrapper}>
          <button onClick={() => setSelectedDeck(null)} className={styles.backButton}>
            <LuArrowLeft size={24} />
            Voltar para os Decks
          </button>
          <h2 className={styles.deckTitle}>{selectedDeck.name}</h2>
        </div>
        <FlashcardList deckId={selectedDeck.id} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Meus Decks" buttonText="Criar Deck" onButtonClick={openCreateModal} />

      <div className={styles.menuArea}>
        <div className={styles.decksContainer}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedDeck(deck);
              }}
              className={styles.deckWrapper}
            >
              <Container
                href="#"
                title={deck.name}
                icon={<LuLayers size={30} />}
                onEditClick={() => openEditModal(deck)}
              />
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>
                {editingDeckId ? "Editar Deck" : "Criar Novo Deck"}
              </h3>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Nome do Deck</label>
                <input
                  type="text"
                  placeholder="Ex: Vocabulário de Inglês"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className={styles.inputField}
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
                />
              </div>

              <div className={styles.modalActions}>
                <div>
                  {editingDeckId && (
                    <button onClick={handleDeleteDeck} className={styles.btnDelete}>
                      Excluir
                    </button>
                  )}
                </div>
                <div className={styles.modalActionsRight}>
                  <button onClick={() => setIsModalOpen(false)} className={styles.btnCancel}>
                    Cancelar
                  </button>
                  <button onClick={handleSaveDeck} className={styles.btnSubmit}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
