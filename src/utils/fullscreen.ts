/**
 * Cross-browser Fullscreen & Proctoring Helper
 * Supports Chrome, Firefox, Safari, Edge, and iOS
 */

export function isBrowserFullscreenActive(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as any;
  return Boolean(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}

export async function enterBrowserFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    const elem = document.documentElement as any;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
      return true;
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
      return true;
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
      return true;
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[Fullscreen API] Request failed:', err);
    return false;
  }
}

export async function exitBrowserFullscreen(): Promise<void> {
  if (typeof document === 'undefined') return;
  try {
    const doc = document as any;
    if (isBrowserFullscreenActive()) {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    }
  } catch (err) {
    // ignore
  }
}
