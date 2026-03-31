# WebGL Lightning + Full-Bleed Earth Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Ken Burns earth hero background with a full-bleed nighttime earth (focused on Australia) overlaid with real-time WebGL lightning shaders and scroll-driven zoom-toward-earth effect.

**Architecture:** Single-file changes to `anywise-v5-redesign.html`. Three composited layers: earth image (z:0), WebGL lightning canvas with transparent background (z:1), dark gradient overlays (z:2), hero content (z:3). Scroll drives earth scale from 1.0→2.5, lightning opacity fade, and content fade.

**Tech Stack:** Vanilla HTML/CSS/JS, WebGL 1 (no libraries), GLSL ES 1.00 fragment shader with FBM noise.

**Spec:** `docs/superpowers/specs/2026-03-25-webgl-lightning-earth-hero-design.md`

---

### Task 1: Update Earth Image CSS — Australia Focus + Scroll Zoom Setup

**Files:**
- Modify: `anywise-v5-redesign.html:303-315` (`.hero-bg img` styles and `@keyframes heroZoom`)

- [ ] **Step 1: Replace `.hero-bg img` styles**

Replace lines 303-315 with:

```css
.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 72% 55%;
  filter: brightness(0.6) saturate(0.8);
  transform-origin: 72% 55%;
  will-change: transform;
  z-index: 0;
  position: relative;
}
```

This removes the Ken Burns animation and `@keyframes heroZoom`, repositions to center on Australia, and adds the dark moody filter. The `transform-origin` ensures scroll zoom converges on Australia.

- [ ] **Step 2: Update `.hero-bg::before` and `::after` z-index**

In `.hero-bg::before` (line 328), change `z-index: 1` to `z-index: 2`.
In `.hero-bg::after` (line 337), change `z-index: 1` to `z-index: 2`.
In `.hero .container` (line 345), change `z-index: 2` to `z-index: 3`.

This makes room for the lightning canvas at z-index 1 and ensures hero content sits above the gradient overlays.

- [ ] **Step 3: Open in browser and verify**

Open `anywise-v5-redesign.html` in browser. Verify:
- Earth image is darker/moodier than before
- Australia/Oceania region is roughly centered
- No Ken Burns zoom animation plays
- Hero text is still legible over the dark overlays

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "style: reposition earth image to focus on Australia, remove Ken Burns animation

Prepare hero background for scroll-driven zoom. Center on Australia (72% 55%),
add moody filter (brightness 0.6, saturation 0.8), update z-index stacking
for upcoming lightning canvas layer.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Add Lightning Canvas HTML + CSS

**Files:**
- Modify: `anywise-v5-redesign.html:303-315` (add CSS after `.hero-bg img`)
- Modify: `anywise-v5-redesign.html:1293-1297` (add canvas element in hero HTML)

- [ ] **Step 1: Add `#lightning-canvas` CSS**

Add after the `.hero-bg img` rule (after step 1's changes):

```css
#lightning-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: transparent;
}
```

- [ ] **Step 2: Add canvas element to hero HTML**

Insert after the `<img>` tag on line 1296, before the closing `</div>` of `.hero-bg`:

```html
    <canvas id="lightning-canvas" aria-hidden="true"></canvas>
```

So the `.hero-bg` section becomes:

```html
  <div class="hero-bg">
    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format" alt="" aria-hidden="true">
    <canvas id="lightning-canvas" aria-hidden="true"></canvas>
  </div>
```

- [ ] **Step 3: Verify in browser**

Open in browser. Canvas should be invisible (transparent, no WebGL yet). Earth image should still display correctly. No visual changes from Task 1.

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: add lightning canvas element and CSS to hero section

Canvas positioned absolute over earth image at z-index 1 with transparent
background. No WebGL rendering yet — just the DOM structure.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Implement WebGL Lightning Shader

**Files:**
- Modify: `anywise-v5-redesign.html:1676+` (add WebGL setup in `<script>` block)

- [ ] **Step 1: Add WebGL initialization and shader code**

Add the following AFTER the existing `const heroSection = document.querySelector('.hero');` line (line 1684) and BEFORE the `window.addEventListener('scroll', ...)` block (line 1686):

```javascript
// ── WEBGL LIGHTNING ──
const lightningCanvas = document.getElementById('lightning-canvas');
let glActive = false;
let animFrameId = null;

function initLightning() {
  if (!lightningCanvas) return;
  const gl = lightningCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) {
    // WebGL not supported — hide canvas, add fallback gradient, earth image still works
    lightningCanvas.style.display = 'none';
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.background = 'radial-gradient(ellipse at 72% 55%, rgba(57,168,73,0.08) 0%, #0a0d0a 60%)';
    return;
  }

  const isMobile = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);

  function resize() {
    const w = lightningCanvas.clientWidth;
    const h = lightningCanvas.clientHeight;
    lightningCanvas.width = w * dpr;
    lightningCanvas.height = h * dpr;
    gl.viewport(0, 0, lightningCanvas.width, lightningCanvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const octaveCount = isMobile ? 6 : 10;

  // Vertex shader
  const vsSource = `
    attribute vec2 aPosition;
    void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
  `;

  // Fragment shader
  const fsSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uHue;
    uniform float uXOffset;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;

    #define OCTAVE_COUNT ${octaveCount}

    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }

    float hash11(float p) {
      p = fract(p * .1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    mat2 rotate2d(float theta) {
      float c = cos(theta);
      float s = sin(theta);
      return mat2(c, -s, s, c);
    }

    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 fp = fract(p);
      float a = hash12(ip);
      float b = hash12(ip + vec2(1.0, 0.0));
      float c = hash12(ip + vec2(0.0, 1.0));
      float d = hash12(ip + vec2(1.0, 1.0));
      vec2 t = smoothstep(0.0, 1.0, fp);
      return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      uv = 2.0 * uv - 1.0;
      uv.x *= iResolution.x / iResolution.y;
      uv.x += uXOffset;

      uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

      float dist = abs(uv.x);
      vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
      float beam = pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
      vec3 col = baseColor * beam;
      float alpha = clamp(beam * 3.0, 0.0, 1.0);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(vsSource, gl.VERTEX_SHADER);
  const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // Fullscreen quad
  const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const uRes = gl.getUniformLocation(program, 'iResolution');
  const uTime = gl.getUniformLocation(program, 'iTime');
  const uHue = gl.getUniformLocation(program, 'uHue');
  const uXOff = gl.getUniformLocation(program, 'uXOffset');
  const uSpd = gl.getUniformLocation(program, 'uSpeed');
  const uInt = gl.getUniformLocation(program, 'uIntensity');
  const uSz = gl.getUniformLocation(program, 'uSize');

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const startTime = performance.now();

  function render() {
    if (!glActive) return;
    gl.viewport(0, 0, lightningCanvas.width, lightningCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, lightningCanvas.width, lightningCanvas.height);
    gl.uniform1f(uTime, (performance.now() - startTime) / 1000.0);
    gl.uniform1f(uHue, 130.0);
    gl.uniform1f(uXOff, 0.0);
    gl.uniform1f(uSpd, 1.2);
    gl.uniform1f(uInt, 0.5);
    gl.uniform1f(uSz, 1.8);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animFrameId = requestAnimationFrame(render);
  }

  // IntersectionObserver to pause/resume rendering
  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !glActive) {
        glActive = true;
        render();
      } else if (!entry.isIntersecting && glActive) {
        glActive = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
      }
    });
  }, { threshold: 0 });
  heroObs.observe(heroSection);
  // IntersectionObserver fires immediately for visible elements — no manual render() call needed
}

initLightning();
```

- [ ] **Step 2: Open in browser and verify**

Open in browser. Verify:
- Green lightning energy beam is visible overlaid on the earth
- Earth image shows through the transparent areas of the canvas
- Lightning animates smoothly (organic FBM movement, flickering)
- No console errors

- [ ] **Step 3: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: implement WebGL lightning shader overlay on hero

GLSL FBM noise shader renders animated green energy beam over earth image.
Uses alpha transparency so earth shows through. 10 octaves desktop, 6 mobile.
IntersectionObserver pauses rendering when hero is off-screen.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Implement Scroll-Driven Zoom + Lightning Fade

**Files:**
- Modify: `anywise-v5-redesign.html:1686-1704` (scroll handler)

- [ ] **Step 1: Replace the hero parallax and fade logic in the scroll handler**

Replace the existing hero parallax block (lines 1695-1704):

```javascript
  // Hero parallax — image moves slower than scroll
  if (heroBgImg && sy < window.innerHeight * 1.2) {
    heroBgImg.style.transform = `scale(${1.08 - sy * 0.00003}) translateY(${sy * 0.3}px)`;
  }

  // Hero content fade on scroll
  if (heroSection && sy < window.innerHeight) {
    const opacity = 1 - (sy / (window.innerHeight * 0.7));
    heroSection.style.setProperty('--hero-fade', Math.max(0, opacity).toFixed(3));
  }
```

With:

```javascript
  // Hero fly-toward-earth zoom + lightning fade
  if (heroSection) {
    const heroH = heroSection.offsetHeight;
    const zoomProgress = Math.min(Math.max(sy / heroH, 0), 1);

    // Earth zoom: 1.0 -> 2.5 desktop, 1.0 -> 2.0 mobile (converges on Australia via transform-origin)
    if (heroBgImg) {
      const maxZoom = window.innerWidth < 768 ? 1.0 : 1.5;
      const scale = 1.0 + zoomProgress * maxZoom;
      heroBgImg.style.transform = `scale(${scale})`;
    }

    // Lightning canvas fade
    if (lightningCanvas) {
      lightningCanvas.style.opacity = Math.max(0, 1 - zoomProgress * 0.8).toFixed(3);
    }

    // Hero content fade (same as before but using zoomProgress for consistency)
    if (sy < window.innerHeight) {
      const opacity = 1 - (sy / (window.innerHeight * 0.7));
      heroSection.style.setProperty('--hero-fade', Math.max(0, opacity).toFixed(3));
    }
  }
```

- [ ] **Step 2: Update the `heroBgImg` variable declaration**

The existing line 1683 already declares `const heroBgImg = document.querySelector('.hero-bg img');`. This still works. No change needed — just verify `lightningCanvas` is declared above (from Task 3).

- [ ] **Step 3: Open in browser and verify scroll behavior**

Open in browser and scroll slowly through the hero section. Verify:
- Earth zooms from 1.0x to ~2.5x as you scroll, converging on Australia
- Lightning beams fade out gradually as you scroll
- Hero text fades out (existing behavior preserved)
- Transition to Capabilities section is smooth — dark gradient blends the zoomed earth into the page background
- Scrolling back up reverses everything smoothly

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "feat: implement scroll-driven earth zoom and lightning fade

As user scrolls, earth scales 1.0->2.5x converging on Australia,
lightning opacity fades to 0.2, hero content fades out. Creates a
'fly toward earth' cinematic effect transitioning to next section.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Add Accessibility and Reduced Motion Support

**Files:**
- Modify: `anywise-v5-redesign.html` (CSS section and JS)

- [ ] **Step 1: Add `prefers-reduced-motion` CSS**

Add after the `#lightning-canvas` CSS rule (from Task 2):

```css
@media (prefers-reduced-motion: reduce) {
  .hero-bg img {
    will-change: auto;
  }
  #lightning-canvas {
    display: none;
  }
}
```

- [ ] **Step 2: Add reduced motion check in JS scroll handler**

Wrap the earth zoom transform in a motion check. Add after the `const heroSection` declaration (line 1684, with the other const declarations):

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Then in the scroll handler's zoom block (Task 4's code), wrap the earth zoom:

```javascript
    // Earth zoom (skip if reduced motion)
    if (heroBgImg && !prefersReducedMotion) {
      const maxZoom = window.innerWidth < 768 ? 1.0 : 1.5;
      const scale = 1.0 + zoomProgress * maxZoom;
      heroBgImg.style.transform = `scale(${scale})`;
    }
```

- [ ] **Step 3: Verify with reduced motion enabled**

In browser DevTools, enable `prefers-reduced-motion: reduce` (Chrome: Rendering panel → Emulate CSS media feature). Verify:
- Lightning canvas is hidden
- Earth does NOT zoom on scroll
- Hero text still fades on scroll (this is subtle enough to keep)
- Page is otherwise fully functional

- [ ] **Step 4: Commit**

```bash
git add anywise-v5-redesign.html
git commit -m "a11y: respect prefers-reduced-motion for lightning and scroll zoom

Hide WebGL canvas and disable scroll-driven earth zoom when user prefers
reduced motion. Hero content fade retained as it's subtle.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Final Polish and Visual Tuning

**Files:**
- Modify: `anywise-v5-redesign.html` (CSS tweaks)

- [ ] **Step 1: Verify full hero experience end-to-end**

Open in browser at full viewport. Scroll through the entire page checking:
- Initial load: earth visible with Australia focus, lightning animating, text entrance plays
- Mid-scroll: earth zooming in, lightning fading, text fading
- Full scroll: earth very zoomed (city lights close-up), dark gradient blends to capabilities section
- Scroll back: everything reverses smoothly
- Mobile viewport (DevTools): earth still looks good, lightning performs acceptably
- No console errors

- [ ] **Step 2: Tune values if needed**

Adjust these CSS/JS values based on visual inspection:
- `object-position: 72% 55%` — fine-tune if Australia isn't centered enough
- `filter: brightness(0.6) saturate(0.8)` — adjust if too dark or too washed out
- `uIntensity: 0.5` — increase to 0.6-0.7 if lightning is too subtle against the earth
- `zoomProgress * 1.5` — adjust multiplier if zoom doesn't feel dramatic enough or is too extreme
- Lightning opacity formula `1 - zoomProgress * 0.8` — adjust 0.8 factor to control fade rate

- [ ] **Step 3: Final commit**

```bash
git add anywise-v5-redesign.html
git commit -m "polish: fine-tune hero WebGL lightning and earth zoom values

Visual tuning pass for earth positioning, lightning intensity, zoom range,
and fade curves.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
