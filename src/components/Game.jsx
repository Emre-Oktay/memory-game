import { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/Game.css';

export default function Game() {
    const [loading, setLoading] = useState(true);
    const [artworks, setArtworks] = useState([]);

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

    useEffect(() => {
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
                        .then((data) => data.data.filter((art) => art && art.image_id))
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

        fetchRandomArtworks()
            .then(setArtworks)
            .catch((err) => console.error('Failed to fetch artworks:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading artwork...</div>;

    return (
        <div className="game">
            {artworks.map((art) => (
                <Card
                    key={art.id}
                    src={`https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`}
                    title={art.title}
                    artist={art.artist_title}
                    date={art.date_display}
                />
            ))}
        </div>
    );
}
