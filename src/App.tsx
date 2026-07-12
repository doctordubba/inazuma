import { useState, useEffect } from "react";
import GenshinApp from "./GenshinApp";
import WuwaApp from "./wuwa/WuwaApp";

const LEGACY_ROUTE_RE = /^(characters|reactions|weapons|regions)([/].*)?$/;

function getHash() {
  return (typeof window !== "undefined" ? window.location.hash : "") || "";
}

export default function App() {
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const seg = hash.replace(/^#\/?/, "").toLowerCase();
  const isLegacy = LEGACY_ROUTE_RE.test(seg);

  useEffect(() => {
    if (isLegacy) {
      window.location.replace("#/genshin/" + seg);
    }
  }, [isLegacy, seg]);

  if (seg.startsWith("genshin") || isLegacy) return <GenshinApp />;
  if (seg.startsWith("wuwa")) return <WuwaApp />;
  return <GameHub />;
}

function GameHub() {
  return (
    <>
      <style>{hubStyles}</style>
      <div className="hub">
        <div className="hub-stars" aria-hidden="true" />
        <header className="hub-head">
          <div className="hub-marks" aria-hidden="true">✦ ✦ ✦</div>
          <h1 className="hub-title">Traveler's Almanacs</h1>
          <p className="hub-sub">Build targets, compendiums, and quest trackers — pick your world.</p>
        </header>

        <main className="hub-grid">
          <a className="hub-card genshin" href="#/genshin/characters">
            <span className="hub-game">Genshin Impact</span>
            <h2 className="hub-card-title">Almanac of the Moonbound</h2>
            <p className="hub-tagline">
              Ideal builds for the Moonbound roster, the reactions compendium,
              the weapon vault, and region quest trackers across the Seven Nations.
            </p>
            <div className="hub-badges">
              <span className="hub-badge">Characters</span>
              <span className="hub-badge">Reactions</span>
              <span className="hub-badge">Weapons</span>
              <span className="hub-badge">Regions</span>
            </div>
            <span className="hub-enter">Enter ›</span>
          </a>

          <a className="hub-card wuwa" href="#/wuwa">
            <span className="hub-game">Wuthering Waves</span>
            <h2 className="hub-card-title">Almanac of the Resonant Tides</h2>
            <p className="hub-tagline">
              Ideal builds for twelve Resonators of the v3.5 meta — Echo sets,
              signature weapons, forte priorities, and stat targets.
            </p>
            <div className="hub-badges">
              <span className="hub-badge">Resonators</span>
              <span className="hub-badge">Echo Sets</span>
              <span className="hub-badge">Build Targets</span>
            </div>
            <span className="hub-enter">Enter ›</span>
          </a>
        </main>

        <footer className="hub-foot">
          <p>Progress is saved locally, per almanac.</p>
        </footer>
      </div>
    </>
  );
}

const hubStyles = `
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

.hub {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 44px;
  padding: 64px 24px;
  background:
    radial-gradient(ellipse 90% 60% at 50% -10%, #16203a 0%, transparent 60%),
    radial-gradient(ellipse 70% 50% at 80% 110%, #101c26 0%, transparent 60%),
    #070a12;
  color: #d8d9e0;
  font-family: Georgia, 'Times New Roman', serif;
}

.hub-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.8) 50%, transparent 51%),
    radial-gradient(1px 1px at 28% 68%, rgba(255,255,255,0.5) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 44% 12%, rgba(255,255,255,0.7) 50%, transparent 51%),
    radial-gradient(1px 1px at 61% 41%, rgba(255,255,255,0.55) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 73% 79%, rgba(255,255,255,0.6) 50%, transparent 51%),
    radial-gradient(1px 1px at 86% 27%, rgba(255,255,255,0.7) 50%, transparent 51%),
    radial-gradient(1px 1px at 8% 84%, rgba(255,255,255,0.45) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 93% 62%, rgba(255,255,255,0.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 52% 91%, rgba(255,255,255,0.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 37% 47%, rgba(255,255,255,0.4) 50%, transparent 51%);
}

.hub-head { text-align: center; position: relative; }

.hub-marks {
  font-size: 13px;
  letter-spacing: 0.6em;
  color: rgba(216, 217, 224, 0.45);
  margin-bottom: 14px;
}

.hub-title {
  margin: 0;
  font-size: clamp(34px, 6vw, 54px);
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(180deg, #f3f1e8 0%, #a8adc4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hub-sub {
  margin: 12px 0 0;
  font-size: 16px;
  font-style: italic;
  color: rgba(216, 217, 224, 0.6);
}

.hub-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  width: 100%;
  max-width: 940px;
}

.hub-card {
  --accent: #c9a86a;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 36px 32px 30px;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}

.hub-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 34px color-mix(in srgb, var(--accent) 28%, transparent),
              inset 0 0 24px color-mix(in srgb, var(--accent) 8%, transparent);
  transform: translateY(-3px);
}

.hub-card.genshin { --accent: #c9a86a; }
.hub-card.wuwa { --accent: #8fd3d8; }

.hub-game {
  font-size: 12px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--accent);
}

.hub-card-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  color: #f0eee6;
  line-height: 1.25;
}

.hub-tagline {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.65;
  color: rgba(216, 217, 224, 0.7);
  flex: 1;
}

.hub-badges { display: flex; flex-wrap: wrap; gap: 8px; }

.hub-badge {
  font-size: 11.5px;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  color: color-mix(in srgb, var(--accent) 85%, #ffffff);
}

.hub-enter {
  margin-top: 6px;
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.hub-foot {
  position: relative;
  font-size: 12.5px;
  color: rgba(216, 217, 224, 0.4);
  text-align: center;
}
.hub-foot p { margin: 0; }

@media (max-width: 720px) {
  .hub { gap: 34px; padding: 48px 18px; }
  .hub-grid { grid-template-columns: 1fr; max-width: 480px; }
  .hub-card { padding: 30px 24px 26px; }
}
`;
