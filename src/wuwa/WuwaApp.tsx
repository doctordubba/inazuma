import { useState, useEffect } from "react";
import { CharacterCard, almanacStyles } from "../GenshinApp";
import { RESONATORS, ATTRIBUTE_THEME, ATTRIBUTE_ORDER, WUWA_VERSION } from "./wuwaData";
import EchoCompendium from "./EchoCompendium";
import FieldManual from "./FieldManual";

const WUWA_STORAGE_KEY = "wuwa-build-progress-v1";
const WUWA_COLLAPSE_KEY = "wuwa-build-collapsed-v1";
const WUWA_TAB_KEY = "wuwa-build-tab-v1";

const RESONATORS_BY_ATTRIBUTE = ATTRIBUTE_ORDER.reduce((acc, attr) => {
  acc[attr] = RESONATORS.filter((c) => c.element === attr);
  return acc;
}, {});

const PAGES = {
  resonators: "resonators",
  echoes: "echoes",
  guides: "guides",
};

function getPageFromHash() {
  const hash = (typeof window !== "undefined" ? window.location.hash : "") || "";
  const seg = hash.replace(/^#\/?/, "").toLowerCase();
  const sub = seg.replace(/^wuwa\/?/, "").replace(/\/+$/, "");
  if (sub === "echoes") return PAGES.echoes;
  if (sub === "guides") return PAGES.guides;
  return PAGES.resonators;
}

export default function WuwaApp() {
  // The top-level App re-renders on hashchange, so reading the hash at
  // render time is enough to route.
  const page = getPageFromHash();

  return (
    <>
      <style>{almanacStyles}</style>
      <style>{wuwaOverrides}</style>
      <div className="wuwa-root">
        <div className="page">
          <div className="vignette" aria-hidden="true" />
          <div className="stars" aria-hidden="true" />

          <nav className="nav" aria-label="Primary">
            <a className="nav-brand" href="#/wuwa">
              <span className="nav-brand-mark" aria-hidden="true">✦</span>
              <span className="nav-brand-text">Almanac · Resonant Tides</span>
            </a>
            <div className="nav-links">
              <a
                href="#/wuwa"
                className={`nav-link ${page === PAGES.resonators ? "active" : ""}`}
                aria-current={page === PAGES.resonators ? "page" : undefined}
              >
                Resonators
              </a>
              <a
                href="#/wuwa/echoes"
                className={`nav-link ${page === PAGES.echoes ? "active" : ""}`}
                aria-current={page === PAGES.echoes ? "page" : undefined}
              >
                Echoes
              </a>
              <a
                href="#/wuwa/guides"
                className={`nav-link ${page === PAGES.guides ? "active" : ""}`}
                aria-current={page === PAGES.guides ? "page" : undefined}
              >
                Field Manual
              </a>
              <span className="nav-link" style={{ opacity: 0.4, cursor: "default" }}>
                Regions — soon
              </span>
              <a href="#/" className="nav-link">
                Games
              </a>
            </div>
          </nav>

          {page === PAGES.echoes ? (
            <EchoCompendium />
          ) : page === PAGES.guides ? (
            <FieldManual />
          ) : (
            <ResonatorsPage />
          )}
        </div>
      </div>
    </>
  );
}

function ResonatorsPage() {
  const [progress, setProgress] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WUWA_STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
      const rawCol = localStorage.getItem(WUWA_COLLAPSE_KEY);
      if (rawCol) setCollapsed(JSON.parse(rawCol));
    } catch (e) {
      // ignore
    }
    setHydrated(true);
  }, []);

  const toggleCollapsed = (attr) => {
    const next = { ...collapsed, [attr]: !collapsed[attr] };
    setCollapsed(next);
    try {
      localStorage.setItem(WUWA_COLLAPSE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const persist = (next) => {
    setProgress(next);
    try {
      localStorage.setItem(WUWA_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save:", e);
    }
  };

  const toggle = (charId, statId) => {
    const current = (progress[charId] && progress[charId][statId]) || false;
    persist({
      ...progress,
      [charId]: { ...(progress[charId] || {}), [statId]: !current },
    });
  };

  const goToResonator = (id) => {
    const target = RESONATORS.find((c) => c.id === id);
    if (target && collapsed[target.element]) {
      const next = { ...collapsed, [target.element]: false };
      setCollapsed(next);
      try {
        localStorage.setItem(WUWA_COLLAPSE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`card-${id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      return;
    }
    const el = document.getElementById(`card-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetAll = () => {
    if (!window.confirm("Clear all checked boxes? This cannot be undone.")) return;
    setProgress({});
    try {
      localStorage.removeItem(WUWA_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const totalStats = RESONATORS.reduce((s, c) => s + c.stats.length, 0);
  const doneStats = RESONATORS.reduce(
    (s, c) => s + c.stats.filter((st) => progress[c.id] && progress[c.id][st.id]).length,
    0
  );
  const pct = totalStats ? Math.round((doneStats / totalStats) * 100) : 0;

  return (
    <>
      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">Almanac of the Resonant Tides</h1>
        <p className="subtitle">
          Ideal build targets — checked when reached. · Wuthering Waves {WUWA_VERSION}
        </p>

        <div className="overall">
          <div className="overall-bar">
            <div className="overall-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="overall-meta">
            <span>{doneStats} / {totalStats} stats reached</span>
            <button className="reset" onClick={resetAll} disabled={!doneStats}>
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="elements">
        {ATTRIBUTE_ORDER.map((attr) => {
          const theme = ATTRIBUTE_THEME[attr];
          const chars = RESONATORS_BY_ATTRIBUTE[attr];
          if (!chars || chars.length === 0) return null;
          const isOpen = !collapsed[attr];
          const groupTotal = chars.reduce((s, c) => s + c.stats.length, 0);
          const groupDone = chars.reduce(
            (s, c) =>
              s +
              c.stats.filter((st) => progress[c.id] && progress[c.id][st.id]).length,
            0
          );
          return (
            <section
              key={attr}
              className="elem-section"
              style={{ "--accent": theme.color, "--glow": theme.glow }}
            >
              <button
                className={`elem-header ${isOpen ? "open" : "closed"}`}
                onClick={() => toggleCollapsed(attr)}
                aria-expanded={isOpen}
                type="button"
              >
                <span className="elem-caret" aria-hidden="true">
                  <svg viewBox="0 0 10 10" className="caret-svg">
                    <path d="M2 3 L5 7 L8 3" />
                  </svg>
                </span>
                <h2 className="elem-title">{theme.label}</h2>
                <span className="elem-count">
                  {groupDone} / {groupTotal}
                </span>
              </button>
              {isOpen && (
                <div className="grid">
                  {chars.map((c) => (
                    <CharacterCard
                      key={c.id}
                      char={c}
                      checked={progress[c.id] || {}}
                      onToggle={toggle}
                      hydrated={hydrated}
                      flash={false}
                      onGoTo={goToResonator}
                      roster={RESONATORS}
                      themeMap={ATTRIBUTE_THEME}
                      tabStorageKey={WUWA_TAB_KEY}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      <footer className="bottom">
        <p>Targets compiled from Game8, Prydwen, and WutheringLab · Version {WUWA_VERSION}</p>
        <p className="bottom-faint">Progress saved locally.</p>
      </footer>
    </>
  );
}

const wuwaOverrides = `
.wuwa-root .page {
  background: linear-gradient(160deg, #04121a 0%, #0a2530 45%, #123a44 100%);
}

.wuwa-root .title {
  background: linear-gradient(180deg, #f0fbfc 0%, #8fd3d8 55%, #23555e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wuwa-root .overall-fill {
  background: linear-gradient(90deg, #23555e 0%, #8fd3d8 100%);
}

.wuwa-root .nav-brand-mark {
  color: #8fd3d8;
}

.wuwa-root .rx-card .rx-caret .caret-svg {
  stroke: #8fd3d8;
}

.wuwa-root .rx-formula-tag {
  color: #8fd3d8;
  border-color: rgba(143, 211, 216, 0.45);
}

.wuwa-root .rx-details li::before {
  background: #8fd3d8;
}
`;
