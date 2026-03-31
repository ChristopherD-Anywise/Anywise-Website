# Globe Theme Robustness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two robustness issues in the globe theme toggle: a race condition where the module may not be registered when `applyTheme()` fires, and a flash-of-black caused by disposing the old texture before the new one finishes loading.

**Architecture:** Both fixes are in `anywise-v5-redesign.html`. Fix 1 adds a stub `window.updateGlobeTheme` in the inline classic `<script>` (before the module) that queues a pending theme value; the module consumes and replaces the stub on load. Fix 2 defers `earthMaterial.map` assignment and `oldTexture.dispose()` into the `TextureLoader` callback so the old texture stays visible until the new one is GPU-ready.

**Tech Stack:** Vanilla HTML/JS, Three.js 0.170.0 (ES module), `window` as cross-script communication channel.

---

## Files

- Modify: `anywise-v5-redesign.html`
  - Lines 1476–1496: inline `<script>` before `</head>` — add queuing stub after the IIFE
  - Lines 2148–2157: `loadEarthTexture()` in the Three.js module — add `onLoad` callback parameter
  - Lines 2225–2248: `updateGlobeTheme()` in the Three.js module — defer texture swap to callback
  - Lines 2249: after `window.updateGlobeTheme = updateGlobeTheme` — add pending theme flush

---

### Task 1: Add queuing stub for `window.updateGlobeTheme` before module loads

**The problem:** The classic `<script>` runs synchronously at parse time; the `<script type="module">` is deferred. If `applyTheme()` is called (e.g. on DOMContentLoaded rehydration or a fast user click) before the module registers `window.updateGlobeTheme`, the guard `if (window.updateGlobeTheme)` is falsy and the call is silently dropped — the globe stays in its initial state for that session.

**The fix:** Define a stub `window.updateGlobeTheme` in the inline `<script>` that stores the last requested value in `window.__pendingGlobeTheme`. The module replaces the stub with the real function on load, then checks `__pendingGlobeTheme` and flushes it if set.

**Files:**
- Modify: `anywise-v5-redesign.html:1476–1496` (inline script block)
- Modify: `anywise-v5-redesign.html:2249` (after module registers real function)

- [ ] **Step 1: Read the current inline script block**

Read lines 1476–1496 to confirm it ends with:
```js
  })();
</script>
```

- [ ] **Step 2: Add the queuing stub after the IIFE**

The inline `<script>` currently ends at line 1495 with `})();` and line 1496 with `</script>`. Insert one line between them:

old_string:
```
  })();
</script>
</head>
```

new_string:
```
  })();
  // Queuing stub — replaced by the real function when the Three.js module loads
  window.updateGlobeTheme = function(light) { window.__pendingGlobeTheme = light; };
</script>
</head>
```

- [ ] **Step 3: Add the pending-flush after the module registers the real function**

In the Three.js module, line 2249 currently reads:
```js
window.updateGlobeTheme = updateGlobeTheme;
```

Replace it with:
```js
window.updateGlobeTheme = updateGlobeTheme;
// Flush any theme change that arrived before this module loaded
if (window.__pendingGlobeTheme !== undefined) {
  updateGlobeTheme(window.__pendingGlobeTheme);
  delete window.__pendingGlobeTheme;
}
```

- [ ] **Step 4: Verify**

Grep for `__pendingGlobeTheme` — should return exactly 3 lines:
1. The assignment in the stub: `window.__pendingGlobeTheme = light;`
2. The flush check: `if (window.__pendingGlobeTheme !== undefined)`
3. The delete: `delete window.__pendingGlobeTheme;`

- [ ] **Step 5: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: queue globe theme updates that arrive before ES module loads"
```

---

### Task 2: Defer texture swap and disposal into the TextureLoader callback

**The problem:** In `updateGlobeTheme()`, `loadEarthTexture(isLight)` returns immediately with an unloaded texture object. `earthMaterial.map` is swapped to it right away and `oldTexture.dispose()` is called immediately. During the async image fetch, Three.js renders a black globe (unloaded texture = black). The old texture — which was visible — is already disposed and gone.

**The fix:** Add an optional `onLoad` parameter to `loadEarthTexture`. In `updateGlobeTheme`, pass a callback that performs the map swap + needsUpdate + old dispose only when the new texture is GPU-ready. The old texture stays on `earthMaterial.map` (and stays visible) until the callback fires.

The texture URLs are served from a CDN and will be browser-cached after the first theme toggle, so subsequent toggles will be near-instant. Only the very first toggle in each direction shows the brief loading period — and with this fix, the globe keeps showing the old texture instead of going black.

**Files:**
- Modify: `anywise-v5-redesign.html` — `loadEarthTexture()` at lines ~2148–2157
- Modify: `anywise-v5-redesign.html` — `updateGlobeTheme()` texture swap section at lines ~2231–2236

- [ ] **Step 1: Read the current `loadEarthTexture` function**

Read lines 2148–2157 to confirm it reads:
```js
function loadEarthTexture(light) {
  const tex = textureLoader.load(
    light
      ? 'https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg'
      : 'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg',
    () => { renderer.render(scene, camera); }
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
```

- [ ] **Step 2: Update `loadEarthTexture` to accept an `onLoad` callback**

Replace the function with:
```js
function loadEarthTexture(light, onLoad) {
  const tex = textureLoader.load(
    light
      ? 'https://unpkg.com/three-globe@2.41.12/example/img/earth-blue-marble.jpg'
      : 'https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg',
    (loadedTex) => {
      if (onLoad) onLoad(loadedTex);
      renderer.render(scene, camera);
    }
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
```

Note: the initial call `loadEarthTexture(isLight)` at line ~2159 passes no `onLoad` — that's intentional and still works fine (texture assigned at init via `map: earthTexture`).

- [ ] **Step 3: Read the current texture swap section in `updateGlobeTheme`**

Read the `// Swap texture` section (lines ~2231–2236), confirming it reads:
```js
  // Swap texture
  const oldTexture = earthMaterial.map;
  const newTexture = loadEarthTexture(isLight);
  earthMaterial.map = newTexture;
  earthMaterial.needsUpdate = true;
  if (oldTexture) oldTexture.dispose();
```

- [ ] **Step 4: Replace the texture swap to defer into the callback**

Replace those 5 lines (from `// Swap texture` through `if (oldTexture) oldTexture.dispose();`) with:
```js
  // Swap texture — deferred into load callback so old texture stays visible until new one is ready
  const oldTexture = earthMaterial.map;
  loadEarthTexture(isLight, () => {
    earthMaterial.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();
  });
  // Assign new texture object immediately so Three.js queues the upload;
  // the material keeps showing oldTexture until needsUpdate fires in the callback
  earthMaterial.map = loadEarthTexture(isLight);
```

Wait — that would call `loadEarthTexture` twice and fire two network requests. Use this pattern instead, which calls it once:

```js
  // Swap texture — defer map assignment and disposal until new texture is loaded
  const oldTexture = earthMaterial.map;
  loadEarthTexture(isLight, (newTex) => {
    earthMaterial.map = newTex;
    earthMaterial.needsUpdate = true;
    if (oldTexture) oldTexture.dispose();
  });
```

(The `loadEarthTexture` call returns the texture object and starts loading; the `onLoad` callback fires when the image is ready and does the swap.)

- [ ] **Step 5: Verify no double-load**

Grep for `loadEarthTexture` — confirm it appears exactly 3 times:
1. The function definition
2. The initial call at module load: `const earthTexture = loadEarthTexture(isLight);`
3. The single call inside `updateGlobeTheme`: `loadEarthTexture(isLight, (newTex) => {`

- [ ] **Step 6: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: keep old globe texture visible until new texture finishes loading"
```
