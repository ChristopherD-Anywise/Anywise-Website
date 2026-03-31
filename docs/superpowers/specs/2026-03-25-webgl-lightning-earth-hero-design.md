# WebGL Lightning + Full-Bleed Earth Hero Section

## Goal

Replace the static Unsplash earth background image in the Anywise website hero with a full-bleed nighttime earth image (focused on Australia) overlaid with real-time WebGL shader lightning animation. As the user scrolls, they "fly toward" the earth — it zooms in, hero text fades out, and the next section emerges from below. Defence/government aesthetic, Anywise brand greens.

## Architecture

Three composited layers within the existing `.hero` section, all inside `.hero-bg`:

### Z-Index Stacking (inside `.hero-bg`)

| Element | z-index | Purpose |
|---|---|---|
| `.hero-bg img` | 0 | Full-bleed nighttime earth image |
| `#lightning-canvas` | 1 | WebGL shader lightning overlay (transparent background) |
| `.hero-bg::before` | 2 | Dark gradient overlay for text legibility |
| `.hero-bg::after` | 2 | Green tint at bottom |
| `.hero .container` | 3 | Hero text content |

### Layer 1: Full-Bleed Earth Image

- Existing `<img>` inside `.hero-bg` is **kept** (not removed), but repurposed
- Same Unsplash nighttime earth URL: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format`
- `object-position: 72% 55%` to center the view on Australia/Oceania region
- `filter: brightness(0.6) saturate(0.8)` for moody, dark aesthetic
- Scroll-driven zoom: `transform: scale(S)` where S interpolates from 1.0 to 2.5 as scrollY goes from 0 to hero height
- `transform-origin: 72% 55%` (matching object-position) so the zoom converges on Australia
- `will-change: transform` for GPU-accelerated zoom
- At full zoom (scroll 100%), the earth fills the screen with an up-close view of the Australian region

### Layer 2: WebGL Lightning Canvas

- `<canvas id="lightning-canvas">` added inside `.hero-bg` after the `<img>`
- **Transparent background** — the canvas renders ONLY the lightning beams with transparent black surroundings, so the earth image shows through
- GLSL fragment shader using FBM (Fractional Brownian Motion) noise
- Renders a single animated vertical energy curtain centered on the viewport, flowing downward. Continuous glowing beam with organic distortion.
- Use WebGL 1 context (`canvas.getContext('webgl')`)
- Key difference: `gl_FragColor` alpha channel is used — beam pixels are opaque, surrounding pixels are transparent. This lets the earth show through.
- Shader uniforms:
  - `uHue`: 130 (maps to brand green #39a849)
  - `uXOffset`: 0 (horizontal beam center shift in UV space, 0 = centered)
  - `uSpeed`: 1.2 (time multiplier for movement rate)
  - `uIntensity`: 0.5 (brightness multiplier)
  - `uSize`: 1.8 (UV scale for FBM — controls beam width)
  - `iResolution`: canvas width/height in pixels
  - `iTime`: elapsed seconds since start
- Vanilla WebGL 1 — no dependencies
- Canvas resizes on `window.resize`: update `canvas.width/height` and re-send `iResolution` uniform only. Do NOT reinitialize GL context.
- Render loop via `requestAnimationFrame`, paused when hero is off-screen (IntersectionObserver, threshold: 0)
- Canvas CSS `background: transparent` — no background color needed since earth image is behind

### Layer 3: Hero Content (unchanged)

- Existing `.container` with label, tagline, h1, sub text, CTAs, stats bar
- All existing entrance animations preserved (in-view class triggers)

## Scroll Behavior — "Fly Toward Earth"

Three scroll stages driven by `scrollY` relative to hero section height:

### Stage 1: Initial View (scroll 0%)
- Earth at `scale(1.0)`, full globe visible, centered on Australia
- Lightning beams at full opacity
- Hero text fully visible with entrance animations
- Dark gradient overlay ensures text legibility

### Stage 2: Zooming In (scroll ~50%)
- Earth at `scale(~1.75)`, Australia region enlarging
- Lightning beams fading (opacity ~0.5)
- Hero text fading out (existing `--hero-fade` behavior)

### Stage 3: Transition Out (scroll 100%)
- Earth at `scale(2.5)`, close-up of Australian city lights — almost abstract
- Lightning beams very faint (opacity ~0.2)
- Hero text fully faded
- Dark gradient rising from bottom blends earth into `#0a0d0a` page background
- Next section (Capabilities) emerges below

### Scroll Math (in JS scroll handler)
```
const heroH = heroSection.offsetHeight;
const progress = Math.min(Math.max(scrollY / heroH, 0), 1);

// Earth zoom: 1.0 -> 2.5
const scale = 1.0 + progress * 1.5;
heroImg.style.transform = `scale(${scale})`;

// Lightning fade
lightningCanvas.style.opacity = Math.max(0, 1 - progress * 0.8);

// Hero content fade (existing --hero-fade logic, unchanged)
const heroFade = 1 - (scrollY / (window.innerHeight * 0.7));
heroSection.style.setProperty('--hero-fade', Math.max(0, heroFade).toFixed(3));
```

## Initialization Order

1. WebGL context created and shaders compiled synchronously in `<script>` block at end of body
2. First `requestAnimationFrame` fires, canvas begins rendering
3. After 150ms, `hero.classList.add('in-view')` triggers text entrance animations (existing behavior)
4. Lightning is already rendering before text animates in

## Shader Source (GLSL)

Vertex shader: passthrough (fullscreen quad via 2 triangles).

Fragment shader with **alpha transparency** so earth shows through:

```glsl
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
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

    // Alpha = beam brightness, so surrounding area is transparent
    float alpha = clamp(beam * 3.0, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
}
```

Key change from original: the alpha channel is driven by beam intensity, making surrounding pixels transparent so the earth image shows through.

## File Changes

All changes within `anywise-v5-redesign.html`:

### CSS Changes
- Remove: `@keyframes heroZoom` (replaced by scroll-driven zoom)
- Modify: `.hero-bg img` — remove Ken Burns animation, add `object-position: 72% 55%`, `filter: brightness(0.6) saturate(0.8)`, `transform-origin: 72% 55%`, `will-change: transform`
- Add: `#lightning-canvas` — `position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; background: transparent;`
- Update: `.hero-bg::before` and `::after` z-index to 2

### HTML Changes
- Keep: existing `<img>` inside `.hero-bg` (unchanged URL)
- Add: `<canvas id="lightning-canvas" aria-hidden="true"></canvas>` after the `<img>`

### JS Changes
- Remove: existing `heroBgImg` parallax transform (scale + translateY)
- Add: ~80 lines WebGL shader setup (compile, link, uniform locations, render loop)
- Add: IntersectionObserver (threshold: 0) to pause/resume canvas rendering
- Modify: scroll handler to drive earth zoom (`transform: scale()`), lightning opacity fade, and hero content fade

## Performance

- Single WebGL 1 context, single draw call per frame (2 triangles)
- 10 FBM octaves on desktop; 6 on mobile (`window.innerWidth < 768`) via conditional `#define` in shader string
- Canvas `devicePixelRatio` capped at 1 on mobile, 2 on desktop
- Canvas pauses rendering when hero not visible (IntersectionObserver)
- Earth zoom is GPU-accelerated via `transform: scale()` with `will-change: transform`
- Target: 60fps on modern hardware

## Responsive Behavior

- Earth image fills `.hero-bg` at all viewport sizes via `object-fit: cover`
- `object-position: 72% 55%` keeps Australia centered at all sizes
- Lightning canvas fills `.hero-bg` at all sizes
- On mobile (<768px): shader octave count reduced (6 vs 10), DPR capped at 1
- Zoom range may be reduced on mobile (1.0 to 2.0 instead of 2.5) to avoid excessive cropping

## Accessibility

- `@media (prefers-reduced-motion: reduce)`: pause WebGL render loop (show static first frame), disable scroll zoom (keep earth at scale 1.0)
- Canvas has `aria-hidden="true"` — purely decorative
- Earth image retains empty `alt=""` and `aria-hidden="true"` (existing)

## Fallback

- If `canvas.getContext('webgl')` returns null:
  - Hide canvas element
  - Earth image still displays and zooms on scroll (CSS-only, no WebGL dependency)
  - Fallback CSS gradient on `.hero-bg`: `background: radial-gradient(ellipse at 72% 55%, rgba(57,168,73,0.08) 0%, #0a0d0a 60%)`
  - Result: still a good experience, just without the lightning effect
