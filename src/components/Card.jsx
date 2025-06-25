import '../styles/Card.css';

export default function Card({ src, title, artist, date }) {
    return (
        <div className="card" style={{ backgroundImage: `url(${src})` }}>
            <h3>{title}</h3>
            <p>{artist || 'Unknown artist'}</p>
            <p>{date}</p>
        </div>
    );
}
