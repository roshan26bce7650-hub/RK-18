RK-18 1.2.1

Install in Chrome or Edge:
1. Disable/remove the previous Neopass extension.
2. Extract this ZIP.
3. Open chrome://extensions (Edge: edge://extensions).
4. Enable Developer mode, select Load unpacked, and choose this folder.
5. Reload open pages.

Includes:
- Quick Turn ON / Turn OFF toggle switch directly from extension toolbar icon.
- Toolbar badge indicator ("ON" / "OFF") showing live status.
- Blank black video stream for page-level getDisplayMedia requests.
- Suppressing common page-level tab visibility and window focus checks.
- Blocking page-initiated fullscreen requests.
- Restoring text selection, copy, cut, paste, and right-click defaults.

No AI, login, external servers, analytics, storage, background worker,
clipboard reading, or automatic answers. Browser access is declared for all
websites so these features can run on ordinary pages and frames.
Disable the extension to turn all features off, then reload affected pages.

Limitations:
Browser-internal pages and extension stores are protected by the browser.
Custom editors may require their own paste handlers; suppressing those handlers
may affect rich-text paste. Canvas content cannot be made selectable by CSS.
Sites can detect lack of fullscreen and refuse to continue. This extension does
not spoof fullscreen status, unlock tests, or modify proctoring software.
Local file URLs require enabling Allow access to file URLs in extension settings.

Update: replace the old folder, click Reload on the extension card, then reload
existing pages. This cannot remove warnings already sent. Browser throttling,
server checks, native proctoring tools, and other signals can still reveal tab
switching. Live exam-site behavior has not been tested.

Blank capture limitations: replaces page-level screen capture only, after reloading
the page. It cannot change native proctoring capture or a stream already shared.
The site may reject a canvas stream or require a real display track. This feature
is not live-site verified. It does not grant actual screen, camera, or mic access.

1.2.1: Blank video tracks report monitor display-surface settings, including
cloned tracks. This addresses a possible cause of the Entire screen error.
Actual site validation has not been performed; real display capture is not used.
