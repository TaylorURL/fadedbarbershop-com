/*
 * What a page can do when a route's code does not arrive.
 *
 * Every file under /assets carries a content hash, so a filename belongs to the
 * build that wrote it and the next deploy takes the old one away. A document
 * held open across a deploy, or handed back out of a cache, therefore names a
 * chunk the origin no longer has, and a request dropped on a thin connection
 * ends in the same place from the other direction.
 *
 * Asking again is not the answer, which is worth saying because it is the
 * obvious one. A module that fails to fetch is recorded as failed in the
 * document's module map, and every later import of that same specifier is
 * answered out of the map without touching the network: three attempts at a
 * missing chunk, measured against this build, made one request between them. A
 * preload link that failed poisons the entry on its own, before the import is
 * reached at all.
 *
 * So the only recovery a document has is to stop being that document. Fetching
 * the page again brings the current chunk names with it and starts a fresh
 * module map. That reload is spent once per visit and never given back: handing
 * it back on a successful load is the loop, because the entry arrives on every
 * pass and its success would clear the flag the route's failure had just set. A
 * name that is genuinely gone therefore reaches the boundary on the second
 * pass, which puts the reload behind a button the reader presses rather than
 * one the page presses for them.
 */

const FLAG = 'faded:chunk-reload';

// A browser that refuses storage cannot be asked whether it has already
// reloaded, and a reload nothing remembers is a reload that repeats forever, so
// an unreadable flag reads as spent.
const spent = () => {
  try {
    return sessionStorage.getItem(FLAG) === '1';
  } catch {
    return true;
  }
};

const spend = () => {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    // Nothing to write to, and nothing that needs writing: spent() said so.
  }
};

// Returns whether the page is on its way out, so a caller can hold rather than
// hand back an error nobody will be there to read.
export function reloadOnce() {
  if (spent()) return false;
  spend();
  window.location.reload();
  return true;
}

export async function loadChunk(load) {
  try {
    return await load();
  } catch (error) {
    // Nothing is thrown while the reload is in flight. A rejection here would
    // put the failure screen up for the one frame before the document goes,
    // which reads as a broken page rather than a slow one.
    if (reloadOnce()) return new Promise(() => {});
    throw error;
  }
}
