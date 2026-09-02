import { useEffect, useRef } from 'react';
import { field } from '@app/lib/field.js';
import drawsInSoftware from '@app/lib/gpu.js';

// Resolution of the interactive shave buffer. Coarse on purpose: it is sampled
// with bilinear filtering, so a low grid reads as a soft clipper path and costs
// a few kilobytes to upload each frame.
const SHAVE_W = 128;
const SHAVE_H = 72;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uGuard;
uniform float uTime;
uniform float uVel;
uniform float uWipe;
uniform float uBurst;
uniform vec4 uMark;
uniform float uMarkOn;
uniform sampler2D uMaskTex;
uniform sampler2D uShaveTex;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm4(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return s;
}

float fbm2(vec2 p) {
  return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.03);
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;

  // The guard also shortens down the screen, so a gradient is visible in one
  // frame instead of only across a scroll.
  float g = clamp(uGuard + uv.y * 0.5 - 0.25, 0.0, 1.0);

  // The mark is shaved out of the field rather than drawn into it.
  float mask = 0.0;
  if (uMarkOn > 0.5) {
    vec2 su = (uv - uMark.xy) / uMark.zw * 0.5 + 0.5;
    if (su.x > 0.0 && su.x < 1.0 && su.y > 0.0 && su.y < 1.0) {
      mask = texture2D(uMaskTex, vec2(su.x, 1.0 - su.y)).a;
    }
  }
  g *= 1.0 - mask * 0.92;

  // Wherever the pointer has passed, the field is cut and grows back.
  float shave = texture2D(uShaveTex, uv).r;
  g *= 1.0 - shave * 0.95;

  // A pass of the clippers on route change.
  float wy = 1.25 - uWipe * 1.5;
  float wd = abs(uv.y - wy);
  float wband = smoothstep(0.20, 0.0, wd) * step(0.001, uWipe);
  g *= 1.0 - wband * 0.92;

  // Strand geometry is fixed. Nothing about the field's coordinates depends on
  // the scroll, because changing a noise frequency while the page moves stretches
  // the whole texture, which is what reads as warping. The guard changes only how
  // far down each strand is still standing.
  float lock = vnoise(vec2(uv.x * 22.0, 7.3));
  float ge = clamp(g * mix(0.55, 1.0, lock), 0.0, 1.0);

  vec2 q = vec2(uv.x * 540.0, uv.y * 150.0);
  q.x += fbm2(vec2(uv.x * 5.0, uv.y * 2.2)) * 2.4;

  float presence = smoothstep(0.50, 0.66, fbm4(q));

  // One strand per vertical cell, cut off partway down it.
  float column = floor(uv.x * 540.0);
  float cell = fract(uv.y * 150.0 + hash(vec2(column, 3.0)));
  float cut = mix(0.12, 0.94, ge);
  float lenMask = smoothstep(cut + 0.07, cut, cell);

  float strand = presence * lenMask;

  // Skin needs grit rather than strands, or the short end reads as flat noise.
  float grit = smoothstep(0.66, 0.84, vnoise(uv * 820.0));
  strand = max(strand, grit * mix(0.26, 0.0, g));

  float ink = strand * mix(0.10, 0.155, ge) * mix(0.8, 1.2, lock);

  // The clipper pass: a steel glint that only appears while the page is moving.
  float t = (uv.y - 0.5 - uVel * 1.2) * 7.0;
  float glint = exp(-t * t) * abs(uVel);
  ink += glint * 0.85 * strand;

  vec3 base = vec3(0.043, 0.039, 0.035);
  vec3 hair = mix(vec3(0.60, 0.56, 0.51), vec3(0.98, 0.98, 0.96), glint);
  vec3 col = base + hair * ink;
  col += vec3(0.66, 0.22, 0.12) * strand * ge * 0.055;

  // A soft lift behind the mark so it sits on something rather than floating.
  vec2 rp = (uv - uMark.xy) * vec2(aspect, 1.0);
  float halo = smoothstep(0.52, 0.04, length(rp)) * uBurst;
  col += vec3(0.30, 0.27, 0.24) * halo * 0.09;

  // Freshly cut edges catch the light, which is what makes the shave read as a
  // blade rather than an eraser.
  float sl = texture2D(uShaveTex, uv - vec2(1.4 / ${SHAVE_W}.0, 0.0)).r;
  float sr = texture2D(uShaveTex, uv + vec2(1.4 / ${SHAVE_W}.0, 0.0)).r;
  float sd = texture2D(uShaveTex, uv - vec2(0.0, 1.4 / ${SHAVE_H}.0)).r;
  float su2 = texture2D(uShaveTex, uv + vec2(0.0, 1.4 / ${SHAVE_H}.0)).r;
  float edge = abs(sr - sl) + abs(su2 - sd);
  col += vec3(0.80, 0.83, 0.88) * edge * 0.42;

  // The blade itself on a route change.
  col += vec3(0.90, 0.92, 0.95) * smoothstep(0.010, 0.0, wd) * step(0.001, uWipe) * 0.85;

  float vig = smoothstep(1.15, 0.20, length((uv - 0.5) * vec2(aspect, 1.0)));
  col *= 0.40 + 0.60 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || 'shader compile failed');
  }
  return sh;
}

export default function FadeField({ markSelector = '[data-fade-mark]' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Without a GPU every frame of the field is drawn in software, on the
    // thread the page needs for everything else, and a frame then costs more
    // than the page paints in the same time - including the first one, which
    // the whole document is waiting behind. Such a machine keeps the flat
    // background, which is the tier a machine with no WebGL already gets, so
    // neither the context nor the program is ever built.
    if (drawsInSoftware()) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
    // Without WebGL the page keeps its flat background, which is the low tier.
    if (!gl) return;

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link failed');
    } catch {
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    for (const name of [
      'uRes',
      'uGuard',
      'uTime',
      'uVel',
      'uWipe',
      'uBurst',
      'uMark',
      'uMarkOn',
      'uMaskTex',
      'uShaveTex',
    ]) {
      u[name] = gl.getUniformLocation(program, name);
    }

    const makeTex = (unit) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    const maskTex = makeTex(0);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );
    gl.uniform1i(u.uMaskTex, 0);

    const shaveTex = makeTex(1);
    const shaveBuf = new Uint8Array(SHAVE_W * SHAVE_H * 4);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      SHAVE_W,
      SHAVE_H,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      shaveBuf,
    );
    gl.uniform1i(u.uShaveTex, 1);

    let maskReady = false;
    // The mask decodes after this effect may already have been torn down, and
    // uploading into a deleted texture is a WebGL error rather than a no-op.
    let disposed = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (disposed) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      maskReady = true;
    };
    img.src = '/brand/faded-skull-mask.webp';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scale = () =>
      window.innerWidth < 820 ? 1.25 : Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const s = scale();
      canvas.width = Math.max(1, Math.round(window.innerWidth * s));
      canvas.height = Math.max(1, Math.round(window.innerHeight * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
    };
    resize();

    let guard = 1;
    let target = 1;
    let vel = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    let running = true;

    // The shave grid holds a value per cell that the pointer raises and time
    // lowers, so a cut path grows back instead of scarring the page.
    const shave = new Float32Array(SHAVE_W * SHAVE_H);
    let px = -1;
    let py = -1;
    let painting = false;

    const paintAt = (cx, cy, strength) => {
      const gx = (cx / window.innerWidth) * SHAVE_W;
      const gy = (1 - cy / window.innerHeight) * SHAVE_H;
      const r = 2.7;
      const x0 = Math.max(0, Math.floor(gx - r));
      const x1 = Math.min(SHAVE_W - 1, Math.ceil(gx + r));
      const y0 = Math.max(0, Math.floor(gy - r));
      const y1 = Math.min(SHAVE_H - 1, Math.ceil(gy + r));
      for (let y = y0; y <= y1; y += 1) {
        for (let x = x0; x <= x1; x += 1) {
          const d = Math.hypot(x - gx, y - gy) / r;
          if (d > 1) continue;
          const add = (1 - d) * (1 - d) * strength;
          const i = y * SHAVE_W + x;
          if (shave[i] < add) shave[i] = Math.min(1, shave[i] + add);
          else shave[i] = Math.min(1, shave[i] + add * 0.25);
        }
      }
    };

    const onPointer = (e) => {
      if (reduced.matches) return;
      const cx = e.clientX;
      const cy = e.clientY;
      if (px >= 0) {
        // Interpolate along the move so a fast sweep cuts a line, not dots.
        const steps = Math.min(12, Math.ceil(Math.hypot(cx - px, cy - py) / 12));
        for (let s = 1; s <= steps; s += 1) {
          paintAt(px + ((cx - px) * s) / steps, py + ((cy - py) * s) / steps, 0.5);
        }
      }
      paintAt(cx, cy, 0.55);
      px = cx;
      py = cy;
      painting = true;
    };

    const onPointerLeave = () => {
      px = -1;
      py = -1;
    };

    const uploadShave = () => {
      for (let i = 0; i < shave.length; i += 1) {
        if (shave[i] > 0.002) shave[i] *= 0.982;
        else shave[i] = 0;
        shaveBuf[i * 4] = shave[i] * 255;
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, shaveTex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        SHAVE_W,
        SHAVE_H,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        shaveBuf,
      );
    };

    const readScroll = () => {
      const span = document.documentElement.scrollHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
      target = 1 - p;
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      vel = Math.max(-1, Math.min(1, vel * 0.82 + (dy / window.innerHeight) * 1.6));
    };

    const readMark = () => {
      const el = document.querySelector(markSelector);
      if (!el || !maskReady) {
        gl.uniform1f(u.uMarkOn, 0);
        gl.uniform1f(u.uBurst, 0);
        return;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200 || r.width === 0) {
        gl.uniform1f(u.uMarkOn, 0);
        gl.uniform1f(u.uBurst, 0);
        return;
      }
      // Slightly grown so the shaved void reads as the mark's shadow, not its outline.
      const grow = 1.12;
      const cx = (r.left + r.width / 2) / window.innerWidth;
      const cy = 1 - (r.top + r.height / 2) / window.innerHeight;
      gl.uniform4f(
        u.uMark,
        cx,
        cy,
        (r.width * grow) / window.innerWidth,
        (r.height * grow) / window.innerHeight,
      );
      gl.uniform1f(u.uMarkOn, 1);
      // The fan fades with the mark so it never floats behind body copy.
      const fade = Math.max(
        0,
        1 -
          Math.abs(r.top + r.height / 2 - window.innerHeight * 0.45) / (window.innerHeight * 0.85),
      );
      gl.uniform1f(u.uBurst, fade);
    };

    const frame = (ms, animate) => {
      readScroll();
      guard += animate ? (target - guard) * 0.09 : target - guard;
      if (animate) vel *= 0.9;
      else vel = 0;
      gl.uniform1f(u.uGuard, guard);
      gl.uniform1f(u.uTime, animate ? ms / 1000 : 0);
      gl.uniform1f(u.uVel, vel);
      gl.uniform1f(u.uWipe, field.wipe);
      readMark();
      if (painting || animate) uploadShave();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = (ms) => {
      frame(ms, true);
      if (running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (reduced.matches) {
        running = false;
        frame(0, false);
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      if (!running) frame(0, false);
    };
    const onScrollStatic = () => {
      if (!running) frame(0, false);
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScrollStatic, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    const onReduced = () => {
      stop();
      start();
    };
    reduced.addEventListener('change', onReduced);
    running = false;
    start();

    return () => {
      disposed = true;
      img.onload = null;
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScrollStatic);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onPointerLeave);
      reduced.removeEventListener('change', onReduced);
      gl.deleteBuffer(buf);
      gl.deleteTexture(maskTex);
      gl.deleteTexture(shaveTex);
      gl.deleteProgram(program);
    };
  }, [markSelector]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
