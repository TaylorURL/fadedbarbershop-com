import { ROUTES } from '@constants/shop.js';

const SUFFIX = 'Faded Barber Shop | Liberty, TX';
export const ORIGIN = 'https://faded-barbershop.com';

export const META = {
  [ROUTES.home]: {
    title: `${SUFFIX} | Walk-Ins Welcome`,
    description:
      'Barber shop on Main Street in Liberty, Texas. Fades, beard work and straight razor shaves. Appointments Tuesday to Thursday, walk-ins Friday.',
  },
  [ROUTES.services]: {
    title: `Services | ${SUFFIX}`,
    description:
      'Fades, beard work, straight razor shaves, kids and head shaves in Liberty, Texas. Appointment pricing and what to bring before you book.',
  },
  [ROUTES.shop]: {
    title: `The Shop | ${SUFFIX}`,
    description:
      'Samantha Taylor has cut at 929 Main Street in Liberty, Texas since 2018. Straight razor work, kids cuts, and one rule posted at the door.',
  },
  [ROUTES.reviews]: {
    title: `Reviews | ${SUFFIX}`,
    description:
      'What customers write about Faded Barber Shop in Liberty, Texas, quoted as published, with links to the full set on Google.',
  },
  [ROUTES.visit]: {
    title: `Visit | ${SUFFIX}`,
    description:
      'Hours, address, phone and directions for Faded Barber Shop, 929 Main St Suite B, Liberty, TX 77575.',
  },
  [ROUTES.contact]: {
    title: `Contact | ${SUFFIX}`,
    description:
      'Phone, address, directions and booking for Faded Barber Shop, 929 Main St Suite B, Liberty, TX 77575.',
  },
  [ROUTES.privacy]: { title: `Privacy | ${SUFFIX}`, description: 'How this site handles data.' },
  [ROUTES.terms]: { title: `Terms | ${SUFFIX}`, description: 'Terms for using this site.' },
};
