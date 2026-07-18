import { useMemo, useState } from "react";
import { RESONATORS, ATTRIBUTE_THEME } from "./wuwaData";
import { generateTeams, TEAM_TIER_ORDER, shortName } from "./teamEngine";

/* ============================================================
   TEAM LAB — Wuthering Waves v3.5
   Every viable trio, generated live from each resonator's
   teamMeta and ranked by the team engine. Rendered inside
   WuwaApp's .wuwa-root (almanacStyles already injected);
   this file carries its own copy of the small tt-* chip CSS.
   ============================================================ */

const TIER_COLORS = {
  S: "#e8b4b8",
  A: "#c9a86a",
  B: "#8fb0c9",
  C: "#8a8a94",
  theorycraft: "#8a8a94",
};

const BUCKET_META = {
  S: {
    label: "S — Ceiling of the roster",
    blurb: "The trios whose buffs, sustain, and field-time economy all compound.",
  },
  A: {
    label: "A — Excellent",
    blurb: "Strong synergy stacks that clear endgame content comfortably.",
  },
  B: {
    label: "B — Workable",
    blurb: "Honest teams: they function, with a lower ceiling or thinner buffs.",
  },
  theorycraft: {
    label: "Theorycraft",
    blurb: "The engine considers these workable on paper — nobody has proven them yet.",
  },
};

const VISIBLE_CAP = 12;

function charOf(id) {
  return RESONATORS.find((c) => c.id === id);
}

function NameChip({ id, dim }) {
  const c = charOf(id);
  const theme = (c && ATTRIBUTE_THEME[c.element]) || { color: "#8fd3d8" };
  return (
    <span
      className="tt-chip"
      style={{ "--chip": theme.color, opacity: dim ? 0.45 : 1 }}
    >
      {c ? shortName(c.name) : id}
    </span>
  );
}

function TeamCard({ team, isOpen, onToggle }) {
  const tierColor = TIER_COLORS[team.tier] || "#8a8a94";
  return (
    <article className={`rx-card ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="rx-head"
        onClick={() => onToggle(team.key)}
        aria-expanded={isOpen}
      >
        <div className="rx-head-left">
          <h3 className="rx-name">{team.name}</h3>
          <span className="tt-members">
            {team.memberIds.map((id) => (
              <NameChip key={id} id={id} />
            ))}
            <span className="tl-tier-chip" style={{ "--tier": tierColor }}>
              {team.tier === "theorycraft" ? "T" : team.tier}
            </span>
            <span className={`tt-power ${team.proven ? "" : "tl-unproven"}`}>
              {team.proven ? "Proven" : "Theorycraft"}
            </span>
          </span>
        </div>
        <span className="rx-caret" aria-hidden="true">
          <svg viewBox="0 0 10 10" className="caret-svg">
            <path d="M2 3 L5 7 L8 3" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="rx-body">
          <div className="tt-slots">
            {team.memberIds.map((id, i) => (
              <div key={id} className="tt-slot">
                <span className="tt-slot-n">{i + 1}</span>
                <NameChip id={id} />
                {id === team.carryId && <span className="tl-carry-tag">carry</span>}
              </div>
            ))}
          </div>
          <p className="tt-team-why">{team.why}</p>
          {team.rotation ? (
            <p className="tt-rotation">
              <span className="tt-rot-tag">rotation</span> {team.rotation}
            </p>
          ) : (
            team.hits.length > 0 && (
              <ul className="tl-hits">
                {team.hits.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </article>
  );
}

export default function TeamLab() {
  const result = useMemo(() => generateTeams(), []);
  const { buckets, totalViable, totalEnumerated } = result;

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTiers, setActiveTiers] = useState(() => [...TEAM_TIER_ORDER]);
  const [openKey, setOpenKey] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleChar = (id) => {
    setSelectedIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length < 2) return [...cur, id];
      return [cur[1], id];
    });
  };

  const toggleTier = (t) => {
    setActiveTiers((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]
    );
  };

  const clearFilters = () => {
    setSelectedIds([]);
    setActiveTiers([...TEAM_TIER_ORDER]);
  };

  const filtersActive =
    selectedIds.length > 0 || activeTiers.length !== TEAM_TIER_ORDER.length;

  const matchesChars = (team) =>
    selectedIds.every((id) => team.memberIds.includes(id));

  const provenCount = TEAM_TIER_ORDER.reduce(
    (n, b) => n + buckets[b].filter((t) => t.proven).length,
    0
  );

  return (
    <>
      <style>{tlStyles}</style>

      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">Team Lab</h1>
        <p className="subtitle">
          Every viable trio, generated and ranked from resonator metadata · v3.5
        </p>
      </header>

      <main className="rx-page">
        {/* ── Explainer ── */}
        <section className="rx-group">
          <div className="tt-row">
            <p className="tt-why">
              These teams are not hand-written — they are computed live from each
              resonator&apos;s team metadata (role, damage tags, Outro type, sustain,
              field-time appetite). When a new resonator is added to the almanac with
              metadata, it automatically joins the pool and every combination is
              re-ranked. <strong className="tl-strong">Proven</strong> marks
              community-verified comps with a written rotation;{" "}
              <strong className="tl-strong">Theorycraft</strong> means the engine
              considers the trio workable, but nobody has verified it in the Tower.
            </p>
            <p className="tt-why tl-totals">
              {totalViable} viable teams from {totalEnumerated} combinations ·{" "}
              {provenCount} proven
            </p>
          </div>
        </section>

        {/* ── Filters ── */}
        <section className="rx-group">
          <div className="tt-row">
            <div className="tl-filter-label">
              Filter by resonator <span className="tl-filter-hint">(up to 2 — teams must contain all selected)</span>
            </div>
            <div className="tl-chip-row">
              {RESONATORS.map((c) => {
                const theme = ATTRIBUTE_THEME[c.element] || { color: "#8fd3d8" };
                const active = selectedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`tt-chip tl-chip-btn ${active ? "active" : ""}`}
                    style={{ "--chip": theme.color }}
                    aria-pressed={active}
                    onClick={() => toggleChar(c.id)}
                  >
                    {shortName(c.name)}
                  </button>
                );
              })}
            </div>
            <div className="tl-filter-label">Filter by tier</div>
            <div className="tl-chip-row">
              {TEAM_TIER_ORDER.map((t) => {
                const active = activeTiers.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`tt-chip tl-chip-btn ${active ? "active" : ""}`}
                    style={{ "--chip": TIER_COLORS[t] }}
                    aria-pressed={active}
                    onClick={() => toggleTier(t)}
                  >
                    {t === "theorycraft" ? "Theorycraft" : t}
                  </button>
                );
              })}
              <button
                type="button"
                className="tl-clear"
                onClick={clearFilters}
                disabled={!filtersActive}
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* ── Buckets ── */}
        {totalViable === 0 && (
          <section className="rx-group">
            <div className="tt-row">
              <p className="tt-why">
                The team engine is waiting for resonator metadata — no entries in the
                almanac carry <code>teamMeta</code> yet. Once the data lands, this page
                fills itself in.
              </p>
            </div>
          </section>
        )}

        {TEAM_TIER_ORDER.filter((b) => activeTiers.includes(b)).map((b) => {
          const all = buckets[b].filter(matchesChars);
          if (all.length === 0) return null;
          const isExpanded = !!expanded[b];
          const visible = isExpanded ? all : all.slice(0, VISIBLE_CAP);
          return (
            <section key={b} className="rx-group">
              <div className="rx-group-head">
                <h2 className="rx-group-title">
                  <span className="tl-tier-chip tl-tier-big" style={{ "--tier": TIER_COLORS[b] }}>
                    {b === "theorycraft" ? "T" : b}
                  </span>
                  {BUCKET_META[b].label}
                  <span className="tl-count">({all.length})</span>
                </h2>
                <p className="rx-group-blurb">{BUCKET_META[b].blurb}</p>
              </div>
              <div className="rx-list">
                {visible.map((team) => (
                  <TeamCard
                    key={team.key}
                    team={team}
                    isOpen={openKey === team.key}
                    onToggle={(k) => setOpenKey((cur) => (cur === k ? null : k))}
                  />
                ))}
              </div>
              {all.length > VISIBLE_CAP && (
                <button
                  type="button"
                  className="tl-showall"
                  onClick={() => setExpanded((cur) => ({ ...cur, [b]: !cur[b] }))}
                >
                  {isExpanded
                    ? "Show fewer"
                    : `Show all ${all.length}`}
                </button>
              )}
            </section>
          );
        })}
      </main>

      <footer className="bottom">
        <p>
          Scores derive from Outro matching, sustain coverage, field-time economy, and
          curated synergy loops · v3.5 (July 2026)
        </p>
        <p className="bottom-faint">
          Proven comps carry community-verified rotations; everything else is honest
          math awaiting a pilot.
        </p>
      </footer>
    </>
  );
}

/* ---------- Scoped styles (tt-* chip idiom copied from TiersTeams) ---------- */

const tlStyles = `
.tt-row {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  min-width: 0;
}

.tt-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--chip) 55%, transparent);
  color: var(--chip);
  font-size: 12.5px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.tt-why {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(236, 254, 255, 0.62);
  overflow-wrap: break-word;
}

.tt-members {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.tt-power {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8fd3d8;
  border: 1px solid rgba(143, 211, 216, 0.4);
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.tt-slots { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }

.tt-slot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.tt-slot-n {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(143, 211, 216, 0.4);
  color: #8fd3d8;
  font-size: 11px;
  flex-shrink: 0;
}

.tt-team-why {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(236, 254, 255, 0.68);
}

.tt-rotation {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  font-style: italic;
  color: rgba(236, 254, 255, 0.5);
}

.tt-rot-tag {
  font-style: normal;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8fd3d8;
  border: 1px solid rgba(143, 211, 216, 0.35);
  padding: 2px 7px;
  border-radius: 999px;
  margin-right: 8px;
  vertical-align: middle;
}

/* ── Team Lab additions ── */

.tl-strong { color: #f0f9ff; font-weight: 600; }

.tl-totals {
  margin-top: 10px;
  color: #8fd3d8;
  font-size: 12.5px;
  letter-spacing: 0.06em;
}

.tl-tier-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  border: 1px solid var(--tier);
  color: var(--tier);
  border-radius: 4px;
  font-size: 12px;
}

.tl-tier-big {
  width: 34px;
  height: 34px;
  margin-right: 12px;
  font-size: 18px;
  vertical-align: middle;
}

.tl-count {
  margin-left: 10px;
  font-size: 13px;
  color: rgba(236, 254, 255, 0.45);
  letter-spacing: 0.05em;
}

.tl-unproven {
  color: rgba(236, 254, 255, 0.45);
  border-color: rgba(236, 254, 255, 0.2);
}

.tl-carry-tag {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e8b4b8;
  border: 1px solid rgba(232, 180, 184, 0.45);
  padding: 2px 7px;
  border-radius: 999px;
}

.tl-filter-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(236, 254, 255, 0.5);
  margin: 4px 0 8px;
}

.tl-filter-hint { text-transform: none; letter-spacing: 0.04em; }

.tl-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tl-chip-row:last-child { margin-bottom: 0; }

.tl-chip-btn {
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.tl-chip-btn:hover { background: color-mix(in srgb, var(--chip) 10%, transparent); }

.tl-chip-btn.active {
  background: color-mix(in srgb, var(--chip) 22%, transparent);
  box-shadow: 0 0 0 1px var(--chip) inset;
}

.tl-clear {
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: rgba(236, 254, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 3px 12px;
}

.tl-clear:disabled { opacity: 0.35; cursor: default; }

.tl-showall {
  display: block;
  margin: 12px auto 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8fd3d8;
  border: 1px solid rgba(143, 211, 216, 0.4);
  border-radius: 999px;
  padding: 6px 18px;
}

.tl-hits {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tl-hits li {
  font-size: 12.5px;
  line-height: 1.55;
  color: rgba(236, 254, 255, 0.55);
}
`;
