import { createRoot } from 'react-dom/client';
import { Player } from '../src/components/Player';
import '../src/styles.css';
const root = document.getElementById('root');
if (root) createRoot(root).render(<Player />);
