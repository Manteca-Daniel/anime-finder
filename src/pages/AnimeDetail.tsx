import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Anime } from "../types/Anime";
import "../index.css";

function AnimeDetail() {
    const { id } = useParams<{ id: string }>();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<string[]>([]);

    useEffect(() => {
        const fetchAnime = async () => {
            const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const data = await res.json();
            setAnime(data.data);
            setLoading(false);

            // Cargar comentarios desde localStorage
            const saved = localStorage.getItem(`comments-${id}`);
            if (saved) {
                setComments(JSON.parse(saved));
            }
        };

        fetchAnime();
    }, [id]);

    const addComment = () => {
        if (!comment.trim()) return;
        const updated = [...comments, comment.trim()];
        setComments(updated);
        localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
        setComment("");
    };

    if (loading || !anime) return <p className="center">⏳ Cargando...</p>;

    return (
        <div className="anime-detail">
            <h2>{anime.title}</h2>
            <img src={anime.images.jpg.image_url} alt={anime.title} />
            <p>{anime.synopsis}</p>
            <p><strong>Tipo:</strong> {anime.type}</p>
            <p><strong>Episodios:</strong> {anime.episodes}</p>
            <p><strong>Año:</strong> {anime.year}</p>
            <p><strong>Estado:</strong> {anime.status}</p>
            <p><strong>Score:</strong> {anime.score}</p>

            <hr />

            <h3>📝 Comentarios</h3>
            <div className="comment-form">
                <textarea
                    placeholder="Escribe tu comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={addComment}>Enviar</button>
            </div>

            {comments.length > 0 ? (
                <ul className="comment-list">
                    {comments.map((c, i) => (
                        <li key={i}>{c}</li>
                    ))}
                </ul>
            ) : (
                <p>Aún no hay comentarios.</p>
            )}
        </div>
    );
}

export default AnimeDetail;
