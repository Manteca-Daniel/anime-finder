import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import type { Anime } from "../types/Anime";

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Anime[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (anime: Anime) => {
    const updated = favorites.filter((fav) => fav.mal_id !== anime.mal_id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h1>⭐ Tus animes favoritos</h1>
      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tienes favoritos todavía.</p>
      ) : (
        <div className="grid fade-in">
          {favorites.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              onClick={() => {}}
              onFavorite={toggleFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
