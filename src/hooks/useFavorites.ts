import { useEffect, useState } from "react";
import { Favorite, favoriteStorage } from "@/lib/favoriteStorage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const all = favoriteStorage.getAllFavorites();
    setFavorites(all);
    setIsLoading(false);
  }, []);

  const addFavorite = (favorite: Favorite) => {
    favoriteStorage.addFavorite(favorite);
    const updated = favoriteStorage.getAllFavorites();
    setFavorites(updated);
  };

  const removeFavorite = (id: string, tool: string) => {
    favoriteStorage.removeFavorite(id, tool);
    const updated = favoriteStorage.getAllFavorites();
    setFavorites(updated);
  };

  const isFavorite = (id: string, tool: string): boolean => {
    return favoriteStorage.isFavorite(id, tool);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, isLoading };
};
