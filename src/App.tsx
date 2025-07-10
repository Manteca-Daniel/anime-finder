import { useEffect, useRef, useState } from "react";
import AnimeCard from "./components/AnimeCard";
import AnimeModal from "./components/AnimeModal";
import type { Anime } from "./types/Anime";
import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<Anime[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [selected, setSelected] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchAnime = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
      );
      const data = await res.json();
      if (!data.data || data.data.length === 0) {
        setError("No se encontraron animes.");
        setAnimes([]);
        setTotalPages(1);
      } else {
        setAnimes(data.data);
        setTotalPages(data.pagination?.last_visible_page || 1);
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setError("Error al buscar.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (anime: Anime) => {
    const exists = favorites.find((fav) => fav.mal_id === anime.mal_id);
    const updated = exists
      ? favorites.filter((fav) => fav.mal_id !== anime.mal_id)
      : [...favorites, anime];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const exportImage = () => {
    import("html2canvas").then((html2canvas) => {
      document.body.classList.add("export-mode");

      setTimeout(() => {
        if (resultsRef.current) {
          html2canvas.default(resultsRef.current, {
            useCORS: true,
            scale: 2,
          }).then((canvas) => {
            const link = document.createElement("a");
            link.download = "animes.png";
            link.href = canvas.toDataURL();
            link.click();
            document.body.classList.remove("export-mode");
          });
        }
      }, 1000);
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const filteredResults = animes.filter((anime) =>
    typeFilter ? anime.type === typeFilter : true
  );

  return (
    <div className="container">
      <h1>🎌 AnimeFinder Deluxe</h1>
      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchAnime()}
          placeholder="Buscar anime..."
        />
        <button onClick={fetchAnime}>Buscar</button>
        <button onClick={exportImage}>📸 Exportar imagen</button>
      </div>

      <div className="filters">
        <label>Filtrar por tipo:</label>
        <select
          onChange={(e) => setTypeFilter(e.target.value)}
          value={typeFilter}
        >
          <option value="">Todos</option>
          <option value="TV">TV</option>
          <option value="Movie">Película</option>
          <option value="OVA">OVA</option>
        </select>
      </div>

      {loading && <p style={{ textAlign: "center" }}>⏳ Cargando...</p>}
      {error && <p style={{ textAlign: "center", color: "crimson" }}>{error}</p>}

      <p style={{ textAlign: "center" }}>
        Resultados: <strong>{filteredResults.length}</strong> | Favoritos:{" "}
        <strong>{favorites.length}</strong>
      </p>

      {favorites.length > 0 && (
        <>
          <h2>⭐ Tus favoritos</h2>
          <div className="grid fade-in">
            {favorites.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                onClick={setSelected}
                onFavorite={toggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        </>
      )}

      <div ref={resultsRef} className="grid fade-in">
        {filteredResults.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            anime={anime}
            onClick={setSelected}
            onFavorite={toggleFavorite}
            isFavorite={favorites.some((f) => f.mal_id === anime.mal_id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      <AnimeModal anime={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default App;
