import { useState, useEffect } from 'react';
import Card from './Card';
import { RetryIcon, NewDeckIcon } from './Icons';
import '../styles/Game.css';

async function fetchRandomArtworks(count = 12) {
    const startTime = performance.now();

    try {
        const pageRanges = [
            Math.floor(Math.random() * 300) + 1,
            Math.floor(Math.random() * 300) + 301,
            Math.floor(Math.random() * 300) + 601,
            Math.floor(Math.random() * 300) + 901,
        ];

        const promises = pageRanges.map((page) => {
            return fetch(
                `https://api.artic.edu/api/v1/artworks?page=${page}&limit=100&fields=id,title,artist_title,date_display,image_id`
            )
                .then((res) => (res.ok ? res.json() : { data: [] }))
                .then((data) =>
                    data.data.filter(
                        //Archival collection id is filtered
                        (art) => art && art.image_id && art.image_id !== '342b2214-04d5-de63-b577-55a08a618960'
                    )
                )
                .catch(() => []);
        });

        const results = await Promise.all(promises);
        const allArtworks = results.flat();

        const shuffled = shuffle(allArtworks);
        const finalArtworks = shuffled.slice(0, count);

        const endTime = performance.now();
        console.log(`Fetched ${finalArtworks.length} artworks in ${endTime - startTime} milliseconds`);

        return finalArtworks;
    } catch (error) {
        console.error('Fetch failed:', error);
        const endTime = performance.now();
        console.log(`Failed after ${endTime - startTime} milliseconds`);
        return [];
    }
}

function shuffle(array) {
    const newArray = array.slice();
    let currentIndex = newArray.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

export default function Game() {
    const [loading, setLoading] = useState(true);
    const [artworks, setArtworks] = useState([]);
    const [picked, setPicked] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState('active');

    useEffect(() => {
        let ignore = false;

        fetchRandomArtworks()
            .then((artworks) => {
                if (!ignore) {
                    setArtworks(artworks);
                }
            })
            .catch((err) => console.error('Failed to fetch artworks:', err))
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    function pickCard(id) {
        if (picked.includes(id)) {
            setGameState('lose');
        } else {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore > highScore) setHighScore(newScore);
            if (newScore === artworks.length) setGameState('win');
            setPicked([...picked, id]);
            setArtworks(shuffle(artworks));
        }
    }

    function reset() {
        setArtworks(shuffle(artworks));
        setPicked([]);
        setScore(0);
        setGameState('active');
    }

    async function newDeck() {
        setLoading(true);
        try {
            const newArtworks = await fetchRandomArtworks();
            setArtworks(newArtworks);
            setPicked([]);
            setScore(0);
            setGameState('active');
        } catch (err) {
            console.error('Failed to fetch new artworks:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return (
            <div className="loading">
                <div className="loading-content">
                    <span className="loader"></span>
                    <p>Loading artwork...</p>
                </div>
            </div>
        );

    return (
        <>
            {gameState === 'lose' && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Game Over</h2>
                        <p>Your score: {score}</p>
                        <button onClick={reset}>
                            <RetryIcon />
                            <span>Retry</span>
                        </button>
                        <button onClick={newDeck}>
                            <NewDeckIcon />
                            <span>New Deck</span>
                        </button>
                    </div>
                </div>
            )}
            {gameState === 'win' && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>You won</h2>
                        <p>Your score: {score}</p>
                        <button onClick={reset}>
                            <RetryIcon />
                            <span>Retry</span>
                        </button>
                        <button onClick={newDeck}>
                            <NewDeckIcon />
                            <span>New Deck</span>
                        </button>
                    </div>
                </div>
            )}
            <div className="game">
                {artworks.map((art) => (
                    <Card
                        key={art.id}
                        id={art.id}
                        handleClick={() => pickCard(art.id)}
                        src={`https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`}
                        title={art.title}
                        artist={art.artist_title}
                        date={art.date_display}
                    />
                ))}
            </div>
            <section className="score">
                <span>Current Score: {score}</span>
                <span>High Score: {highScore}</span>
                <button onClick={reset}>
                    <RetryIcon />
                    <span>Retry</span>
                </button>
                <button onClick={newDeck}>
                    <NewDeckIcon />
                    <span>New Deck</span>
                </button>
            </section>
        </>
    );
}
