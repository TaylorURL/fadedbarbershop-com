import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import App from '@app/App.jsx';
import { ROUTE_TABLE } from '@app/routeTable.js';
import { META, ORIGIN } from '@constants/meta.js';

export { META, ORIGIN };

// Resolved rather than lazy: a prerendered page must hold its own markup. Kept
// out of module scope because a top-level await leaves the SSR bundle unsettled.
let routes = null;

export async function prepare() {
  routes = await Promise.all(
    ROUTE_TABLE.map(async (r) => ({ path: r.path, Component: (await r.load()).default })),
  );
}

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App routes={routes} />
    </StaticRouter>,
  );
}
