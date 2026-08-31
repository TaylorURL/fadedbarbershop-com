import { useEffect, useState } from 'react';
import { HOURS } from '@constants/shop.js';

// The shop is in Texas and the visitor may not be, so the status is read in the
// shop's zone rather than the browser's.
const TZ = 'America/Chicago';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatTime(minutes) {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function shopClock() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return {
    day: Math.max(0, DAYS.indexOf(p.weekday)),
    minutes: (Number(p.hour) % 24) * 60 + Number(p.minute),
  };
}

function read() {
  const { day, minutes } = shopClock();
  const today = HOURS[day];
  const open = Boolean(today.open !== null && minutes >= today.open && minutes < today.close);

  if (open) {
    return {
      day,
      open: true,
      mode: today.mode,
      headline: today.mode === 'walk-in' ? 'Open, walk-ins' : 'Open, by appointment',
      detail: `Until ${formatTime(today.close)}`,
    };
  }

  if (today.open !== null && minutes < today.open) {
    return {
      day,
      open: false,
      mode: today.mode,
      headline: 'Opens today',
      detail: formatTime(today.open),
    };
  }

  for (let step = 1; step <= 7; step += 1) {
    const next = HOURS[(day + step) % 7];
    if (next.open !== null) {
      return {
        day,
        open: false,
        mode: next.mode,
        headline: 'Closed',
        detail: `${step === 1 ? 'Opens tomorrow' : `Opens ${next.day}`} ${formatTime(next.open)}`,
      };
    }
  }
  return { day, open: false, mode: null, headline: 'Closed', detail: '' };
}

const PENDING = { day: -1, open: false, mode: null, headline: 'Hours', detail: '' };

export default function useTodayStatus() {
  const [status, setStatus] = useState(PENDING);
  useEffect(() => {
    setStatus(read());
    const id = setInterval(() => setStatus(read()), 30000);
    return () => clearInterval(id);
  }, []);
  return status;
}
