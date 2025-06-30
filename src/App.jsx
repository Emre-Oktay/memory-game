import Game from './components/Game';
import './styles/App.css';

function App() {
    return (
        <>
            <header>
                <h1>Memory Game</h1>
            </header>
            <main>
                <Game />
            </main>
            <footer>
                <p>
                    Made using <a href="https://api.artic.edu"> The Art Institute of Chicago API </a>
                </p>
            </footer>
        </>
    );
}

export default App;
