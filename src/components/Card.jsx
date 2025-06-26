import '../styles/Card.css';
import openInNewIcon from '../assets/open-in-new.svg';

export default function Card({ id, src, handleClick, title, artist, date }) {
    function truncate(str, maxlength) {
        return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str;
    }

    function handleLinkClick(e) {
        e.stopPropagation();
    }

    return (
        <div className="card" style={{ backgroundImage: `url(${src})` }} onClick={handleClick}>
            <div className="card-overlay">
                <div>
                    <h3>{truncate(title, 20)}</h3>
                    <p>{artist || 'Unknown artist'}</p>
                    <p>{truncate(date, 30)}</p>
                </div>

                <a href={`https://www.artic.edu/artworks/${id}/`} target="_blank" onClick={handleLinkClick}>
                    <img src={openInNewIcon} className="icon" />
                </a>
            </div>
        </div>
    );
}
