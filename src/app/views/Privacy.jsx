import LegalPage from '@views/LegalPage.jsx';
import { SHOP } from '@constants/shop.js';

export default function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>
        This site does not ask for your name, email address or phone number, and it sets no
        advertising or tracking cookies.
      </p>
      <p>
        Booking is handled by TheCut, on their own site. Anything you enter there is covered by
        their privacy policy, not this one.
      </p>
      <p>
        The site is served by Vercel, which keeps standard request logs including IP address and
        browser type for security and reliability.
      </p>
      <p>Those logs are not used to build a profile of you.</p>
      <p>
        Questions about any of this can go to {SHOP.phone} or to the shop at {SHOP.street},{' '}
        {SHOP.city}, {SHOP.region} {SHOP.postal}.
      </p>
    </LegalPage>
  );
}
