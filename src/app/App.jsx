import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@constants/shop.js';
import { ROUTE_TABLE } from '@app/routeTable.js';
import FadeField from '@components/effects/FadeField.jsx';
import Grain from '@components/effects/Grain.jsx';
import HairLayer from '@components/effects/HairLayer.jsx';
import RazorPointer from '@components/effects/RazorPointer.jsx';
import RouteChange from '@components/layout/RouteChange.jsx';
import Nav from '@components/layout/Nav.jsx';
import Dock from '@components/layout/Dock.jsx';
import Footer from '@components/layout/Footer.jsx';
import SplitRail from '@taylorurl/split-rail';
import RouteFallback from '@components/layout/RouteFallback.jsx';
import RouteBoundary from '@components/layout/RouteBoundary.jsx';
import { loadChunk } from '@app/lib/chunk.js';
import Home from '@views/Home.jsx';

// The home page ships in the first bundle because it is the page almost everyone
// lands on. The rest arrive on request, through the wrapper that has somewhere
// to go when one of them does not.
const LAZY = ROUTE_TABLE.map((r) => ({
  path: r.path,
  Component: lazy(() => loadChunk(r.load)),
}));

export default function App({ routes = LAZY }) {
  return (
    <>
      <a
        href="#main"
        className="spec sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bone-50 focus:px-4 focus:py-2 focus:text-[11px] focus:text-pitch-900"
      >
        Skip To Content
      </a>

      <FadeField />
      <Grain />
      <HairLayer />
      <RazorPointer />
      <RouteChange />
      <Nav />

      <RouteBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </RouteBoundary>

      <Footer>
        <SplitRail version={__BUILD_VERSION__} />
      </Footer>
      <div className="h-[68px] lg:hidden" />
      <Dock />
    </>
  );
}
