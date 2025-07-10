import type { Anime } from "../types/Anime";

interface Props {
  anime: Anime | null;
  onClose: () => void;
}

function AnimeModal({ anime, onClose }: Props) {
  if (!anime) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">✖</button>
        <h2>{anime.title}</h2>
        <img src={anime.images.jpg.image_url} alt={anime.title} />
        <p><strong>Score:</strong> {anime.score ?? "?"}</p>
        <p><strong>Episodes:</strong> {anime.episodes ?? "?"}</p>
        <p><strong>Status:</strong> {anime.status}</p>
        <p><strong>Type:</strong> {anime.type}</p>
        <p><strong>Year:</strong> {anime.year ?? "?"}</p>
        <p>{anime.synopsis}</p>
        <a href={anime.url} target="_blank" rel="noreferrer">Ver en MyAnimeList</a>
      </div>
    </div>
  );
}

export default AnimeModal;
