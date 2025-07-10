import type { Anime } from "../types/Anime";

interface Props {
    anime: Anime;
    onClick: (anime: Anime) => void;
    onFavorite: (anime: Anime) => void;
    isFavorite: boolean;
}

function AnimeCard({ anime, onClick, onFavorite, isFavorite }: Props) {
    return (
        <div className="card">
            <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="anime-img"
                onClick={() => onClick(anime)}
                style={{ cursor: "pointer" }}
                crossOrigin="anonymous"
            />
            <div className="card-content">
                <h2>{anime.title}</h2>
                <p>{anime.synopsis?.slice(0, 100)}...</p>
                <button onClick={() => onFavorite(anime)}>
                    {isFavorite ? "❤️ Quitar" : "🤍 Favorito"}
                </button>
            </div>
        </div>
    );
}

export default AnimeCard;