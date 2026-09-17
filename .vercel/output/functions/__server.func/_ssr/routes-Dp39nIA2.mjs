import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Orbit, i as Pause, n as RotateCcw, o as Captions, r as Play } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dp39nIA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var TWO_PI = Math.PI * 2;
function wrapPi(angle) {
	const t = (angle + Math.PI) / TWO_PI;
	return (t - Math.floor(t)) * TWO_PI - Math.PI;
}
/** Newton–Raphson solution of Kepler's equation M = E − e sin E. */
function solveKepler(meanAnomaly, e) {
	const M = wrapPi(meanAnomaly);
	let E = e < .8 ? M : Math.PI * Math.sign(M || 1);
	for (let i = 0; i < 10; i++) {
		const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
		E -= dE;
		if (Math.abs(dE) < 1e-9) break;
	}
	return E;
}
function meanMotion(body) {
	if (body.periodYears <= 0) return 0;
	return TWO_PI / (body.periodYears * 365.25);
}
function eccentricAnomalyAt(body, timeDays) {
	return solveKepler(meanMotion(body) * timeDays + body.meanAnomaly0, body.eccentricity);
}
/**
* Perifocal (x along periapsis, y in the orbital plane) → three.js Y-up world.
* Sun sits at the occupied focus (the origin).
*/
function perifocalToWorld(body, xp, yp, out) {
	const cosw = Math.cos(body.argPeriapsis);
	const sinw = Math.sin(body.argPeriapsis);
	const xN = cosw * xp - sinw * yp;
	const yN = sinw * xp + cosw * yp;
	const cosi = Math.cos(body.inclination);
	const sini = Math.sin(body.inclination);
	const cosO = Math.cos(body.longNode);
	const sinO = Math.sin(body.longNode);
	out.x = cosO * xN - sinO * yN * cosi;
	out.y = yN * sini;
	out.z = sinO * xN + cosO * yN * cosi;
	return out;
}
function positionFromE(body, E, out) {
	const a = body.orbitRadius;
	const e = body.eccentricity;
	return perifocalToWorld(body, a * (Math.cos(E) - e), a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E), out);
}
function bodyPosition$1(body, timeDays, out) {
	if (body.orbitRadius === 0) {
		out.x = 0;
		out.y = 0;
		out.z = 0;
		return out;
	}
	return positionFromE(body, eccentricAnomalyAt(body, timeDays), out);
}
function orbitPoints$1(body, segments = 180) {
	const pts = [];
	const tmp = {
		x: 0,
		y: 0,
		z: 0
	};
	for (let i = 0; i <= segments; i++) {
		positionFromE(body, i / segments * TWO_PI, tmp);
		pts.push([
			tmp.x,
			tmp.y,
			tmp.z
		]);
	}
	return pts;
}
function perihelionPosition(body, out) {
	return positionFromE(body, 0, out);
}
function aphelionPosition(body, out) {
	return positionFromE(body, Math.PI, out);
}
/** Vacant focus, opposite the Sun through the ellipse centre. */
function emptyFocusPosition(body, out) {
	const a = body.orbitRadius;
	const e = body.eccentricity;
	return perifocalToWorld(body, -2 * a * e, 0, out);
}
function keplerLive(body, timeDays) {
	const e = body.eccentricity;
	const a = body.au;
	const E = eccentricAnomalyAt(body, timeDays);
	const rNorm = 1 - e * Math.cos(E);
	const radiusAu = a * rNorm;
	const speedRatio = Math.sqrt(Math.max(0, 2 / rNorm - 1));
	const trueAnomaly = Math.atan2(Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E), Math.cos(E) - e);
	const thirdLaw = a > 0 && body.periodYears > 0 ? body.periodYears * body.periodYears / (a * a * a) : 1;
	return {
		radiusAu,
		perihelionAu: a * (1 - e),
		aphelionAu: a * (1 + e),
		eccentricity: e,
		speedRatio,
		thirdLaw,
		trueAnomalyDeg: (trueAnomaly * 180 / Math.PI + 360) % 360
	};
}
var DEG = Math.PI / 180;
var BODY_ORDER = [
	"sun",
	"mercury",
	"venus",
	"earth",
	"mars",
	"jupiter",
	"saturn",
	"uranus",
	"neptune"
];
var BODIES = {
	sun: {
		id: "sun",
		name: "Sun",
		kind: "star",
		radius: 4.6,
		orbitRadius: 0,
		periodYears: 0,
		eccentricity: 0,
		inclination: 0,
		longNode: 0,
		argPeriapsis: 0,
		meanAnomaly0: 0,
		tilt: 7.25 * DEG,
		dayHours: 609.12,
		color: "#f3c15b",
		focusDistance: 98,
		au: 0,
		diameterKm: 1392700,
		gravity: "28 g",
		moonsCount: 0,
		yearLabel: "—",
		dayLabel: "25.4 d",
		summary: "The occupied focus of every Keplerian ellipse here. From this point each planet sweeps equal area in equal time, and P² scales with a³."
	},
	mercury: {
		id: "mercury",
		name: "Mercury",
		kind: "terrestrial",
		radius: .38,
		orbitRadius: 11.6,
		periodYears: .241,
		eccentricity: .2056,
		inclination: 7 * DEG,
		longNode: 48.33 * DEG,
		argPeriapsis: 29.12 * DEG,
		meanAnomaly0: 174.8 * DEG,
		tilt: .03 * DEG,
		dayHours: 1407.6,
		color: "#9a9086",
		focusDistance: 3.6,
		au: .387,
		diameterKm: 4879,
		gravity: "0.38 g",
		moonsCount: 0,
		yearLabel: "88.0 d",
		dayLabel: "58.6 d",
		summary: "The textbook Keplerian. Eccentricity 0.206 pulls perihelion in so far that the planet more than doubles its speed between aphelion and perihelion."
	},
	venus: {
		id: "venus",
		name: "Venus",
		kind: "terrestrial",
		radius: .72,
		orbitRadius: 16.2,
		periodYears: .615,
		eccentricity: .0068,
		inclination: 3.39 * DEG,
		longNode: 76.68 * DEG,
		argPeriapsis: 54.89 * DEG,
		meanAnomaly0: 50.42 * DEG,
		tilt: 2.6 * DEG,
		dayHours: -5832.5,
		color: "#d9c3a1",
		atmosphere: "#e8d7b0",
		focusDistance: 5.2,
		au: .723,
		diameterKm: 12104,
		gravity: "0.91 g",
		moonsCount: 0,
		yearLabel: "225 d",
		dayLabel: "243 d ↩",
		summary: "Earth’s veiled twin, and the roundest orbit in the system — eccentricity 0.007, a near-perfect circle with the Sun still at a focus."
	},
	earth: {
		id: "earth",
		name: "Earth",
		kind: "terrestrial",
		radius: .78,
		orbitRadius: 21.6,
		periodYears: 1,
		eccentricity: .0167,
		inclination: 0,
		longNode: 0,
		argPeriapsis: 102.94 * DEG,
		meanAnomaly0: -2.48 * DEG,
		tilt: 23.44 * DEG,
		dayHours: 23.93,
		color: "#3f7ec4",
		atmosphere: "#7eb6ff",
		clouds: true,
		moons: [{
			name: "Moon",
			radius: .21,
			orbitRadius: 2.35,
			periodDays: 27.3,
			color: "#c5c1b8"
		}],
		focusDistance: 6.2,
		au: 1,
		diameterKm: 12742,
		gravity: "1.00 g",
		moonsCount: 1,
		yearLabel: "365.25 d",
		dayLabel: "23h 56m",
		summary: "The measuring stick of Kepler’s third law: one year, one astronomical unit. A slight 0.017 eccentricity writes the 3% perihelion–aphelion swing."
	},
	mars: {
		id: "mars",
		name: "Mars",
		kind: "terrestrial",
		radius: .5,
		orbitRadius: 28.6,
		periodYears: 1.881,
		eccentricity: .0934,
		inclination: 1.85 * DEG,
		longNode: 49.56 * DEG,
		argPeriapsis: 286.5 * DEG,
		meanAnomaly0: 19.39 * DEG,
		tilt: 25.19 * DEG,
		dayHours: 24.62,
		color: "#c16a4a",
		atmosphere: "#e0a080",
		focusDistance: 4.5,
		au: 1.524,
		diameterKm: 6779,
		gravity: "0.38 g",
		moonsCount: 2,
		yearLabel: "687 d",
		dayLabel: "24h 37m",
		summary: "The orbit Kepler actually solved. Eccentricity 0.093 is enough that equal-area wedges fatten visibly at perihelion — the second law, in motion."
	},
	jupiter: {
		id: "jupiter",
		name: "Jupiter",
		kind: "gas-giant",
		radius: 2.35,
		orbitRadius: 44.2,
		periodYears: 11.86,
		eccentricity: .0489,
		inclination: 1.3 * DEG,
		longNode: 100.46 * DEG,
		argPeriapsis: 273.87 * DEG,
		meanAnomaly0: 20.07 * DEG,
		tilt: 3.13 * DEG,
		dayHours: 9.93,
		color: "#d0a36a",
		atmosphere: "#e8c48a",
		focusDistance: 13.5,
		au: 5.203,
		diameterKm: 139820,
		gravity: "2.53 g",
		moonsCount: 95,
		yearLabel: "11.86 yr",
		dayLabel: "9h 56m",
		summary: "a = 5.2 AU, P = 11.86 yr. Cube the axis, square the period — Kepler III holds to three figures, even this far from the Sun."
	},
	saturn: {
		id: "saturn",
		name: "Saturn",
		kind: "gas-giant",
		radius: 1.95,
		orbitRadius: 58.4,
		periodYears: 29.46,
		eccentricity: .0565,
		inclination: 2.49 * DEG,
		longNode: 113.67 * DEG,
		argPeriapsis: 339.39 * DEG,
		meanAnomaly0: -43.12 * DEG,
		tilt: 26.73 * DEG,
		dayHours: 10.7,
		color: "#e0c48a",
		atmosphere: "#ead8a8",
		rings: {
			inner: 2.35,
			outer: 4.15
		},
		focusDistance: 16.5,
		au: 9.537,
		diameterKm: 116460,
		gravity: "1.06 g",
		moonsCount: 146,
		yearLabel: "29.5 yr",
		dayLabel: "10h 42m",
		summary: "Nearly thirty years to close an ellipse of 9.5 AU. P² / a³ still sits on unity, the same constant that sets Mercury’s 88-day year."
	},
	uranus: {
		id: "uranus",
		name: "Uranus",
		kind: "ice-giant",
		radius: 1.18,
		orbitRadius: 72.2,
		periodYears: 84.01,
		eccentricity: .0472,
		inclination: .77 * DEG,
		longNode: 74.01 * DEG,
		argPeriapsis: 96.99 * DEG,
		meanAnomaly0: 142.27 * DEG,
		tilt: 97.77 * DEG,
		dayHours: -17.24,
		color: "#9bd3d8",
		atmosphere: "#c5f0f2",
		rings: {
			inner: 1.45,
			outer: 2.05
		},
		focusDistance: 8.6,
		au: 19.191,
		diameterKm: 50724,
		gravity: "0.89 g",
		moonsCount: 28,
		yearLabel: "84.0 yr",
		dayLabel: "17h 14m ↩",
		summary: "Eighty-four years around a 19 AU ellipse. The third law is scale-free: the same P² ∝ a³ that times the inner worlds times this ice giant."
	},
	neptune: {
		id: "neptune",
		name: "Neptune",
		kind: "ice-giant",
		radius: 1.14,
		orbitRadius: 86.4,
		periodYears: 164.8,
		eccentricity: .0086,
		inclination: 1.77 * DEG,
		longNode: 131.78 * DEG,
		argPeriapsis: 273.19 * DEG,
		meanAnomaly0: 259.91 * DEG,
		tilt: 28.32 * DEG,
		dayHours: 16.11,
		color: "#3c6fd0",
		atmosphere: "#6f97ea",
		focusDistance: 8.4,
		au: 30.07,
		diameterKm: 49244,
		gravity: "1.14 g",
		moonsCount: 16,
		yearLabel: "165 yr",
		dayLabel: "16h 07m",
		summary: "The last planet, on a nearly circular 30 AU path. Kepler III still closes: a century and a half is exactly what a³ demands of 30 AU."
	}
};
var PLANETS = BODY_ORDER.filter((id) => id !== "sun").map((id) => BODIES[id]);
function getBody(id) {
	return BODIES[id];
}
function kindLabel(kind) {
	if (kind === "star") return "G2V star";
	if (kind === "terrestrial") return "Terrestrial planet";
	if (kind === "gas-giant") return "Gas giant";
	return "Ice giant";
}
function spinRate(body) {
	if (body.id === "sun") return .08;
	const hours = Math.abs(body.dayHours);
	const period = Math.min(48, Math.max(4.2, 10 * (hours / 24)));
	return (body.dayHours < 0 ? -1 : 1) * (Math.PI * 2 / period);
}
var _scratch = {
	x: 0,
	y: 0,
	z: 0
};
function bodyPosition(body, timeDays, out = _scratch) {
	return bodyPosition$1(body, timeDays, out);
}
function orbitPoints(body, segments = 160) {
	return orbitPoints$1(body, segments);
}
function formatDiameter(km) {
	return `${km.toLocaleString("en-US")} km`;
}
var DAYS_PER_SECOND = 365.25 / 22;
var sim = {
	time: 0,
	tick(dt, speed, paused) {
		if (!paused) this.time += dt * speed * DAYS_PER_SECOND;
	}
};
var KEY = "helios-prefs-v1";
function loadPrefs() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function savePrefs(prefs) {
	try {
		localStorage.setItem(KEY, JSON.stringify(prefs));
	} catch {}
}
function persist(state) {
	savePrefs({
		speed: state.speed,
		showLabels: state.showLabels,
		showTrails: state.showTrails
	});
}
var useHelios = create((set, get) => ({
	paused: false,
	speed: 1,
	focusedId: "sun",
	showLabels: true,
	showTrails: true,
	hasInteracted: false,
	togglePaused: () => set((s) => ({
		paused: !s.paused,
		hasInteracted: true
	})),
	setSpeed: (speed) => {
		set({
			speed,
			hasInteracted: true
		});
		persist(get());
	},
	setFocused: (focusedId) => set({
		focusedId,
		hasInteracted: true
	}),
	toggleLabels: () => {
		set((s) => ({
			showLabels: !s.showLabels,
			hasInteracted: true
		}));
		persist(get());
	},
	toggleTrails: () => {
		set((s) => ({
			showTrails: !s.showTrails,
			hasInteracted: true
		}));
		persist(get());
	},
	resetView: () => set({
		focusedId: "sun",
		hasInteracted: true
	})
}));
function hydrateHeliosPrefs() {
	const prefs = loadPrefs();
	const patch = {};
	if (typeof prefs.speed === "number") patch.speed = Math.min(16, Math.max(.25, prefs.speed));
	if (typeof prefs.showLabels === "boolean") patch.showLabels = prefs.showLabels;
	if (typeof prefs.showTrails === "boolean") patch.showTrails = prefs.showTrails;
	if (Object.keys(patch).length) useHelios.setState(patch);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-96", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:bg-accent",
			ghost: "bg-transparent text-fg hover:bg-fg/10",
			muted: "bg-surface-2 text-fg hover:bg-fg/10"
		},
		size: {
			md: "h-11 rounded-lg px-4 text-sm",
			sm: "h-9 rounded-md px-3 text-xs tracking-wide",
			icon: "size-11 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className, "aria-label": ariaLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center", className),
		value,
		onValueChange,
		min,
		max,
		step,
		"aria-label": ariaLabel,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full rounded-full bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function useSimTime(ms = 100) {
	const [t, setT] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		let last = 0;
		const loop = (now) => {
			if (now - last > ms) {
				setT(sim.time);
				last = now;
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [ms]);
	return t;
}
function SimClock() {
	const t = useSimTime(120);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "tabular-nums",
		children: [(t / 365.25).toFixed(2), " yr"]
	});
}
function InfoPanel() {
	const body = getBody(useHelios((s) => s.focusedId));
	const t = useSimTime(80);
	const live = body.id === "sun" ? null : keplerLive(body, t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel pointer-events-auto w-full max-w-sm p-4 md:w-80",
		"aria-label": `${body.name} information`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-muted uppercase",
				children: kindLabel(body.kind)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-1 text-3xl leading-tight font-medium tracking-tight text-balance italic",
				children: body.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Distance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: live ? `${live.radiusAu.toFixed(3)} AU` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Diameter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: formatDiameter(body.diameterKm)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Year"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: body.yearLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: body.dayLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Gravity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: body.gravity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Moons"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: body.id === "sun" ? "—" : body.moonsCount
					})
				]
			}),
			live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-muted uppercase",
						children: "Kepler"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Eccentricity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: live.eccentricity.toFixed(4)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Perihelion"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "tabular-nums",
								children: [live.perihelionAu.toFixed(3), " AU"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Aphelion"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "tabular-nums",
								children: [live.aphelionAu.toFixed(3), " AU"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Speed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "tabular-nums",
								children: [live.speedRatio.toFixed(2), "× circ."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "P² / a³"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: live.thirdLaw.toFixed(3)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-relaxed text-muted",
						children: "I ellipse, Sun at a focus · II equal areas · III P² ∝ a³"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-pretty text-muted",
				children: body.summary
			})
		]
	});
}
function Transport() {
	const paused = useHelios((s) => s.paused);
	const speed = useHelios((s) => s.speed);
	const showLabels = useHelios((s) => s.showLabels);
	const showTrails = useHelios((s) => s.showTrails);
	const togglePaused = useHelios((s) => s.togglePaused);
	const setSpeed = useHelios((s) => s.setSpeed);
	const toggleLabels = useHelios((s) => s.toggleLabels);
	const toggleTrails = useHelios((s) => s.toggleTrails);
	const resetView = useHelios((s) => s.resetView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel pointer-events-auto w-full max-w-sm p-3 md:w-72",
		"aria-label": "Simulation controls",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "muted",
				size: "icon",
				onClick: togglePaused,
				"aria-pressed": paused,
				"aria-label": paused ? "Resume simulation" : "Pause simulation",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative size-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-in-out)]", paused ? "scale-25 opacity-0 blur-sm" : "scale-100 opacity-100 blur-none") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-in-out)]", paused ? "ml-0.5 scale-100 opacity-100 blur-none" : "scale-25 opacity-0 blur-sm") })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tracking-[0.18em] text-muted uppercase",
						children: "Speed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs tabular-nums text-fg",
						children: [speed.toFixed(2), "×"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					value: [speed],
					min: .25,
					max: 16,
					step: .25,
					onValueChange: (v) => setSpeed(v[0] ?? 1),
					"aria-label": "Simulation speed"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "muted",
					size: "sm",
					className: "flex-1",
					"aria-pressed": showLabels,
					onClick: toggleLabels,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, { className: "size-3.5" }), "Labels"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "muted",
					size: "sm",
					className: "flex-1",
					"aria-pressed": showTrails,
					onClick: toggleTrails,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orbit, { className: "size-3.5" }), "Trails"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "muted",
					size: "sm",
					onClick: resetView,
					"aria-label": "Reset view to the Sun",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" })
				})
			]
		})]
	});
}
function PlanetPicker() {
	const focusedId = useHelios((s) => s.focusedId);
	const setFocused = useHelios((s) => s.setFocused);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "pointer-events-auto max-w-full overflow-x-auto md:overflow-visible",
		"aria-label": "Focus a world",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex w-max gap-1.5 px-1 md:w-auto md:flex-wrap md:justify-center",
			children: BODY_ORDER.map((id) => {
				const body = getBody(id);
				const active = id === focusedId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFocused(id),
					"aria-current": active ? "true" : void 0,
					className: cn("flex h-11 items-center gap-2 rounded-md px-2.5 text-xs whitespace-nowrap transition-[background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)]", active ? "bg-fg text-bg" : "bg-surface/80 text-fg hover:bg-fg/10"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 shrink-0 rounded-full",
						style: { backgroundColor: body.color },
						"aria-hidden": true
					}), body.name]
				}) }, id);
			})
		})
	});
}
function Overlay() {
	const hasInteracted = useHelios((s) => s.hasInteracted);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			const { togglePaused, toggleLabels, toggleTrails, resetView, setSpeed, setFocused, speed } = useHelios.getState();
			const k = e.key.toLowerCase();
			if (k === " " || k === "k") {
				e.preventDefault();
				togglePaused();
			} else if (k === "l") toggleLabels();
			else if (k === "t") toggleTrails();
			else if (k === "r" || k === "escape") resetView();
			else if (k === "[") setSpeed(Math.max(.25, speed - .25));
			else if (k === "]") setSpeed(Math.min(16, speed + .25));
			else if (/^[0-8]$/.test(k)) {
				const id = BODY_ORDER[Number(k)];
				if (id) setFocused(id);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 md:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-none tracking-tight italic md:text-4xl",
					children: "Helios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs tracking-widest text-muted uppercase",
					children: "Observatory"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden text-right text-xs text-muted md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tracking-[0.18em] uppercase",
						children: "Elapsed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimClock, {})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-start md:justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanetPicker, {})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-2 md:items-end",
				children: [!hasInteracted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden px-1 text-xs tracking-wide text-muted md:block",
					children: "Drag to orbit · Mercury for the ellipse · space pauses"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transport, {})]
			})]
		})]
	});
}
function HeliosApp() {
	const [Canvas, setCanvas] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./canvas-DRWAgroh.mjs").then((mod) => {
			if (!cancelled) setCanvas(() => mod.SolarCanvas);
		});
		hydrateHeliosPrefs();
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) useHelios.setState({ paused: true });
		const w = window;
		w.__helios = { getState: useHelios.getState };
		return () => {
			cancelled = true;
			delete w.__helios;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [Canvas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-bg",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeliosApp, {});
}
//#endregion
export { PLANETS as a, orbitPoints as c, emptyFocusPosition as d, perihelionPosition as f, BODIES as i, spinRate as l, useHelios as n, bodyPosition as o, sim as r, getBody as s, routes_exports as t, aphelionPosition as u };
