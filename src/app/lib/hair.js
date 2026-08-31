// One strand model, two sources: the blade line on a route change and the
// pointer as it moves. Realism comes from four things and no more - a tapered
// curve rather than a line, a lit edge, colour variance across a head, and a
// blurred near layer for depth.
const TONES = [
  [26, 21, 18],
  [38, 30, 25],
  [52, 41, 33],
  [70, 57, 45],
  [96, 84, 72],
  [140, 132, 124],
];

export function makeStrand(x, y, scale, now) {
  const len = (9 + Math.random() * 40) * scale;
  return {
    x,
    y,
    len,
    w: (0.6 + Math.random() * 1.3) * scale,
    bow: (Math.random() - 0.5) * len * 0.9,
    rot: Math.random() * Math.PI,
    rotV: (Math.random() - 0.5) * 0.05,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.35 - Math.random() * 0.8,
    flutterPhase: Math.random() * Math.PI * 2,
    flutterRate: 0.004 + Math.random() * 0.005,
    flutterAmp: 0.2 + Math.random() * 0.6,
    tone: TONES[Math.floor(Math.random() * TONES.length)],
    gloss: 0.2 + Math.random() * 0.35,
    born: now,
  };
}

export function stepStrand(s, dt) {
  s.vy += 0.011 * (dt / 16);
  s.flutterPhase += s.flutterRate * dt;
  s.x += (s.vx + Math.sin(s.flutterPhase) * s.flutterAmp) * (dt / 16);
  s.y += s.vy * (dt / 16);
  s.rot += s.rotV * (dt / 16);
}

export function drawStrand(ctx, s, age, life) {
  const fade = age > life * 0.7 ? 1 - (age - life * 0.7) / (life * 0.3) : 1;
  if (fade <= 0) return;

  const [r, g, b] = s.tone;
  const cos = Math.cos(s.rot);
  const sin = Math.sin(s.rot);
  const tipX = s.x + cos * s.len;
  const tipY = s.y + sin * s.len;
  const cx = s.x + cos * s.len * 0.5 - sin * s.bow;
  const cy = s.y + sin * s.len * 0.5 + cos * s.bow;

  const point = (t) => {
    const u = 1 - t;
    return [
      u * u * s.x + 2 * u * t * cx + t * t * tipX,
      u * u * s.y + 2 * u * t * cy + t * t * tipY,
    ];
  };

  const STEPS = 7;
  ctx.lineCap = 'round';
  for (let i = 0; i < STEPS; i += 1) {
    const t0 = i / STEPS;
    const [x0, y0] = point(t0);
    const [x1, y1] = point((i + 1) / STEPS);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = s.w * (1 - t0 * 0.78);
    ctx.strokeStyle = `rgba(${r},${g},${b},${(0.9 - t0 * 0.25) * fade})`;
    ctx.stroke();
  }

  const [hx0, hy0] = point(0.22);
  const [hx1, hy1] = point(0.62);
  ctx.beginPath();
  ctx.moveTo(hx0 - sin * s.w * 0.3, hy0 + cos * s.w * 0.3);
  ctx.lineTo(hx1 - sin * s.w * 0.3, hy1 + cos * s.w * 0.3);
  ctx.lineWidth = Math.max(0.35, s.w * 0.3);
  ctx.strokeStyle = `rgba(232,225,213,${s.gloss * fade * 0.5})`;
  ctx.stroke();
}
