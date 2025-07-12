import { useEffect, useState } from "react";
import type { Anime } from "../types/Anime";

const MAX_HINTS = 6;

const hintOrder = [
    "type",
    "year",
    "episodes",
    "score",
    "status",
    "synopsis",
] as const;

function SecretGame() {
    const [anime, setAnime] = useState<Anime | null>(null);
    const [hintsShown, setHintsShown] = useState<number>(1);
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchRandomAnime = async () => {
        setLoading(true);
        setFeedback("");
        setGuess("");
        setHintsShown(1);
        try {
            const randomPage = Math.floor(Math.random() * 50) + 1;
            const res = await fetch(`https://api.jikan.moe/v4/anime?page=${randomPage}`);
            const data = await res.json();
            const animes: Anime[] = data.data.filter((a: Anime) => a.title && a.synopsis && !a.title.includes("Hentai"));
            const randomAnime = animes[Math.floor(Math.random() * animes.length)];
            setAnime(randomAnime);
        } catch (e) {
            setFeedback("Error al obtener el anime.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomAnime();
    }, []);

    const checkGuess = () => {
        if (!anime) return;
        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedTitle = anime.title.toLowerCase();
        const synonyms = anime.title_synonyms?.map((t) => t.toLowerCase()) || [];
        const altTitle = anime.title_english?.toLowerCase() || "";

        if (
            normalizedTitle === normalizedGuess ||
            altTitle === normalizedGuess ||
            synonyms.includes(normalizedGuess)
        ) {
            setFeedback("🎉 ¡Correcto!");
            setScore((prev) => prev + 1);
            setTimeout(fetchRandomAnime, 1500);
        } else {
            if (hintsShown < MAX_HINTS) {
                setHintsShown((prev) => prev + 1);
                setFeedback("❌ Incorrecto. Te damos otra pista...");
            } else {
                setFeedback(`❌ No era correcto. Era: ${anime.title}`);
                setTimeout(fetchRandomAnime, 3000);
            }
        }

        setGuess("");
    };

    const renderHints = () => {
        if (!anime) return null;

        const hintMap: Record<typeof hintOrder[number], string> = {
            type: `Tipo: ${anime.type || "?"}`,
            year: `Año: ${anime.year || "?"}`,
            episodes: `Episodios: ${anime.episodes || "?"}`,
            score: `Puntuación: ${anime.score || "?"}`,
            status: `Estado: ${anime.status || "?"}`,
            synopsis: `Sinopsis: ${anime.synopsis || "?"}`,
        };

        return hintOrder.slice(0, hintsShown).map((hintKey) => (
            <li key={hintKey} style={{ marginBottom: "0.5rem" }}>
                {hintMap[hintKey]}
            </li>
        ));
    };

    return (
        <div className="game-container">
            <h2>🕵️ Adivina el anime</h2>
            <p style={{ marginBottom: "1rem" }}>
                Se irán mostrando pistas. Intenta adivinar el anime lo antes posible.
            </p>

            <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: "500px" }}>
                {renderHints()}
            </ul>

            <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Escribe el nombre del anime"
                onKeyDown={(e) => e.key === "Enter" && checkGuess()}
            />
            <br />
            <button onClick={checkGuess} disabled={loading || !anime}>
                Adivinar
            </button>

            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{feedback}</p>
            <p>Puntuación actual: {score}</p>
        </div>
    );
}

export default SecretGame;
