(() => {
  'use strict';

  // Leave clipboard contents to the browser; prevent page handlers from
  // cancelling native clipboard, selection, and context-menu actions.
  const stopPageHandler = event => event.stopImmediatePropagation();
  for (const type of ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'dragstart']) {
    window.addEventListener(type, stopPageHandler, true);
  }
  window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey &&
        ['c', 'v', 'x', 'a'].includes(event.key.toLowerCase())) {
      event.stopImmediatePropagation();
    }
  }, true);

  // Keep page visibility APIs consistent when the browser backgrounds a tab.
  for (const [name, value] of [
    ['hidden', false], ['visibilityState', 'visible'],
    ['webkitHidden', false], ['webkitVisibilityState', 'visible']
  ]) {
    try {
      Object.defineProperty(document, name, {
        configurable: true, get: () => value
      });
    } catch (_) {}
  }
  try {
    Object.defineProperty(document, 'hasFocus', {
      configurable: true, value: () => true
    });
  } catch (_) {}
  for (const type of ['visibilitychange', 'webkitvisibilitychange']) {
    window.addEventListener(type, stopPageHandler, true);
  }
  // Preserve focus/blur events on form controls and editors.
  for (const type of ['blur', 'focus', 'focusout', 'focusin']) {
    window.addEventListener(type, event => {
      if (event.target === window || event.target === document) {
        event.stopImmediatePropagation();
      }
    }, true);
  }

  // Supply a local blank video stream for page-level display capture.
  // No desktop, window, microphone, or camera data is captured.
  const createBlankDisplayStream = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const context = canvas.getContext('2d');
    if (!context || typeof canvas.captureStream !== 'function') {
      throw new DOMException('Blank capture is unavailable.', 'NotSupportedError');
    }
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const stream = canvas.captureStream(1);
    // Keep the canvas alive until all tracks end.
    const decorateTrack = track => {
      const originalSettings = track.getSettings.bind(track);
      const originalClone = track.clone.bind(track);
      Object.defineProperty(track, 'getSettings', {
        configurable: true,
        value: () => ({
          ...originalSettings(),
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'never'
        })
      });
      Object.defineProperty(track, 'clone', {
        configurable: true,
        value: () => decorateTrack(originalClone())
      });
      return track;
    };
    for (const track of stream.getVideoTracks()) decorateTrack(track);
    for (const track of stream.getTracks()) {
      track.addEventListener('ended', () => {
        if (stream.getTracks().every(item => item.readyState === 'ended')) {
          canvas.width = 0;
        }
      }, { once: true });
    }
    return stream;
  };
  if (navigator.mediaDevices) {
    try {
      Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', {
        configurable: true,
        writable: true,
        value: createBlankDisplayStream
      });
    } catch (_) {}
  }

  // Suppress page-initiated fullscreen without changing reported fullscreen
  // state or modifying the browser's own fullscreen controls.
  for (const method of ['requestFullscreen', 'webkitRequestFullscreen',
                        'webkitRequestFullScreen', 'mozRequestFullScreen',
                        'msRequestFullscreen']) {
    if (typeof Element.prototype[method] !== 'function') continue;
    try {
      Object.defineProperty(Element.prototype, method, {
        configurable: true,
        writable: true,
        value: method === 'requestFullscreen'
          ? function () { return Promise.resolve(); }
          : function () {}
      });
    } catch (_) { /* Some browsers expose non-configurable legacy methods. */ }
  }
})();