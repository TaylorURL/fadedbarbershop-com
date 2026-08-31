import LegalPage from '@views/LegalPage.jsx';
import { SHOP } from '@constants/shop.js';

export default function Terms() {
  return (
    <LegalPage title="Terms">
      <p>Hours, services and prices on this site are kept current but can change.</p>
      <p>
        The shop is the final word on all three. Call {SHOP.phone} if a detail matters to your
        visit.
      </p>
      <p>
        Appointments are booked and paid through TheCut, and their booking terms apply to
        cancellations, no-shows and refunds.
      </p>
      <p>
        Walk-in days are first come, first served, and a seat cannot be held ahead by phone or
        message.
      </p>
      <p>
        The {SHOP.name} name and logo belong to the shop. Everything else on the page is here to
        describe it.
      </p>
    </LegalPage>
  );
}
