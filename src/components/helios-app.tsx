import { useEffect, useState, type ComponentType } from "react";
import { Overlay } from "@/components/hud/overlay";
import { hydrateHeliosPrefs, useHelios } from "@/lib/solar/store";

export function HeliosApp() {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/components/solar/canvas").then((mod) => {
      if (!cancelled) setCanvas(() => mod.SolarCanvas);
    });
    hydrateHeliosPrefs();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      useHelios.setState({ paused: true });
    }
    const w = window as Window & { __helios?: { getState: typeof useHelios.getState } };
    w.__helios = { getState: useHelios.getState };
    return () => {
      cancelled = true;
      delete w.__helios;
    };
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      {Canvas ? <Canvas /> : <div className="absolute inset-0 bg-bg" aria-hidden />}
      <Overlay />
    </main>
  );
}
