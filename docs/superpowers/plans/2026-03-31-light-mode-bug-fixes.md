# Light Mode Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three light mode visual bugs: hero tagline unreadable, "ethically engineered" gradient text fuzzy, and globe not updating on theme toggle.

**Architecture:** All fixes are in `anywise-v5-redesign.html` — CSS changes for the two text bugs, and a JS refactor to make the Three.js globe reactive to the `applyTheme()` call for the globe bug. The globe init code currently reads `isLightTheme` as a `const` at module load time; the fix exposes a `updateGlobeTheme(isLight)` function on `window` and calls it from `applyTheme()`.

**Tech Stack:** Vanilla HTML/CSS/JS, Three.js 0.170.0 (ES module, importmap), CSS custom properties, `data-theme` attribute on `<html>`

---

## Files

- Modify: `anywise-v5-redesign.html`
  - Lines 111–113: hero-tagline light mode CSS override
  - Lines 555–562: hero h1 em / gradient text CSS (add light mode override)
  - Lines 1994–2006: `applyTheme()` + toggle listener (add globe update call)
  - Lines 2116–2244: Three.js module script (refactor to expose `updateGlobeTheme`)

---

### Task 1: Fix hero tagline contrast in light mode

The current override `rgba(0,0,0,0.5)` is too faint. The actual element is `.hero-tagline` (confirmed at line 519 and 1527). Fix: darken to `rgba(0,0,0,0.75)`.

**Files:**
- Modify: `anywise-v5-redesign.html:111-113`

- [ ] **Step 1: Read current CSS override**

Lines 111–113 currently read:
```css
[data-theme="light"] .hero-tagline {
  color: rgba(0,0,0,0.5);
}
```

- [ ] **Step 2: Update the color value**

Change `rgba(0,0,0,0.5)` to `rgba(0,0,0,0.75)`:

```css
[data-theme="light"] .hero-tagline {
  color: rgba(0,0,0,0.75);
}
```

Use Edit tool with `old_string` = the exact 3 lines above, `new_string` = the 3 lines with 0.75.

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: darken hero tagline contrast in light mode (0.5 → 0.75 alpha)"
```

---

### Task 2: Fix "ethically engineered" gradient text fuzzy edges in light mode

The `<em>` inside `.hero h1` uses `background-clip: text` with `--gradient-full` (`#2d7f36 → #39a849 → #c3e01b`). On a light background the pale lime end of the gradient blurs against white. Fix: add a light mode override that replaces `--gradient-full` on that element with a fully dark-on-light gradient, and force `-webkit-text-fill-color` to ensure clean rendering.

**Files:**
- Modify: `anywise-v5-redesign.html` — add new CSS rule after the existing light mode hero block (after line 113, before line 115)

- [ ] **Step 1: Locate insertion point**

The hero-tagline override ends at line 113. The `[data-theme="light"] .hero-sub` rule starts at line 115. Insert the new rule between them.

- [ ] **Step 2: Insert the light mode gradient text override**

Insert this CSS block between the hero-tagline override and the hero-sub override:

```css
[data-theme="light"] .hero h1 em {
  background: linear-gradient(135deg, #1a5c22, #2d7f36, #39a849);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Use Edit tool targeting the `[data-theme="light"] .hero-sub` rule as the `old_string` anchor and prepend the new block above it:

```
old_string:
[data-theme="light"] .hero-sub {
  color: rgba(0,0,0,0.6);
}

new_string:
[data-theme="light"] .hero h1 em {
  background: linear-gradient(135deg, #1a5c22, #2d7f36, #39a849);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .hero-sub {
  color: rgba(0,0,0,0.6);
}
```

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: add darker gradient for hero em text in light mode to remove fuzzy edges"
```

---

### Task 3: Make Three.js globe reactive to theme changes

**Root cause:** The globe `<script type="module">` reads `isLightTheme` as a `const` at module evaluation time (line 2118). When `applyTheme()` flips `data-theme`, the globe never re-reads it. There is no way to call into a `type="module"` script from outside without explicit `window` exposure.

**Fix strategy:**
1. In the Three.js module, replace `isLightTheme` const with a local `let currentTheme` variable.
2. Extract globe parameters into a `updateGlobeTheme(isLight)` function that mutates the live Three.js objects (renderer clear color, texture, lighting intensities/positions, glow shader).
3. Expose `updateGlobeTheme` on `window` so `applyTheme()` can call it.
4. In the main script's `applyTheme()`, add `if (window.updateGlobeTheme) window.updateGlobeTheme(theme === 'light');`

**Texture note:** Swapping the texture requires loading a new `THREE.Texture` via `TextureLoader`. The loaded texture must be assigned to `earthMaterial.map` and `earthMaterial.needsUpdate = true` must be called. The old texture should be disposed with `.dispose()` to avoid GPU memory leaks.

**Files:**
- Modify: `anywise-v5-redesign.html:1994-2006` (applyTheme function)
- Modify: `anywise-v5-redesign.html:2116-2244` (Three.js module script)

- [ ] **Step 1: Update `applyTheme()` to call globe update**

Lines 1994–2006 currently:
```js
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#f5f6f3' : '#0e110e';
  themeToggle.textContent = theme === 'light' ? '☾' : '☀';
  localStorage.setItem('anywise-theme', theme);
}
```

Change to:
```js
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#f5f6f3' : '#0e110e';
  themeToggle.textContent = theme === 'light' ? '☾' : '☀';
  localStorage.setItem('anywise-theme', theme);
  if (window.updateGlobeTheme) window.updateGlobeTheme(theme === 'light');
}
```

- [ ] **Step 2: Refactor the Three.js module to expose `updateGlobeTheme`**

Replace the entire `<script type="module">` block (lines 2116–2244 from `import * as THREE` to `animate();`) with the version below. Key changes:
- `const isLightTheme` → `let isLight` (mutable)
- `updateGlobeTheme(newIsLight)` function updates renderer, texture, lighting, glow shader
- `window.updateGlobeTheme = updateGlobeTheme` exposes it

```js
import * as THREE from 'three';
let isLight = document.documentElement.dataset.theme === 'light';

const container = document.getElementById('globe-container');
if (!container) throw new Error('No globe container');

const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.z = 1.9;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(isLight ? 0xf5f6f3 : 0x0a0d0a, 1);
container.appendChild(renderer.domElement);

// Earth sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const textureLoader = new THREE.TextureLoader();

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

const earthTexture = loadEarthTexture(isLight);

const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 1,
  metalness: 0,
});

const earth = new THREE.Mesh(geometry, earthMaterial);

// Rotate to face Australia (~133E longitude, ~25S latitude)
// Y rotation = -(longitude in radians) adjusted for texture seam
// X rotation = latitude in radians (negative = south)
earth.rotation.y = -2.32;  // ~133 degrees in radians
earth.rotation.x = 0.44;   // Tilt to show southern hemisphere

scene.add(earth);

// Atmospheric glow
const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64);

function makeGlowMaterial(light) {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: light ? `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.8, 0.9, 0.8, 1.0) * intensity * 0.3;
      }
    ` : `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.22, 0.66, 0.29, 1.0) * intensity * 0.6;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
}

const glowMesh = new THREE.Mesh(glowGeometry, makeGlowMaterial(isLight));
scene.add(glowMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.8 : 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, isLight ? 3.5 : 2.5);
directionalLight.position.set(isLight ? 5 : -5, 3, 5);
scene.add(directionalLight);

const greenLight = new THREE.PointLight(0x39a849, isLight ? 0.3 : 0.8, 10);
greenLight.position.set(2, 1, 3);
scene.add(greenLight);

// Theme update function — called by applyTheme() in main script
function updateGlobeTheme(newIsLight) {
  isLight = newIsLight;

  // Renderer background
  renderer.setClearColor(isLight ? 0xf5f6f3 : 0x0a0d0a, 1);

  // Swap texture
  const oldTexture = earthMaterial.map;
  const newTexture = loadEarthTexture(isLight);
  earthMaterial.map = newTexture;
  earthMaterial.needsUpdate = true;
  if (oldTexture) oldTexture.dispose();

  // Update glow shader (replace material — ShaderMaterial uniforms can't swap fragmentShader at runtime)
  const oldGlowMat = glowMesh.material;
  glowMesh.material = makeGlowMaterial(isLight);
  oldGlowMat.dispose();

  // Update lighting
  ambientLight.intensity = isLight ? 0.8 : 0.6;
  directionalLight.intensity = isLight ? 3.5 : 2.5;
  directionalLight.position.set(isLight ? 5 : -5, 3, 5);
  greenLight.intensity = isLight ? 0.3 : 0.8;
}
window.updateGlobeTheme = updateGlobeTheme;

// Animation loop
const baseDistance = 1.9;
let isVisible = true;

function animate() {
  if (!isVisible) { requestAnimationFrame(animate); return; }
  if (!prefersRM) {
    earth.rotation.y += 0.0008;
    glowMesh.rotation.y += 0.0008;
  }
  const progress = window.__globeScrollProgress || 0;
  const zoomDistance = baseDistance - progress * 0.7;
  camera.position.z = Math.max(zoomDistance, 1.2);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const obs = new IntersectionObserver((entries) => {
  isVisible = entries[0].isIntersecting;
}, { threshold: 0 });
obs.observe(container);

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
```

- [ ] **Step 3: Verify the wiring**

After applying both edits, verify in the file:
- `applyTheme` at line ~1994 ends with `if (window.updateGlobeTheme) window.updateGlobeTheme(theme === 'light');`
- The Three.js module no longer has `const isLightTheme` — it uses `let isLight`
- `window.updateGlobeTheme = updateGlobeTheme;` exists in the module

Use Grep: `pattern: "updateGlobeTheme"` to confirm 3 occurrences (applyTheme call, function definition, window assignment).

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: make Three.js globe reactive to theme toggle via window.updateGlobeTheme"
```

---

### Task 4: Manual visual verification

- [ ] **Step 1: Open the file in a browser**

Open `anywise-v5-redesign.html` locally in Chrome.

- [ ] **Step 2: Check dark mode (default)**

The globe should show the night texture with green glow. The tagline (rotating mono text) should be readable. "ethically engineered." in the hero h1 should show the green gradient clearly.

- [ ] **Step 3: Toggle to light mode**

Click the ☀ button in the nav. Verify:
1. Globe switches to day texture (blue marble), softer glow, lighter background — no stale night view
2. Hero tagline text is clearly legible (dark enough against the light hero gradient)
3. "ethically engineered." shows a deep green gradient with sharp, non-fuzzy edges

- [ ] **Step 4: Toggle back to dark mode**

Click ☾. Verify globe reverts to night texture, tagline returns to white/faint, gradient text returns to bright lime-green.

- [ ] **Step 5: Final commit if any last tweaks were needed**

```bash
git add anywise-v5-redesign.html
git commit -m "fix: light mode visual polish tweaks after manual review"
```
