"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewFlashcards from "@/components/ViewFlashcards/viewFlashcards";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";

export default function Flashcards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | number | null>(null);
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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

    setIsDeleting(true);
    try {
      await DeckService.delete(String(editingDeckId));

      setIsModalOpen(false);
      setIsConfirmingDelete(false);
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
        <ViewFlashcards
          refreshTrigger={refreshTrigger}
          onEditDeck={openEditModal}
          onDeleteDeck={(deck) => {
            setEditingDeckId(deck.id);
            setIsConfirmingDelete(true);
          }}
        />
      </Page.Content>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white p-7 rounded-2xl w-[90%] max-w-[500px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 className="text-[22px] font-bold text-slate-800 mb-6 text-center">
              {editingDeckId !== null ? "Editar Deck" : "Criar Novo Deck"}
            </h3>

            <div className="flex flex-col mb-4 w-full">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">
                Nome do Deck
              </label>
              <input
                type="text"
                placeholder="Ex: Vocabulário de Inglês"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="w-full p-3.5 border border-slate-300 rounded-lg text-base text-slate-900 bg-white outline-none transition-colors duration-200 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className="flex flex-col mb-6 w-full">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">
                Descrição
              </label>
              <input
                type="text"
                placeholder="Ex: Flashcards para estudar vocabulário"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                className="w-full p-3.5 border border-slate-300 rounded-lg text-base text-slate-900 bg-white outline-none transition-colors duration-200 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className="flex justify-between items-center mt-2.5">
              <div>
                {editingDeckId !== null && (
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="bg-transparent text-red-500 border border-red-500 px-5 py-3 rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:not(:disabled):bg-red-500 hover:not(:disabled):text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving || isDeleting}
                  >
                    Excluir
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-slate-500 border-none px-5 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:not(:disabled):bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving || isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDeck}
                  className="bg-blue-500 text-white border-none px-5 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:not(:disabled):bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={isSaving || isDeleting}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Deletar Deck */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001]">
          <div className="bg-white p-7 rounded-2xl w-[90%] max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 className="text-[20px] font-bold text-slate-800 mb-3 text-center">Excluir Deck?</h3>
            <p className="text-base text-slate-600 mb-6 text-center">
              Tem certeza que deseja excluir este deck e todos os seus flashcards? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="bg-slate-100 text-slate-500 border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDeck}
                className="bg-red-500 text-white border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
