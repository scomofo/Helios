import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as Vector3, _ as Object3D, a as Canvas, b as ShaderMaterial, d as ClampToEdgeWrapping, f as Color, g as MathUtils, h as LineBasicMaterial, i as Html, l as BufferGeometry, m as Line$1, n as OrbitControls, o as useFrame, p as Float32BufferAttribute, r as Line, s as useThree, t as Stars, u as CanvasTexture, v as RepeatWrapping, x as Spherical, y as SRGBColorSpace } from "../_libs/@react-three/drei+[...].mjs";
import { a as PLANETS, c as orbitPoints, d as emptyFocusPosition, f as perihelionPosition, i as BODIES, l as spinRate, n as useHelios, o as bodyPosition, r as sim, s as getBody, u as aphelionPosition } from "./routes-Dp39nIA2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/canvas-DRWAgroh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cache = /* @__PURE__ */ new Map();
function hash2(x, y) {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
}
function valueNoise(x, y) {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const xf = x - xi;
	const yf = y - yi;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const a = hash2(xi, yi);
	const b = hash2(xi + 1, yi);
	const c = hash2(xi, yi + 1);
	const d = hash2(xi + 1, yi + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct = 4) {
	let n = 0;
	let a = .5;
	let f = 1;
	let s = 0;
	for (let i = 0; i < oct; i++) {
		n += a * valueNoise(x * f, y * f);
		s += a;
		a *= .5;
		f *= 2;
	}
	return n / s;
}
function clamp01(x) {
	return Math.min(1, Math.max(0, x));
}
function smoothstep(e0, e1, x) {
	const t = clamp01(e1 - e0 === 0 ? 0 : (x - e0) / (e1 - e0));
	return t * t * (3 - 2 * t);
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function mix3(a, b, t) {
	return [
		lerp(a[0], b[0], t),
		lerp(a[1], b[1], t),
		lerp(a[2], b[2], t)
	];
}
function toTexture(canvas, wrapS = RepeatWrapping) {
	const tex = new CanvasTexture(canvas);
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 4;
	tex.wrapS = wrapS;
	tex.wrapT = ClampToEdgeWrapping;
	tex.needsUpdate = true;
	return tex;
}
function paint(w, h, fn, alphaFn) {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	const img = ctx.createImageData(w, h);
	const d = img.data;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const u = x / w;
		const v = y / h;
		const [r, g, b] = fn(u, v);
		const i = (y * w + x) * 4;
		d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;
		d[i + 3] = alphaFn ? Math.round(clamp01(alphaFn(u, v)) * 255) : 255;
	}
	ctx.putImageData(img, 0, 0);
	return toTexture(canvas);
}
function blob(u, v, cx, cy, sx, sy) {
	const dx = (u - cx) / sx;
	const dy = (v - cy) / sy;
	return Math.exp(-(dx * dx + dy * dy));
}
function mercury(u, v) {
	const n = fbm(u * 14, v * 8, 5);
	const crater = Math.pow(Math.max(0, .58 - fbm(u * 28, v * 16, 3)), 2);
	const c = 78 + n * 95 - crater * 55;
	return [
		c + n * 18,
		c + 4,
		c - 6
	];
}
function venus(u, v) {
	const warp = fbm(u * 3, v * 2, 3);
	const n = fbm(u * 6 + warp * 2.2, v * 10, 4);
	const swirl = fbm(u * 10 + n, v * 14, 3);
	return mix3(mix3([
		176,
		142,
		96
	], [
		214,
		196,
		158
	], n), [
		236,
		224,
		198
	], smoothstep(.45, .8, swirl));
}
function earth(u, v) {
	const lat = v * 2 - 1;
	const warp = fbm(u * 4, v * 3, 3);
	const n = fbm(u * 7 + warp * 1.4, v * 10, 5);
	const landMask = n * .62 + blob(u, v, .18, .48, .09, .16) * .55 + blob(u, v, .52, .5, .11, .2) * .7 + blob(u, v, .58, .68, .08, .1) * .45 + blob(u, v, .82, .42, .1, .14) * .5 + blob(u, v, .88, .62, .07, .08) * .35;
	const land = landMask > .58;
	const ice = smoothstep(.68, .88, Math.abs(lat));
	const oceanDeep = [
		10,
		38,
		86
	];
	const ocean = [
		24,
		86,
		152
	];
	const coast = [
		28,
		110,
		132
	];
	const grass = [
		58,
		108,
		56
	];
	const dirt = [
		118,
		96,
		58
	];
	const polar = [
		236,
		241,
		246
	];
	let col;
	if (land) col = mix3(grass, dirt, smoothstep(.58, .78, n));
	else {
		col = mix3(oceanDeep, ocean, n);
		if (landMask > .5) col = mix3(col, coast, .45);
	}
	return mix3(col, polar, ice);
}
function mars(u, v) {
	const lat = v * 2 - 1;
	const n = fbm(u * 10, v * 8, 5);
	const dark = fbm(u * 18, v * 12, 3);
	const rust = [
		168,
		78,
		48
	];
	const dust = [
		198,
		118,
		72
	];
	const basalt = [
		92,
		48,
		36
	];
	const ice = [
		232,
		228,
		220
	];
	let col = mix3(rust, dust, n);
	col = mix3(col, basalt, smoothstep(.62, .85, dark));
	const cap = smoothstep(.72, .9, Math.abs(lat));
	return mix3(col, ice, cap);
}
function banded(u, v, palette, freq, warpAmt) {
	const warp = fbm(u * 3, v * 2, 3) * warpAmt;
	const y = v * freq + warp;
	const t = (Math.sin(y * Math.PI * 2) * .5 + .5) * (palette.length - 1);
	const i = Math.floor(t);
	const f = t - i;
	const a = palette[Math.min(i, palette.length - 1)];
	const b = palette[Math.min(i + 1, palette.length - 1)];
	const storm = fbm(u * 12, v * 10, 3);
	return mix3(mix3(a, b, f), a, storm * .18);
}
function jupiter(u, v) {
	let col = banded(u, v, [
		[
			196,
			148,
			96
		],
		[
			232,
			210,
			170
		],
		[
			176,
			116,
			70
		],
		[
			240,
			220,
			186
		],
		[
			164,
			96,
			62
		],
		[
			214,
			176,
			122
		]
	], 7.5, 1.4);
	const dx = (u - .34) / .07;
	const dy = (v - .6) / .045;
	return mix3(col, [
		176,
		64,
		42
	], Math.exp(-(dx * dx + dy * dy)) * .85);
}
function saturn(u, v) {
	return banded(u, v, [
		[
			214,
			186,
			132
		],
		[
			236,
			216,
			168
		],
		[
			198,
			166,
			112
		],
		[
			242,
			226,
			186
		],
		[
			186,
			154,
			104
		]
	], 6.2, .7);
}
function uranus(u, v) {
	const n = fbm(u * 6, v * 8, 3);
	const band = .5 + .5 * Math.sin(v * Math.PI * 8 + n);
	return mix3(mix3([
		142,
		204,
		210
	], [
		176,
		224,
		226
	], n), [
		118,
		186,
		196
	], band * .25);
}
function neptune(u, v) {
	const n = fbm(u * 7, v * 8, 4);
	const deep = [
		28,
		70,
		156
	];
	const mid = [
		52,
		108,
		196
	];
	const haze = [
		96,
		150,
		220
	];
	let col = mix3(deep, mid, n);
	col = mix3(col, haze, fbm(u * 4, v * 3, 3) * .35);
	const dx = (u - .62) / .08;
	const dy = (v - .42) / .05;
	const spot = Math.exp(-(dx * dx + dy * dy));
	return mix3(col, [
		16,
		40,
		92
	], spot * .7);
}
var painters = {
	mercury,
	venus,
	earth,
	mars,
	jupiter,
	saturn,
	uranus,
	neptune
};
function planetTexture(id) {
	const hit = cache.get(id);
	if (hit) return hit;
	const hiRes = id === "earth" || id === "jupiter" || id === "saturn";
	const tex = paint(hiRes ? 512 : 384, hiRes ? 256 : 192, painters[id]);
	cache.set(id, tex);
	return tex;
}
function cloudTexture() {
	const hit = cache.get("clouds");
	if (hit) return hit;
	const tex = paint(512, 256, () => [
		244,
		248,
		252
	], (u, v) => {
		const n = fbm(u * 8, v * 12, 5);
		return Math.max(0, (n - .5) * 2.1);
	});
	cache.set("clouds", tex);
	return tex;
}
function ringTexture(kind) {
	const key = `ring-${kind}`;
	const hit = cache.get(key);
	if (hit) return hit;
	const w = 1024;
	const h = 48;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	const img = ctx.createImageData(w, h);
	const d = img.data;
	for (let x = 0; x < w; x++) {
		const u = x / w;
		let a = 0;
		if (u > .04 && u < .98) {
			a = .12 + (.45 + .55 * Math.abs(Math.sin(u * 70 + fbm(u * 20, .2, 3) * 4))) * (kind === "gold" ? .55 : .28);
			if (kind === "gold" && u > .46 && u < .53) a *= .12;
		}
		const rgb = kind === "gold" ? [
			214,
			192,
			148
		] : [
			190,
			210,
			220
		];
		for (let y = 0; y < h; y++) {
			const i = (y * w + x) * 4;
			d[i] = rgb[0];
			d[i + 1] = rgb[1];
			d[i + 2] = rgb[2];
			d[i + 3] = Math.round(a * 255);
		}
	}
	ctx.putImageData(img, 0, 0);
	const tex = toTexture(canvas, ClampToEdgeWrapping);
	cache.set(key, tex);
	return tex;
}
function glowTexture() {
	const hit = cache.get("glow");
	if (hit) return hit;
	const s = 256;
	const canvas = document.createElement("canvas");
	canvas.width = s;
	canvas.height = s;
	const ctx = canvas.getContext("2d");
	const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
	g.addColorStop(0, "rgba(255, 228, 160, 0.95)");
	g.addColorStop(.16, "rgba(255, 176, 70, 0.42)");
	g.addColorStop(.4, "rgba(255, 120, 36, 0.1)");
	g.addColorStop(1, "rgba(0, 0, 0, 0)");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, s, s);
	const tex = new CanvasTexture(canvas);
	tex.colorSpace = SRGBColorSpace;
	cache.set("glow", tex);
	return tex;
}
var _from = new Vector3();
var _to = new Vector3();
var _offset = new Vector3();
var _sph = new Spherical();
function SimTicker() {
	useFrame((_, dt) => {
		const { paused, speed } = useHelios.getState();
		sim.tick(Math.min(dt, .1), speed, paused);
	}, -1);
	return null;
}
function SystemAnchor({ children }) {
	const group = (0, import_react.useRef)(null);
	const focusedId = useHelios((s) => s.focusedId);
	const prevId = (0, import_react.useRef)(focusedId);
	const blend = (0, import_react.useRef)(1);
	(0, import_react.useEffect)(() => {
		if (focusedId !== prevId.current) blend.current = 0;
	}, [focusedId]);
	useFrame((_, dt) => {
		const g = group.current;
		if (!g) return;
		const d = Math.min(dt, .1);
		if (blend.current < 1) {
			blend.current = Math.min(1, blend.current + d / 1.15);
			if (blend.current >= 1) prevId.current = focusedId;
		}
		bodyPosition(getBody(prevId.current), sim.time, _from);
		bodyPosition(getBody(focusedId), sim.time, _to);
		const t = blend.current * blend.current * (3 - 2 * blend.current);
		_offset.lerpVectors(_from, _to, t);
		g.position.copy(_offset).negate();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		children
	});
}
function CameraZoom() {
	const focusedId = useHelios((s) => s.focusedId);
	const { camera } = useThree();
	const animating = (0, import_react.useRef)(false);
	const targetR = (0, import_react.useRef)(getBody("sun").focusDistance);
	(0, import_react.useEffect)(() => {
		targetR.current = getBody(focusedId).focusDistance;
		animating.current = true;
	}, [focusedId]);
	useFrame((_, dt) => {
		if (!animating.current) return;
		const d = Math.min(dt, .1);
		_sph.setFromVector3(camera.position);
		const next = MathUtils.damp(_sph.radius, targetR.current, 2.4, d);
		_sph.radius = Math.max(2.4, next);
		camera.position.setFromSpherical(_sph);
		if (Math.abs(_sph.radius - targetR.current) < .08) animating.current = false;
	}, 1);
	return null;
}
var SUN_VERT = `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
var SUN_FRAG = `
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  void main() {
    float n = 0.0;
    n += noise(vPos * 0.55 + vec3(uTime * 0.11, 0.0, uTime * 0.07));
    n += 0.5 * noise(vPos * 1.3 - vec3(uTime * 0.09));
    n += 0.25 * noise(vPos * 3.2 + uTime * 0.16);
    vec3 dark = vec3(0.78, 0.26, 0.04);
    vec3 mid = vec3(1.0, 0.58, 0.12);
    vec3 hot = vec3(1.0, 0.93, 0.62);
    vec3 col = mix(dark, mid, smoothstep(0.22, 0.62, n));
    col = mix(col, hot, smoothstep(0.55, 0.92, n));
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
    col += vec3(1.0, 0.7, 0.25) * rim * 0.25;
    gl_FragColor = vec4(col * (1.12 + n * 0.35), 1.0);
  }
`;
function Sun() {
	const mesh = (0, import_react.useRef)(null);
	const mat = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: { uTime: { value: 0 } },
		vertexShader: SUN_VERT,
		fragmentShader: SUN_FRAG
	}), []);
	const glow = (0, import_react.useMemo)(() => glowTexture(), []);
	const sun = BODIES.sun;
	const t = (0, import_react.useRef)(0);
	useFrame((_, dt) => {
		const { paused, speed } = useHelios.getState();
		if (!paused) t.current += Math.min(dt, .1) * Math.min(speed, 3);
		mat.uniforms.uTime.value = t.current;
		if (mesh.current) mesh.current.rotation.y += spinRate(sun) * (paused ? 0 : Math.min(dt, .1) * Math.min(speed, 2));
	});
	(0, import_react.useEffect)(() => () => {
		mat.dispose();
	}, [mat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			ref: mesh,
			material: mat,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				sun.radius,
				64,
				48
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
			scale: [
				18.5,
				18.5,
				1
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
				map: glow,
				transparent: true,
				blending: 2,
				depthWrite: false,
				opacity: .7
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
			scale: [
				32,
				32,
				1
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
				map: glow,
				transparent: true,
				blending: 2,
				depthWrite: false,
				opacity: .28
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			color: "#ffd8a0",
			intensity: 95,
			distance: 260,
			decay: 1.6
		})
	] });
}
function Atmosphere({ radius, color }) {
	const mat = (0, import_react.useMemo)(() => {
		const c = new Color(color);
		return new ShaderMaterial({
			uniforms: { uColor: { value: c } },
			transparent: true,
			blending: 2,
			side: 1,
			depthWrite: false,
			vertexShader: `
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }
      `,
			fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vW);
          float f = pow(1.0 - abs(dot(viewDir, normalize(vN))), 2.6);
          gl_FragColor = vec4(uColor, f * 0.55);
        }
      `
		});
	}, [color]);
	(0, import_react.useEffect)(() => () => {
		mat.dispose();
	}, [mat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		material: mat,
		scale: 1.18,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			radius,
			32,
			24
		] })
	});
}
function Moon({ def }) {
	const ref = (0, import_react.useRef)(null);
	useFrame(() => {
		const g = ref.current;
		if (!g) return;
		const a = sim.time / def.periodDays * Math.PI * 2;
		g.position.set(Math.cos(a) * def.orbitRadius, Math.sin(a) * .18, Math.sin(a) * def.orbitRadius);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			def.radius,
			16,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: def.color,
			roughness: .92,
			metalness: .02
		})] })
	});
}
function PlanetLabel({ body }) {
	const ref = (0, import_react.useRef)(null);
	useFrame(({ camera }) => {
		const el = ref.current;
		if (!el) return;
		const { showLabels, focusedId } = useHelios.getState();
		const close = camera.position.length() < body.radius * 8;
		const on = showLabels && focusedId !== body.id && !close;
		el.style.opacity = on ? "1" : "0";
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		center: true,
		sprite: true,
		pointerEvents: "none",
		position: [
			0,
			body.radius + .7,
			0
		],
		zIndexRange: [8, 0],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "planet-label",
			children: body.name
		})
	});
}
function Planet({ body }) {
	const group = (0, import_react.useRef)(null);
	const globe = (0, import_react.useRef)(null);
	const clouds = (0, import_react.useRef)(null);
	const pos = (0, import_react.useMemo)(() => new Vector3(), []);
	const map = (0, import_react.useMemo)(() => planetTexture(body.id), [body.id]);
	const cloudsMap = (0, import_react.useMemo)(() => body.clouds ? cloudTexture() : null, [body.clouds]);
	const ringMap = (0, import_react.useMemo)(() => {
		if (!body.rings) return null;
		return ringTexture(body.id === "saturn" ? "gold" : "ice");
	}, [body.rings, body.id]);
	const setFocused = useHelios((s) => s.setFocused);
	const segs = body.kind === "terrestrial" ? 32 : 48;
	useFrame((_, dt) => {
		const g = group.current;
		if (!g) return;
		bodyPosition(body, sim.time, pos);
		g.position.copy(pos);
		const { paused, speed } = useHelios.getState();
		const spin = paused ? 0 : Math.min(dt, .1) * speed;
		if (globe.current) globe.current.rotation.y += spinRate(body) * spin;
		if (clouds.current) clouds.current.rotation.y += spinRate(body) * spin * 1.18;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				rotation: [
					0,
					0,
					body.tilt
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					ref: globe,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						onClick: (e) => {
							e.stopPropagation();
							setFocused(body.id);
						},
						onPointerOver: (e) => {
							e.stopPropagation();
							document.body.style.cursor = "pointer";
						},
						onPointerOut: () => {
							document.body.style.cursor = "auto";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							body.radius,
							segs,
							segs - 8
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							map,
							roughness: .68,
							metalness: .04
						})]
					}), body.clouds && cloudsMap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						ref: clouds,
						scale: 1.015,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							body.radius,
							32,
							24
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							map: cloudsMap,
							transparent: true,
							opacity: .55,
							depthWrite: false,
							roughness: 1,
							metalness: 0
						})]
					}) : null]
				}), body.rings && ringMap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
						body.rings.inner,
						body.rings.outer,
						96
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: ringMap,
						transparent: true,
						side: 2,
						depthWrite: false,
						roughness: .6,
						metalness: .12
					})]
				}) : null]
			}),
			body.atmosphere ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {
				radius: body.radius,
				color: body.atmosphere
			}) : null,
			body.moons?.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { def: m }, m.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanetLabel, { body })
		]
	});
}
function OrbitPaths() {
	const focusedId = useHelios((s) => s.focusedId);
	const showTrails = useHelios((s) => s.showTrails);
	const curves = (0, import_react.useMemo)(() => PLANETS.map((body) => ({
		body,
		points: orbitPoints(body, 180)
	})), []);
	if (!showTrails) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: curves.map(({ body, points }) => {
		const focused = body.id === focusedId;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
			points,
			color: body.color,
			lineWidth: focused ? 1.4 : .7,
			transparent: true,
			opacity: focused ? .55 : .2
		}, body.id);
	}) });
}
function MotionTrail({ body }) {
	const n = 56;
	const positions = (0, import_react.useMemo)(() => /* @__PURE__ */ new Float32Array(168), []);
	const geom = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(positions, 3));
		return g;
	}, [positions]);
	const line = (0, import_react.useMemo)(() => {
		const mat = new LineBasicMaterial({
			color: body.color,
			transparent: true,
			opacity: .42,
			depthWrite: false
		});
		const l = new Line$1(geom, mat);
		l.frustumCulled = false;
		return l;
	}, [geom, body.color]);
	const tmp = (0, import_react.useMemo)(() => new Vector3(), []);
	const primed = (0, import_react.useRef)(false);
	useFrame(() => {
		if (!useHelios.getState().showTrails) return;
		if (useHelios.getState().paused && primed.current) return;
		bodyPosition(body, sim.time, tmp);
		if (!primed.current) {
			for (let i = 0; i < n; i++) {
				positions[i * 3] = tmp.x;
				positions[i * 3 + 1] = tmp.y;
				positions[i * 3 + 2] = tmp.z;
			}
			primed.current = true;
		} else {
			positions.copyWithin(0, 3);
			positions[165] = tmp.x;
			positions[166] = tmp.y;
			positions[167] = tmp.z;
		}
		const attr = geom.getAttribute("position");
		attr.needsUpdate = true;
	});
	(0, import_react.useEffect)(() => () => {
		geom.dispose();
		line.material.dispose();
	}, [geom, line]);
	const visible = useHelios((s) => s.showTrails);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
		object: line,
		visible
	});
}
function AsteroidBelt() {
	const mesh = (0, import_react.useRef)(null);
	const count = 640;
	const seeded = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const inst = mesh.current;
		if (!inst || seeded.current) return;
		seeded.current = true;
		const dummy = new Object3D();
		for (let i = 0; i < count; i++) {
			const a = Math.random() * Math.PI * 2;
			const r = 33.2 + Math.random() * 5.4;
			dummy.position.set(Math.cos(a) * r, (Math.random() - .5) * .7, Math.sin(a) * r);
			dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
			dummy.scale.setScalar(.018 + Math.random() * .055);
			dummy.updateMatrix();
			inst.setMatrixAt(i, dummy.matrix);
		}
		inst.instanceMatrix.needsUpdate = true;
	}, [count]);
	useFrame((_, dt) => {
		const inst = mesh.current;
		if (!inst) return;
		const { paused, speed } = useHelios.getState();
		if (!paused) inst.rotation.y += Math.min(dt, .1) * speed * .012;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			count
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [1, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#8a8176",
			roughness: .92,
			metalness: .05
		})]
	});
}
function FocusHalo() {
	const mesh = (0, import_react.useRef)(null);
	useFrame(() => {
		const m = mesh.current;
		if (!m) return;
		const body = getBody(useHelios.getState().focusedId);
		const r = Math.max(.35, body.radius * 1.42);
		m.scale.setScalar(r);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: mesh,
		rotation: [
			Math.PI / 2,
			0,
			0
		],
		renderOrder: 2,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
			1,
			1.028,
			80
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#c9d0da",
			transparent: true,
			opacity: .5,
			side: 2,
			depthWrite: false
		})]
	});
}
function CursorReset() {
	(0, import_react.useEffect)(() => () => {
		document.body.style.cursor = "auto";
	}, []);
	return null;
}
var SWEEP_STEPS = 22;
var _peri = new Vector3();
var _aph = new Vector3();
var _focus = new Vector3();
var _here = new Vector3();
function SweepWedge({ body }) {
	const mesh = (0, import_react.useRef)(null);
	const positions = (0, import_react.useMemo)(() => /* @__PURE__ */ new Float32Array(72), []);
	const geom = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const index = [];
		for (let i = 1; i < 23; i++) index.push(0, i, i + 1);
		g.setAttribute("position", new Float32BufferAttribute(positions, 3));
		g.setIndex(index);
		return g;
	}, [positions]);
	useFrame(({ camera }) => {
		const m = mesh.current;
		if (!m) return;
		const close = camera.position.length() < Math.max(10, body.focusDistance * 1.6);
		m.visible = !close;
		if (close) return;
		const dt = body.periodYears * 365.25 / 10;
		const t = sim.time;
		positions[0] = 0;
		positions[1] = 0;
		positions[2] = 0;
		for (let i = 0; i <= SWEEP_STEPS; i++) {
			bodyPosition(body, t - dt + dt * i / SWEEP_STEPS, _here);
			const o = (i + 1) * 3;
			positions[o] = _here.x;
			positions[o + 1] = _here.y;
			positions[o + 2] = _here.z;
		}
		const attr = geom.getAttribute("position");
		attr.needsUpdate = true;
	});
	(0, import_react.useEffect)(() => () => {
		geom.dispose();
	}, [geom]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		ref: mesh,
		geometry: geom,
		renderOrder: 1,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: body.color,
			transparent: true,
			opacity: .16,
			side: 2,
			depthWrite: false
		})
	});
}
function RadiusVector({ body }) {
	const positions = (0, import_react.useMemo)(() => /* @__PURE__ */ new Float32Array(6), []);
	const geom = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(positions, 3));
		return g;
	}, [positions]);
	const line = (0, import_react.useMemo)(() => {
		const mat = new LineBasicMaterial({
			color: body.color,
			transparent: true,
			opacity: .7,
			depthWrite: false
		});
		const l = new Line$1(geom, mat);
		l.frustumCulled = false;
		return l;
	}, [geom, body.color]);
	useFrame(() => {
		bodyPosition(body, sim.time, _here);
		positions[3] = _here.x;
		positions[4] = _here.y;
		positions[5] = _here.z;
		geom.getAttribute("position").needsUpdate = true;
	});
	(0, import_react.useEffect)(() => () => {
		geom.dispose();
		line.material.dispose();
	}, [geom, line]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: line });
}
function Apsides({ body }) {
	perihelionPosition(body, _peri);
	aphelionPosition(body, _aph);
	emptyFocusPosition(body, _focus);
	const s = Math.max(.12, body.radius * .22);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: _peri.toArray(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [s, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: body.color })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: _aph.toArray(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [s * .75, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: body.color,
				transparent: true,
				opacity: .45
			})]
		}),
		body.eccentricity > .02 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: _focus.toArray(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				s * .55,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#c9d0da",
				transparent: true,
				opacity: .4
			})]
		}) : null
	] });
}
function KeplerGuide() {
	const focusedId = useHelios((s) => s.focusedId);
	if (focusedId === "sun") return null;
	const body = getBody(focusedId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SweepWedge, { body }, `sweep-${body.id}`),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadiusVector, { body }, `radius-${body.id}`),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apsides, { body }, `apsides-${body.id}`)
	] });
}
function Scene() {
	const controlsRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimTicker, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CursorReset, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#06070b"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .07 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#1c2436",
			"#07080c",
			.22
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
			radius: 280,
			depth: 90,
			count: 5e3,
			factor: 2.6,
			saturation: .04,
			fade: true,
			speed: .12
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SystemAnchor, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitPaths, {}),
			PLANETS.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionTrail, { body }, `trail-${body.id}`)),
			PLANETS.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Planet, { body }, body.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AsteroidBelt, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeplerGuide, {})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusHalo, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraZoom, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			ref: controlsRef,
			makeDefault: true,
			enableDamping: true,
			dampingFactor: .08,
			enablePan: false,
			minDistance: 2.6,
			maxDistance: 220,
			zoomSpeed: .75,
			rotateSpeed: .72
		})
	] });
}
function SolarCanvas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 touch-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			camera: {
				position: [
					0,
					34,
					90
				],
				fov: 42,
				near: .12,
				far: 1200
			},
			dpr: [1, 1.75],
			gl: {
				antialias: true,
				alpha: false,
				powerPreference: "high-performance",
				toneMapping: 4,
				toneMappingExposure: 1.05
			},
			onCreated: ({ gl }) => {
				gl.setClearColor("#06070b", 1);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
		})
	});
}
//#endregion
export { SolarCanvas };
