import { ATTRIBUTE_THEME } from "./wuwaData";

/* ============================================================
   WUWA — TIER LIST
   v3.5 tier placements and role glossary for the almanac
   roster. Team comps moved to the Team Lab (#/wuwa/teams).
   Tier data cross-checked against Prydwen / Game8 / community
   lists (July 2026).
   ============================================================ */

const NAMES = {
  shorekeeper: "Shorekeeper",
  xuanling: "Yangyang: Xuanling",
  lucy: "Lucy",
  changli: "Changli",
  aemeath: "Aemeath",
  rebecca: "Rebecca",
  "luuk-herssen": "Luuk Herssen",
  lynae: "Lynae",
  verina: "Verina",
  sanhua: "Sanhua",
  mortefi: "Mortefi",
  buling: "Buling",
  danjin: "Danjin",
  encore: "Encore",
  baizhi: "Baizhi",
  youhu: "Youhu",
  lumi: "Lumi",
  lingyang: "Lingyang",
  yangyang: "Yangyang",
  chixia: "Chixia",
  aalto: "Aalto",
  taoqi: "Taoqi",
  yuanwu: "Yuanwu",
};

const ATTR = {
  shorekeeper: "spectro",
  xuanling: "havoc",
  lucy: "spectro",
  changli: "fusion",
  aemeath: "fusion",
  rebecca: "electro",
  "luuk-herssen": "spectro",
  lynae: "spectro",
  verina: "spectro",
  sanhua: "glacio",
  mortefi: "fusion",
  buling: "electro",
  danjin: "havoc",
  encore: "fusion",
  baizhi: "glacio",
  youhu: "glacio",
  lumi: "electro",
  lingyang: "glacio",
  yangyang: "aero",
  chixia: "fusion",
  aalto: "aero",
  taoqi: "havoc",
  yuanwu: "electro",
};

const TIERS = [
  {
    tier: "S",
    label: "Meta-defining",
    blurb: "Anchor the fastest Tower of Adversity clears this season. Build these first.",
    color: "#e8b4b8",
    rows: [
      { id: "shorekeeper", role: "Healer / Amplifier", why: "The gold-standard universal support — crit-buffing Stellarealm, constant healing, All-DMG Amp Outro; anchors the fastest ToA clears." },
      { id: "xuanling", role: "Main DPS", why: "v3.5 flagship Havoc Heavy-Attack carry; Havoc Bane loops and guaranteed-crit Shadow procs top the current DPS charts." },
      { id: "lucy", role: "Main DPS", why: "S-tier Spectro Heavy/Hack carry; the Hack-Shifting debuff system gives her teams multipliers nothing else in this roster matches." },
      { id: "aemeath", role: "Main DPS (Liberation)", why: "Widely rated the top carry for current endgame content — two Resonance Modes cover single-target and AoE, and her Liberation damage ignores DEF and Fusion RES through her signature." },
      { id: "changli", role: "Main DPS (Quick-Swap)", why: "Still S-tier in endgame modes as of v3.5 — elite damage-per-second-of-field-time, and her Fusion + Liberation Deepen Outro makes her the engine of the roster's mono-Fusion loop." },
    ],
  },
  {
    tier: "A",
    label: "Excellent",
    blurb: "Strong in current content — premium picks or 4-stars whose buffs never age.",
    color: "#c9a86a",
    rows: [
      { id: "rebecca", role: "Sub-DPS", why: "Free 5-star from the Edgerunners collab: real personal Electro damage plus All-DMG and Heavy-Attack amplification — slots into Lucy and Xuanling teams alike." },
      { id: "luuk-herssen", role: "Main DPS", why: "Still a very good Spectro mid-air Basic DPS, but amp-dependent — wants Lynae to keep Tune Strain damage competitive." },
      { id: "lynae", role: "Amplifier", why: "Premier general amplifier of the 3.x era — 15% All-DMG Amp + 25% Liberation DMG Outro, teamwide 24% DMG on Liberation." },
      { id: "verina", role: "Healer / Amplifier", why: "Ages beautifully — near-Shorekeeper sustain with a 15% All-Type Deepen Outro and a revive safety net; the default second-team anchor." },
      { id: "sanhua", role: "Amplifier", why: "The textbook Deepen-buffers-age-well case: 38% Basic Attack Deepen and the fastest concerto in the game." },
      { id: "mortefi", role: "Hybrid Buffer", why: "Irreplaceable 38% Heavy Attack Deepen plus off-field coordinated Fusion attacks — newly relevant as Xuanling's best in-roster amplifier." },
      { id: "buling", role: "Healer / Amplifier", why: "Best 4-star sustain right now — heals, applies Electro Flare, buffs Resonance Skill DMG, and amplifies teamwide on Outro." },
    ],
  },
  {
    tier: "B",
    label: "Serviceable",
    blurb: "They clear content but have been outpaced, or their niche is thin in this roster.",
    color: "#8fb0c9",
    rows: [
      { id: "danjin", role: "Sub-DPS", why: "Still the best pure-4-star carry with real quick-swap damage and a Havoc Deepen Outro, but powercrept out of premium Havoc teams." },
      { id: "encore", role: "Main DPS", why: "Classic Fusion hypercarry — her teams still clear ToA, but she is clearly outpaced by 3.x carries." },
      { id: "baizhi", role: "Healer", why: "Serviceable budget healer; worse than Verina/Buling because her buff only reaches the next swap-in, not the whole party." },
      { id: "youhu", role: "Healer / Amplifier", why: "Heals and carries a big Coordinated-Attack Deepen Outro, but that niche barely exists in this roster." },
    ],
  },
  {
    tier: "C",
    label: "Bench",
    blurb: "Honest placements — build only for love, not for Tower scores.",
    color: "#8a8a94",
    rows: [
      { id: "lumi", role: "Sub-DPS", why: "Resonance-Skill Deepen niche without her one great partner in this roster; consistently among the weakest units." },
      { id: "lingyang", role: "Main DPS", why: "Historical bottom-dweller; recent tech nudged him up a rung, but consensus keeps him the weakest carry archetype." },
      { id: "yangyang", role: "Battery / Support", why: "The energy-restore Outro is her one selling point; a pure-stat era kit with no Deepen and no damage." },
      { id: "chixia", role: "Main DPS", why: "Fun starter gunner, but a stat-stick DPS with no team utility — skippable investment." },
      { id: "aalto", role: "Sub-DPS", why: "23% Aero Deepen is his one trick, and this roster has no Aero carry to receive it." },
      { id: "taoqi", role: "Shielder", why: "WuWa's dodge-centric design makes shields near-valueless in ToA; her tempo is also sluggish." },
      { id: "yuanwu", role: "Sub-DPS", why: "Off-field Electro coordinated attacks with no partner that wants them here — negligible output." },
    ],
  },
];

const GLOSSARY = [
  { name: "Main DPS", def: "The on-field carry who consumes the team's buff windows and field time. Their damage is tagged by type (Basic, Heavy, Skill, Liberation) — the tag decides which Amplifier belongs beside them." },
  { name: "Sub-DPS / Hybrid", def: "Deals meaningful damage in short field windows or off-field (coordinated attacks), then feeds Concerto to the carry. Judged on Concerto speed and damage-per-second-of-field-time, not totals." },
  { name: "Amplifier (Deepen buffer)", def: "An Outro Skill that Amplifies/Deepens a specific damage type for the NEXT resonator (Sanhua 38% Basic, Mortefi 38% Heavy). Deepen is its own multiplier bucket, so these units barely age — the only question is whether the tag matches your carry." },
  { name: "Healer / Amplifier", def: "Sustain plus offense in one slot — heals while granting crit, ATK, or All-DMG Amplification (Shorekeeper, Verina, Buling). In a 3-unit game this dual role is why pure healers fall behind." },
  { name: "Shielder", def: "Prevents damage instead of healing it. Because WuWa rewards dodging and parrying, and Tower scores speed, shields without offensive buffs age worst of all." },
  { name: "Battery / Support", def: "Restores Resonance Energy or accelerates teammates' rotations. Valuable only when a carry is genuinely energy-starved; pure-stat batteries age poorly." },
];

function AttrChip({ id }) {
  const theme = ATTRIBUTE_THEME[ATTR[id]] || { color: "#8fd3d8" };
  return (
    <span className="tt-chip" style={{ "--chip": theme.color }}>
      {NAMES[id] || id}
    </span>
  );
}

export default function TiersTeams() {
  return (
    <>
      <style>{ttStyles}</style>

      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">Tier List</h1>
        <p className="subtitle">
          Who to build and what they do — v3.5 placements for the almanac roster
        </p>
      </header>

      <main className="rx-page">
        {/* ── Tier list ── */}
        {TIERS.map((t) => (
          <section key={t.tier} className="rx-group">
            <div className="rx-group-head">
              <h2 className="rx-group-title">
                <span className="tt-tier-badge" style={{ "--tier": t.color }}>{t.tier}</span>
                {t.label}
              </h2>
              <p className="rx-group-blurb">{t.blurb}</p>
            </div>
            <div className="tt-rows">
              {t.rows.map((r) => (
                <div key={r.id} className="tt-row">
                  <div className="tt-row-head">
                    <AttrChip id={r.id} />
                    <span className="tt-role">{r.role}</span>
                  </div>
                  <p className="tt-why">{r.why}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── Role glossary ── */}
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">Role Glossary</h2>
            <p className="rx-group-blurb">
              What each archetype actually does in a rotation — and what to look for before you build one.
            </p>
          </div>
          <div className="tt-rows">
            {GLOSSARY.map((g) => (
              <div key={g.name} className="tt-row">
                <div className="tt-row-head">
                  <span className="tt-gloss-name">{g.name}</span>
                </div>
                <p className="tt-why">{g.def}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pointer to the Team Lab ── */}
        <section className="rx-group">
          <div className="tt-row tt-pointer">
            <p className="tt-why">
              Looking for team comps? They live in the{" "}
              <a href="#/wuwa/teams">Team Lab</a> now — every viable trio, generated
              and ranked.
            </p>
          </div>
        </section>
      </main>

      <footer className="bottom">
        <p>
          Tier placements cross-checked against Prydwen, Game8, and community Tower lists · v3.5 (July 2026)
        </p>
        <p className="bottom-faint">
          Tiers judge each resonator in their best role within this roster — a C-tier favorite you enjoy is still worth building.
        </p>
      </footer>
    </>
  );
}

const ttStyles = `
.tt-tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-right: 12px;
  border: 1px solid var(--tier);
  color: var(--tier);
  border-radius: 4px;
  font-size: 18px;
  vertical-align: middle;
}

.tt-rows { display: flex; flex-direction: column; gap: 10px; }

.tt-row {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  min-width: 0;
}

.tt-row-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
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

.tt-role {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(236, 254, 255, 0.5);
}

.tt-gloss-name {
  font-size: 15px;
  font-weight: 600;
  color: #f0f9ff;
  letter-spacing: 0.03em;
}

.tt-why {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(236, 254, 255, 0.62);
  overflow-wrap: break-word;
}

.tt-pointer a {
  color: #8fd3d8;
  text-decoration: none;
  border-bottom: 1px solid rgba(143, 211, 216, 0.45);
}

.tt-pointer a:hover {
  border-bottom-color: #8fd3d8;
}
`;
