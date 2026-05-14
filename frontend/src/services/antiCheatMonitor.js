// @ts-nocheck
/**
 * ANTI-CHEAT MONITOR — Frontend behavioral detection engine
 * Singleton service. Activated ONLY when contestant is inside the coding round.
 *
 * Detects: blur, tab-hide, fullscreen exit, devtools (5 techniques),
 * multi-tab (BroadcastChannel + localStorage), split-screen, resize anomalies,
 * second monitor, zoom change, inactivity, network events, tampering.
 */

const HEARTBEAT_INTERVAL_MS = 8000;       // Send heartbeat every 8s
const DEVTOOLS_CHECK_INTERVAL_MS = 3000;  // Check devtools every 3s
const INACTIVITY_THRESHOLD_MS = 90000;    // 90s without any interaction = inactivity
const RESIZE_DEBOUNCE_MS = 800;           // Debounce resize events

class AntiCheatMonitor {
  constructor() {
    this._active = false;
    this._sessionId = null;
    this._round = null;
    this._api = null;
    this._onEvent = null; // callback(eventType, metadata, response)

    this._listeners = [];          // [{ target, type, fn }] for cleanup
    this._intervals = [];          // interval IDs for cleanup

    this._broadcastChannel = null;
    this._lastDevToolsWidth = 0;
    this._lastWindowWidth = window.outerWidth;
    this._lastWindowHeight = window.outerHeight;
    this._lastDevicePixelRatio = window.devicePixelRatio;
    this._lastInnerWidth = window.innerWidth;
    this._inactivityTimer = null;
    this._resizeDebounceTimer = null;

    // Event queue — batches non-critical events; critical ones bypass
    this._eventQueue = [];
    this._flushIntervalId = null;
    this._CRITICAL_EVENTS = new Set(["devtools", "multi_tab", "tampering"]);

    // Integrity seal — stored in localStorage; backend verifies via heartbeat
    this._integritySeal = null;
    this._tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Blur tracking
    this._blurCount = 0;
    this._lastFocusTime = Date.now();

    // Refresh abuse: count page loads in sessionStorage
    this._trackRefreshAbuse();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Start monitoring. Call when contestant enters coding round.
   */
  start({ sessionId, round, api, onEvent }) {
    // 🛡️ Safeguard: NEVER start for admins
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.role === "admin") {
        console.warn("[AntiCheat] Admin detected. Monitoring disabled.");
        return;
      }
    } catch {}

    if (this._active) this.stop(); // Clean up any prior session

    this._active = true;
    this._sessionId = sessionId;
    this._round = round;
    this._api = api;
    this._onEvent = onEvent || (() => {});

    this._writeIntegritySeal();
    this._setupAllDetectors();
    this._startHeartbeat();
    this._startEventFlush();


  }

  /**
   * Stop all monitoring. Call on submit / timeout / navigate away.
   */
  stop(reason = "submitted") {
    if (!this._active) return;
    this._active = false;

    // Remove all listeners
    this._listeners.forEach(({ target, type, fn }) => {
      target.removeEventListener(type, fn);
    });
    this._listeners = [];

    // Clear all intervals
    this._intervals.forEach((id) => clearInterval(id));
    this._intervals = [];

    // Close BroadcastChannel
    if (this._broadcastChannel) {
      this._broadcastChannel.postMessage({ type: "tab_closed", tabId: this._tabId, round: this._round });
      this._broadcastChannel.close();
      this._broadcastChannel = null;
    }

    // Clear inactivity + debounce timers
    if (this._inactivityTimer) clearTimeout(this._inactivityTimer);
    if (this._resizeDebounceTimer) clearTimeout(this._resizeDebounceTimer);
    if (this._flushIntervalId) clearInterval(this._flushIntervalId);

    // Flush remaining queued events before stopping
    this._flushQueue();

    // Clear integrity seal
    this._clearIntegritySeal();

    // Clear refresh counter for this round
    sessionStorage.removeItem(`ac_refreshes_${this._round}`);


  }

  // ══════════════════════════════════════════════════════════════════════════
  // SETUP ALL DETECTORS
  // ══════════════════════════════════════════════════════════════════════════

  _setupAllDetectors() {
    this._setupWindowBlur();
    this._setupVisibilityChange();
    this._setupFullscreenChange();
    this._setupResizeDetection();
    this._setupZoomDetection();
    this._setupInactivityDetection();
    this._setupNetworkDetection();
    this._setupMultiTabDetection();
    this._setupDevToolsDetection();
    this._setupTamperingDetection();
  }

  // ── 1. Window Blur / Focus ─────────────────────────────────────────────────
  _setupWindowBlur() {
    const onBlur = () => {
      if (!this._active) return;
      this._blurCount++;
      this._lastFocusTime = Date.now();
      const meta = { blurCount: this._blurCount, timestamp: Date.now() };

      // Excessive focus loss: blur 5+ times is more suspicious
      if (this._blurCount >= 5) {
        this._dispatchEvent("excessive_focus_loss", { ...meta, blurCount: this._blurCount });
      } else {
        this._dispatchEvent("blur", meta);
      }
    };

    const onFocus = () => {
      if (!this._active) return;
      this._resetInactivityTimer();
    };

    this._addListener(window, "blur", onBlur);
    this._addListener(window, "focus", onFocus);
  }

  // ── 2. Visibility Change (tab switch / minimize) ───────────────────────────
  _setupVisibilityChange() {
    const onVisChange = () => {
      if (!this._active) return;
      if (document.hidden) {
        this._dispatchEvent("tab_hidden", {
          visibilityState: document.visibilityState,
          timestamp: Date.now(),
        });
      }
    };
    this._addListener(document, "visibilitychange", onVisChange);
  }

  // ── 3. Fullscreen Exit ─────────────────────────────────────────────────────
  _setupFullscreenChange() {
    const onFsChange = () => {
      if (!this._active) return;
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      if (!isFullscreen) {
        this._dispatchEvent("fullscreen_exit", { timestamp: Date.now() });
      }
    };
    this._addListener(document, "fullscreenchange", onFsChange);
    this._addListener(document, "webkitfullscreenchange", onFsChange);
    this._addListener(document, "mozfullscreenchange", onFsChange);
  }

  // ── 4. Resize — split-screen + second monitor heuristics ──────────────────
  _setupResizeDetection() {
    const onResize = () => {
      if (!this._active) return;
      if (this._resizeDebounceTimer) clearTimeout(this._resizeDebounceTimer);

      this._resizeDebounceTimer = setTimeout(() => {
        const sw = window.screen.width;
        const sh = window.screen.height;
        const ww = window.outerWidth;
        const wh = window.outerHeight;
        const iw = window.innerWidth;

        const widthRatio = ww / sw;
        const heightRatio = wh / sh;

        // Split-screen heuristic: window is less than 60% of screen width
        if (widthRatio < 0.6) {
          this._dispatchEvent("split_screen", {
            windowWidth: ww, screenWidth: sw, ratio: widthRatio.toFixed(2),
          });
          return;
        }

        // Second monitor heuristic: window is positioned off-screen or far
        if (window.screenX < -100 || window.screenY < -100 ||
            window.screenX > sw + 100) {
          this._dispatchEvent("second_monitor", {
            screenX: window.screenX, screenY: window.screenY,
            screenWidth: sw, screenHeight: sh,
          });
          return;
        }

        // Suspicious resize: significant window shrink
        const widthDelta = Math.abs(ww - this._lastWindowWidth);
        const heightDelta = Math.abs(wh - this._lastWindowHeight);
        if (widthDelta > 200 || heightDelta > 200) {
          this._dispatchEvent("suspicious_resize", {
            from: { w: this._lastWindowWidth, h: this._lastWindowHeight },
            to: { w: ww, h: wh },
            delta: { w: widthDelta, h: heightDelta },
          });
        }

        this._lastWindowWidth = ww;
        this._lastWindowHeight = wh;
      }, RESIZE_DEBOUNCE_MS);
    };

    this._addListener(window, "resize", onResize);
  }

  // ── 5. Zoom Change ─────────────────────────────────────────────────────────
  _setupZoomDetection() {
    // devicePixelRatio changes when user zooms
    const checkZoom = () => {
      if (!this._active) return;
      const currentRatio = window.devicePixelRatio;
      if (currentRatio !== this._lastDevicePixelRatio) {
        this._dispatchEvent("zoom_change", {
          from: this._lastDevicePixelRatio,
          to: currentRatio,
        });
        this._lastDevicePixelRatio = currentRatio;
      }
      // Also check via innerWidth discrepancy (CSS zoom)
      const currentInner = window.innerWidth;
      if (Math.abs(currentInner - this._lastInnerWidth) > 50) {
        this._lastInnerWidth = currentInner;
      }
    };
    const zoomId = setInterval(checkZoom, 2000);
    this._intervals.push(zoomId);
  }

  // ── 6. Inactivity ──────────────────────────────────────────────────────────
  _setupInactivityDetection() {
    const activityEvents = ["mousemove", "keydown", "keypress", "click", "scroll", "touchstart"];
    const onActivity = () => {
      if (!this._active) return;
      this._resetInactivityTimer();
    };
    activityEvents.forEach((evt) => this._addListener(document, evt, onActivity));
    this._resetInactivityTimer();
  }

  _resetInactivityTimer() {
    if (this._inactivityTimer) clearTimeout(this._inactivityTimer);
    if (!this._active) return;
    this._inactivityTimer = setTimeout(() => {
      if (this._active) {
        this._dispatchEvent("inactivity", { inactiveDurationMs: INACTIVITY_THRESHOLD_MS });
      }
    }, INACTIVITY_THRESHOLD_MS);
  }

  // ── 7. Network Disconnect / Reconnect ─────────────────────────────────────
  _setupNetworkDetection() {
    const onOffline = () => {
      if (!this._active) return;
      this._dispatchEvent("network_disconnect", { timestamp: Date.now() });
    };
    const onOnline = () => {
      if (!this._active) return;
      this._dispatchEvent("reconnect", { timestamp: Date.now() });
    };
    this._addListener(window, "offline", onOffline);
    this._addListener(window, "online", onOnline);
  }

  // ── 8. Multi-Tab Detection (BroadcastChannel + localStorage fallback) ──────
  _setupMultiTabDetection() {
    const channelName = `ac_contest_${this._round}`;

    try {
      this._broadcastChannel = new BroadcastChannel(channelName);

      // Announce this tab's presence
      this._broadcastChannel.postMessage({
        type: "tab_opened",
        tabId: this._tabId,
        round: this._round,
        sessionId: this._sessionId,
        timestamp: Date.now(),
      });

      // Listen for other tabs
      this._broadcastChannel.onmessage = (event) => {
        if (!this._active) return;
        const { type, tabId, round, sessionId } = event.data;

        if (type === "tab_opened" && round === this._round && tabId !== this._tabId) {
          // Another tab for the same round just opened → immediate spike
          this._dispatchEvent("multi_tab", {
            otherTabId: tabId,
            otherSessionId: sessionId,
            source: "broadcast_channel",
          }, true); // force immediate send
        }
        if (type === "ping" && tabId !== this._tabId && round === this._round) {
          // Respond to indicate this tab is alive
          this._broadcastChannel.postMessage({
            type: "pong",
            tabId: this._tabId,
            round: this._round,
          });
        }
        if (type === "pong" && tabId !== this._tabId && round === this._round) {
          this._dispatchEvent("multi_tab", { source: "broadcast_ping_pong" }, true);
        }
      };

      // Periodically ping to discover already-open tabs
      const pingId = setInterval(() => {
        if (!this._active || !this._broadcastChannel) return;
        this._broadcastChannel.postMessage({
          type: "ping",
          tabId: this._tabId,
          round: this._round,
        });
      }, 15000);
      this._intervals.push(pingId);
    } catch (e) {
      // BroadcastChannel not supported — fallback to localStorage
      this._setupMultiTabLocalStorageFallback();
    }

    // Always run localStorage tab counter as supplementary check
    this._setupMultiTabLocalStorageFallback();
  }

  _setupMultiTabLocalStorageFallback() {
    const tabKey = `ac_tabs_${this._round}`;
    const tabsRaw = localStorage.getItem(tabKey);
    let tabs = {};
    try { tabs = JSON.parse(tabsRaw) || {}; } catch { tabs = {}; }

    // Register this tab
    tabs[this._tabId] = Date.now();
    localStorage.setItem(tabKey, JSON.stringify(tabs));

    // Check for other alive tabs (alive = heartbeat within last 20s)
    const now = Date.now();
    const aliveTabs = Object.entries(tabs).filter(
      ([id, ts]) => id !== this._tabId && now - ts < 20000
    );
    if (aliveTabs.length > 0) {
      this._dispatchEvent("multi_tab", {
        tabCount: aliveTabs.length + 1,
        source: "localStorage",
      }, true);
    }

    // Keep updating this tab's timestamp
    const lsTabId = setInterval(() => {
      if (!this._active) return;
      const raw = localStorage.getItem(tabKey);
      let t = {};
      try { t = JSON.parse(raw) || {}; } catch { t = {}; }
      // Clean stale tabs
      const alive = {};
      const n = Date.now();
      Object.entries(t).forEach(([id, ts]) => {
        if (n - ts < 20000) alive[id] = ts;
      });
      alive[this._tabId] = n;
      localStorage.setItem(tabKey, JSON.stringify(alive));

      // Detect concurrent tabs
      const others = Object.keys(alive).filter((id) => id !== this._tabId);
      if (others.length > 0) {
        this._dispatchEvent("multi_tab", { tabCount: others.length + 1, source: "localStorage_poll" }, true);
      }
    }, 10000);
    this._intervals.push(lsTabId);

    // Cleanup this tab on page unload
    const cleanup = () => {
      const raw = localStorage.getItem(tabKey);
      let t = {};
      try { t = JSON.parse(raw) || {}; } catch { t = {}; }
      delete t[this._tabId];
      localStorage.setItem(tabKey, JSON.stringify(t));
    };
    window.addEventListener("beforeunload", cleanup);
    window.addEventListener("pagehide", cleanup);
  }

  // ── 9. DevTools Detection (5 independent techniques) ──────────────────────
  _setupDevToolsDetection() {
    let devToolsDetectedCount = 0;

    const reportDevTools = (technique) => {
      if (!this._active) return;
      devToolsDetectedCount++;
      if (devToolsDetectedCount === 1 || devToolsDetectedCount % 3 === 0) {
        // Report on first detection and every 3rd subsequent detection
        this._dispatchEvent("devtools", { technique, count: devToolsDetectedCount }, true);
      }
    };

    const checkDevTools = () => {
      if (!this._active) return;
      let detected = false;

      // Technique 1: outer/inner window dimension difference
      const threshold = 160;
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      if (wDiff > threshold || hDiff > threshold) {
        detected = true;
        reportDevTools("dimension_heuristic");
      }

      // Technique 2: Firebug legacy check
      if (typeof window.console !== "undefined" && window.console.firebug) {
        detected = true;
        reportDevTools("firebug");
      }

      // Technique 3: getter trick
      if (!detected) {
        const el = new Image();
        Object.defineProperty(el, "id", {
          get() {
            detected = true;
            reportDevTools("getter_trick");
            return "";
          },
          configurable: true,
        });
        try {
          console.log(el); // triggers getter only when DevTools console is open
        } catch {}
      }

      // Technique 4: toString override check (safer than debugger/profile)
      if (!detected) {
        const check = /./;
        check.toString = function() {
          detected = true;
          reportDevTools("toString_check");
          return "ac";
        };
        // Some browsers trigger toString on certain console operations
      }
    };

    const devToolsId = setInterval(checkDevTools, DEVTOOLS_CHECK_INTERVAL_MS);
    this._intervals.push(devToolsId);
    // Initial check
    setTimeout(checkDevTools, 500);
  }

  // ── 10. Tampering Detection ────────────────────────────────────────────────
  _setupTamperingDetection() {
    // Check if our event listeners are still intact at intervals
    const checkTampering = () => {
      if (!this._active) return;

      // Check integrity seal in localStorage
      const seal = localStorage.getItem(`ac_seal_${this._round}`);
      if (seal !== this._integritySeal) {
        // localStorage was modified
        this._dispatchEvent("tampering", {
          reason: "integrity_seal_broken",
          expected: this._integritySeal,
          found: seal,
        }, true);
        // Rewrite the seal
        this._writeIntegritySeal();
      }

      // Check if native functions have been overridden
      const nativeCheck = [
        { name: "fetch", native: "function fetch() { [native code] }" },
        { name: "XMLHttpRequest", native: "function XMLHttpRequest() { [native code] }" },
      ];
      nativeCheck.forEach(({ name, native }) => {
        try {
          const fn = window[name]?.toString() || "";
          if (fn && !fn.includes("[native code]") && !fn.includes("AntiCheat")) {
            this._dispatchEvent("tampering", { reason: `${name}_overridden`, fn: fn.slice(0, 50) }, true);
          }
        } catch {}
      });
    };

    const tamperCheckId = setInterval(checkTampering, 12000);
    this._intervals.push(tamperCheckId);
  }

  // ── Refresh abuse tracking ─────────────────────────────────────────────────
  _trackRefreshAbuse() {
    // This runs in constructor so it fires on every page load (refresh included)
    const key = `ac_refreshes_${this._round || "pending"}`;
    const count = Number(sessionStorage.getItem(key) || "0") + 1;
    sessionStorage.setItem(key, String(count));
    // Round key is not set yet in constructor; the start() method will send if needed
    this._refreshCount = count;
  }

  _checkRefreshAbuse() {
    const key = `ac_refreshes_${this._round}`;
    const count = Number(sessionStorage.getItem(key) || "0");
    if (count >= 3) {
      this._dispatchEvent("refresh_abuse", { refreshCount: count }, true);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT DISPATCH
  // ══════════════════════════════════════════════════════════════════════════

  _dispatchEvent(eventType, metadata = {}, immediate = false) {
    if (!this._active) return;

    const payload = {
      eventType,
      metadata: { ...metadata, url: window.location.pathname },
      browserInfo: this._getBrowserInfo(),
      clientTimestamp: Date.now(),
      sessionId: this._sessionId,
      round: this._round,
    };

    if (immediate || this._CRITICAL_EVENTS.has(eventType)) {
      this._sendEvent(payload);
    } else {
      this._eventQueue.push(payload);
    }
  }

  async _sendEvent(payload) {
    if (!this._api || !this._active) return;
    try {
      const res = await this._api.post("/api/anticheat/event", payload);
      this._onEvent(payload.eventType, payload.metadata, res.data);
    } catch (err) {
      // Silent fail — don't break the coding experience
    }
  }

  _startEventFlush() {
    // Flush non-critical events every 2 seconds
    this._flushIntervalId = setInterval(() => {
      if (!this._active) return;
      this._flushQueue();
    }, 2000);
    this._intervals.push(this._flushIntervalId);
  }

  _flushQueue() {
    if (this._eventQueue.length === 0) return;
    const events = [...this._eventQueue];
    this._eventQueue = [];
    // Send each; could be optimized to bulk endpoint but keeps API simple
    events.forEach((p) => this._sendEvent(p));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HEARTBEAT
  // ══════════════════════════════════════════════════════════════════════════

  _startHeartbeat() {
    // Check refresh abuse on first heartbeat
    setTimeout(() => this._checkRefreshAbuse(), 2000);

    const heartbeatId = setInterval(async () => {
      if (!this._active || !this._api) return;

      // Count alive tabs from localStorage
      const tabKey = `ac_tabs_${this._round}`;
      const raw = localStorage.getItem(tabKey);
      let tabCount = 1;
      try {
        const tabs = JSON.parse(raw) || {};
        const now = Date.now();
        tabCount = Object.values(tabs).filter((ts) => now - ts < 20000).length;
      } catch {}

      // Check integrity seal
      const seal = localStorage.getItem(`ac_seal_${this._round}`);
      const localStorageIntact = seal === this._integritySeal;

      try {
        const res = await this._api.post("/api/anticheat/heartbeat", {
          sessionId: this._sessionId,
          tabCount,
          localStorageIntact,
        });

        // Backend may send back action commands
        if (res.data) {
          this._onEvent("heartbeat", {}, res.data);
        }
      } catch {}
    }, HEARTBEAT_INTERVAL_MS);

    this._intervals.push(heartbeatId);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INTEGRITY SEAL
  // ══════════════════════════════════════════════════════════════════════════

  _writeIntegritySeal() {
    this._integritySeal = `seal_${this._sessionId}_${Date.now()}`;
    localStorage.setItem(`ac_seal_${this._round}`, this._integritySeal);
  }

  _clearIntegritySeal() {
    localStorage.removeItem(`ac_seal_${this._round}`);
    // Also clean tab registry
    localStorage.removeItem(`ac_tabs_${this._round}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  _addListener(target, type, fn) {
    target.addEventListener(type, fn, { passive: true });
    this._listeners.push({ target, type, fn });
  }

  _getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.outerWidth,
      windowHeight: window.outerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      platform: navigator.platform || "",
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      screenX: window.screenX,
      screenY: window.screenY,
    };
  }
}

// Export as singleton
const antiCheatMonitor = new AntiCheatMonitor();
export default antiCheatMonitor;
