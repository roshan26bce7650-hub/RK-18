 # ⚡ RK-18 — Browser Productivity & Privacy Extension

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.2.1-emerald?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)
![Privacy](https://img.shields.io/badge/Data%20Collection-None%20(100%25%20Offline)-brightgreen?style=flat-square)

**RK-18** is a clean, lightweight Manifest V3 browser extension designed to restore native user control over web pages. It re-enables text selection, copy, cut, and paste on restricted websites, prevents intrusive tab-visibility/focus monitoring, blocks forced fullscreen demands, and supplies a privacy feed for screen sharing.

---

## ✨ Features

- 📋 **Universal Clipboard Restoration**: Overrides JavaScript handlers that block `copy`, `cut`, `paste`, `selectstart`, and right-click context menus.
- 👁️ **Tab Visibility & Focus Spoofing**: Keeps `document.visibilityState` reported as `"visible"` and `document.hidden` as `false` when switching tabs or backgrounding windows.
- 🖥️ **Fullscreen Lock Suppression**: Prevents aggressive pages from forcing fullscreen mode while keeping normal browsing smooth.
- 📺 **Privacy Display Stream**: Intercepts page-level `getDisplayMedia` screen share requests with a clean blank canvas track.
- 🔘 **One-Click Quick Toggle**: Instant **ON / OFF** toggle switch with live toolbar status badge (`ON` / `OFF`) and a quick tab reload button.
- 🔒 **100% Offline & Private**: Zero external network requests, zero telemetry, zero analytics, zero clipboard spying.

---

## 🚀 Installation Guide

### For Google Chrome, Microsoft Edge, Brave, & Opera:

 
