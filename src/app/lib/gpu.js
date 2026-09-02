// Whether this machine draws WebGL in software.
//
// Chrome's SwiftShader, Mesa's llvmpipe and Apple's software fallback all
// rasterise on the same thread the page is laid out on, so a full-screen
// fragment shader there costs more than the page paints in the same time, and
// the frame the compositor is waiting on is the frame the reader is waiting on.
// A machine that answers yes here is given the flat background a machine with
// no WebGL at all already gets, and the still page a reduced-motion setting
// gets, rather than a field and a fall it cannot afford to draw.
//
// The verdict is read once, from a one-pixel context that is released again, so
// asking costs nothing beyond the first caller and every layer agrees.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

let verdict = null;

export default function drawsInSoftware() {
  if (verdict !== null) return verdict;
  if (typeof document === 'undefined') return false;
  const probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  const gl = probe.getContext('webgl');
  // No WebGL is the same tier by a different road, and the field checks for a
  // context of its own before it draws anything.
  if (!gl) {
    verdict = false;
    return verdict;
  }
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info
    ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER);
  verdict = SOFTWARE_RENDERER.test(String(renderer || ''));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return verdict;
}
