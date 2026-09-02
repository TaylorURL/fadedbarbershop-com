import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@app/App.jsx';
import './index.css';

const container = document.getElementById('root');
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The build writes every route into its own document, and a page that already
// holds its first screen is adopted rather than drawn a second time: rendering
// over it throws away the markup the reader is looking at and rebuilds it, and
// the largest paint is then charged to whenever the bundle happened to run.
//
// Adopted only where the document and the router agree on which page this is.
// A rewrite can answer one address with another's document, and the markup
// would then be the home page while the router draws the not-found one; a tree
// that has to be corrected costs more than one drawn from nothing. The dev
// server serves the shell with the static hero in it and carries no stamp,
// which is the same answer by a different road.
const path = window.location.pathname.replace(/(.)\/$/, '$1');

if (container.getAttribute('data-prerendered') === path) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
