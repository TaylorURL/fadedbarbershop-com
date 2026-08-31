import { ROUTES } from '@constants/shop.js';

// One table, two consumers: the client wraps each loader in lazy() so a route
// arrives on request, and the server build awaits them so prerendered HTML holds
// the real page rather than a placeholder.
export const ROUTE_TABLE = [
  { path: ROUTES.services, load: () => import('@views/Services.jsx') },
  { path: ROUTES.shop, load: () => import('@views/Shop.jsx') },
  { path: ROUTES.reviews, load: () => import('@views/Reviews.jsx') },
  { path: ROUTES.visit, load: () => import('@views/Visit.jsx') },
  { path: ROUTES.contact, load: () => import('@views/Contact.jsx') },
  { path: ROUTES.privacy, load: () => import('@views/Privacy.jsx') },
  { path: ROUTES.terms, load: () => import('@views/Terms.jsx') },
  { path: '*', load: () => import('@views/NotFound.jsx') },
];
