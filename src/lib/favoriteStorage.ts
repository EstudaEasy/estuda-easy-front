export interface Favorite {
  id: string;
  title: string;
  tool: "Quiz" | "Flashcards" | "Tarefas" | "Pomodoro";
  icon: "LuBrain" | "LuBookOpen" | "LuBook" | "LuClock";
  iconClass: string;
  color: string;
}

const STORAGE_KEY = "@EstudaEasy:favorites";

export const favoriteStorage = {
  addFavorite(favorite: Favorite): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const favorites: Favorite[] = stored ? JSON.parse(stored) : [];

      const exists = favorites.some((f) => f.id === favorite.id && f.tool === favorite.tool);
      if (exists) return;

      favorites.unshift(favorite);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  },

  removeFavorite(id: string, tool: string): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const favorites: Favorite[] = stored ? JSON.parse(stored) : [];
      const filtered = favorites.filter((f) => !(f.id === id && f.tool === tool));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  },

  isFavorite(id: string, tool: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const favorites: Favorite[] = stored ? JSON.parse(stored) : [];
      return favorites.some((f) => f.id === id && f.tool === tool);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      return false;
    }
  },

  getAllFavorites(): Favorite[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      return [];
    }
  },

  clearFavorites(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar favoritos:", error);
    }
  },
};
