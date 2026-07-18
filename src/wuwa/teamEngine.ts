/* ============================================================
   TEAM ENGINE — Wuthering Waves Team Lab
   Pure module, no React.

   Enumerates every 3-resonator combination from the almanac
   roster, scores each trio from the resonators' `teamMeta`
   metadata, and overlays a curated list of community-proven
   comps. When a new resonator lands in wuwaData with teamMeta,
   it automatically joins the pool.

   Defensive by design: roster entries without a valid teamMeta
   are skipped with a console.warn, so this module works no
   matter which order the data/engine changes are merged in.
   ============================================================ */

import { RESONATORS } from "./wuwaData.ts";

/* ---------- Types (mirror of the teamMeta contract) ---------- */

export type UnitTier = "S" | "A" | "B" | "C";
export type RoleType =
  | "main-dps"
  | "sub-dps"
  | "amplifier"
  | "healer-amp"
  | "shielder"
  | "battery";
export type OutroKind = "deepen" | "amp-all" | "heal" | "energy" | "stagger" | "none";

export interface TeamMeta {
  tier: UnitTier;
  roleType: RoleType;
  dmgTags: string[];
  outro: { kind: OutroKind; tags: string[]; strength: 1 | 2 | 3; untilSwap: boolean };
  sustain: boolean;
  needsSustain: boolean;
  quickSwap: boolean;
  fieldHungry: boolean;
  coordinated: boolean;
  pairBonus?: { with: string; why: string }[];
}

export interface RosterUnit {
  id: string;
  name: string;
  element: string;
  meta: TeamMeta;
}

export type TeamTier = UnitTier | "theorycraft";

export interface Team {
  key: string;
  name: string;
  memberIds: string[];
  carryId: string;
  tier: TeamTier;
  score: number;
  proven: boolean;
  why: string;
  rotation?: string;
  hits: string[];
}

export const TEAM_TIER_ORDER = ["S", "A", "B", "theorycraft"] as const;
export type BucketKey = (typeof TEAM_TIER_ORDER)[number];

export interface TeamBuckets {
  S: Team[];
  A: Team[];
  B: Team[];
  theorycraft: Team[];
}

export interface GenerateResult {
  buckets: TeamBuckets;
  totalViable: number;
  totalEnumerated: number;
}

/* ---------- Scoring constants (calibrated — see runSanityChecks) ---------- */

const TIER_PTS: Record<UnitTier, number> = { S: 40, A: 28, B: 16, C: 6 };

const DEEPEN_PER_STRENGTH = 6; // deepen outro matching the recipient's damage
const AMP_PER_STRENGTH = 6; // untyped amp-all outro
const HEAL_OUTRO_BONUS = 4;
const ENERGY_OUTRO_BONUS = 4;
const STAGGER_OUTRO_BONUS = 3;
const SUSTAIN_BONUS = 10; // any real healing/shields on the team
const UNMET_SUSTAIN_PENALTY = -18; // per member whose HP costs go uncovered
const FIELD_CLASH_PENALTY = -12; // per pair of field-hungry members
const CLEAN_ROTATION_BONUS = 4; // field-hungry carry + two quick-swap enablers
const PAIR_BONUS = 8; // curated compounding loop present in the team
const ELEMENT_LOOP_BONUS = 12; // shared element + matching elemental deepen

export const TEAM_SCORE_THRESHOLDS = {
  S: 135,
  A: 95,
  B: 66,
  theorycraft: 50,
} as const;

/* ---------- Curated overlay ---------- */

interface CuratedTeam {
  id: string;
  name: string;
  memberIds: string[];
  tier: UnitTier;
  why: string;
  rotation: string;
}

const CURATED: CuratedTeam[] = [
  {
    id: "netrunner",
    name: "Netrunner Protocol",
    memberIds: ["shorekeeper", "rebecca", "lucy"],
    tier: "S",
    why: "The collab-exclusive Hack-Shifting core: Rebecca preps Hack states and her ramping ~50% All+Heavy amp for Lucy's Heavy burst while Lucy's Intro overloads Rebecca's turret, and Shorekeeper glues it with teamwide 15% Deepen, healing, and crit feed.",
    rotation:
      "Shorekeeper Skill + Liberation → Rebecca strings + Forte + turret → Outro into Lucy → TCP build → Deadlock → threaded Heavy burst, spending the amp fully before any swap (it drops when Lucy leaves the field).",
  },
  {
    id: "thousand-voices",
    name: "Hush of a Thousand Voices",
    memberIds: ["verina", "mortefi", "xuanling"],
    tier: "S",
    why: "Mortefi's 38% Heavy Deepen multiplies Xuanling's fully Heavy-tagged kit while his Marcato coordinated volleys fire passively through her long Melody windows; Verina layers the persistent 15% All-Type Deepen and off-field sustain on top.",
    rotation:
      "Verina Skill + Liberation + Outro → Mortefi double Skill + Liberation → Outro into Xuanling → extended Heavy strings and Liberation nuke inside the Deepen window (Mortefi's buff drops if she swaps early).",
  },
  {
    id: "heavy-metal",
    name: "Heavy Metal",
    memberIds: ["buling", "rebecca", "xuanling"],
    tier: "S",
    why: "Rebecca's ramping ~50% All+Heavy amp lands on the roster's best non-collab Heavy hypercarry, while Buling heals, amps teamwide, and applies Electro Flare to trigger Xuanling's guaranteed-crit Shadow procs.",
    rotation:
      "Buling heal + amp pass → Rebecca Fervor build + Liberation → Outro into Xuanling → stay on-field through the full 14s so the Overlimit Heavy amp reaches max stacks under her Melody strings.",
  },
  {
    id: "phoenix-waltz",
    name: "Phoenix Waltz",
    memberIds: ["shorekeeper", "encore", "changli"],
    tier: "S",
    why: "Mono-Fusion premier team: Changli's 20% Fusion + 25% Liberation Deepen feeds Encore's Cosmos Rave — the buff lasts 10s or until swap, so the Rave is executed immediately — while Encore's Thermal Field returns pure Fusion burn damage (not a buff) during Changli's windows; Shorekeeper holds Encore over her 70% HP gate and adds the teamwide Deepen.",
    rotation:
      "Shorekeeper Skill + Liberation + Outro → Changli True Sight casts + Liberation → Outro into Encore → full Cosmos Rave inside the 10s Deepen with no intermediate swap → Thermal Field covers the hand-back.",
  },
  {
    id: "golden-verdict",
    name: "Golden Verdict",
    memberIds: ["shorekeeper", "lynae", "luuk-herssen"],
    tier: "A",
    why: "The Tune Strain core both kits were tuned around: Lynae's stack generation and 15% All + 25% Liberation amp raise Luuk's Tune Break ceiling (spend it on-field — it drops on swap), with Shorekeeper sustaining his long Aureole field windows.",
    rotation:
      "Shorekeeper concerto pass → Lynae quick Skill/Liberation loop building Tune Strain → Outro into Luuk → extended basic-string and Tune Break sequence → Luuk Outro after Hyvatia for the +10% DMG Bonus hand-off.",
  },
  {
    id: "spectro-splitline",
    name: "Spectro Splitline",
    memberIds: ["verina", "lynae", "lucy"],
    tier: "A",
    why: "Lynae's 15% All + 25% Liberation amp and Verina's persistent teamwide 15% Deepen stack under Lucy's long Algorithm field windows, and Verina's healing covers the 20% HP cost of SQL-less Multi-threading.",
    rotation:
      "Verina buff/heal pass → Lynae quick loop → Outro into Lucy → Heavy/Liberation burst executed inside the 14s amp before any swap (Lynae's Outro amp is swap-fragile; only her 24% team buff persists).",
  },
  {
    id: "encore-classic",
    name: "Encore Classic",
    memberIds: ["verina", "sanhua", "encore"],
    tier: "B",
    why: "The canonical budget Encore shell: Sanhua's 38% Basic Deepen covers the ~70% of Encore's damage that is Rave basics off only ~5s of field time, while Verina holds Encore above her 70% HP damage gate.",
    rotation:
      "Verina Skill + Liberation + Outro → Sanhua Skill → Liberation → Detonate Heavy → Outro into Encore → uninterrupted Cosmos Rave (the Basic Deepen drops if Encore swaps out).",
  },
  {
    id: "budget-havoc",
    name: "Budget Havoc Cell",
    memberIds: ["buling", "sanhua", "danjin"],
    tier: "B",
    why: "Buling heals Danjin's constant HP self-drain and amplifies Skill DMG on exactly her damage axis, while Sanhua adds Havoc resonance and a ~5s concerto cycle to keep the team's tempo high.",
    rotation:
      "Buling heal + Skill amp field → Sanhua quick Skill/Liberation loop → Outro into Danjin → greedy zero-cooldown Skill/Chaoscleave spam while Buling's sustain absorbs the drain.",
  },
  {
    id: "starter-gunpowder",
    name: "Starter Gunpowder",
    memberIds: ["baizhi", "mortefi", "chixia"],
    tier: "C",
    why: "The free starter core: Mortefi's Marcato coordinated volleys fire during every one of Chixia's gatling strings, and Baizhi's 30s rolling heal Outro (with its 15% Deepen ticks) keeps her safe through load/dump cycles.",
    rotation:
      "Baizhi Skill + Liberation + Outro → Mortefi double Skill + Liberation → swap Chixia → build bullets → gatling dump + Liberation with coordinated volleys layered on top.",
  },
  {
    id: "budget-netrunner",
    name: "Budget Netrunner (Heavy Metal Lucy)",
    memberIds: ["verina", "mortefi", "lucy"],
    tier: "A",
    why: "The community-standard non-collab Lucy team: Mortefi's 38% Heavy Deepen lands directly on her Dual/Multi-threading Heavy burst and his coordinated volleys fire throughout her long Algorithm Compaction windows, while Verina covers the sustain her SQL-less 20%-HP casts demand and layers the teamwide 15% Deepen.",
    rotation:
      "Verina Skill + Liberation + Outro → Mortefi Skill ×2 + Liberation → Outro into Lucy → TCP build → Deadlock → Single/Dual/Multi-threading (with SQL) → Old Net Deep Dive.",
  },
  {
    id: "windward-phoenix",
    name: "Windward Phoenix (Changli–Yangyang Quick-Swap)",
    memberIds: ["changli", "yangyang", "verina"],
    tier: "A",
    why: "A free, fully quick-swap Changli duo: Yangyang's Whispering Breeze Outro feeds 20 Resonance Energy into Changli's Liberation cycling and her vortex groups enemies for True Sight dumps, with Verina adding off-field healing and the persistent 15% All-Type Deepen at minimal field cost.",
    rotation:
      "Yangyang Skill (group) → Liberation → Heron Echo → Outro into Changli → True Sight enhanced casts + Liberation → swap out on cooldowns; Verina weaves in for ~10s per loop.",
  },
  {
    id: "trigger-discipline",
    name: "Trigger Discipline (Rebecca Main-DPS Cell)",
    memberIds: ["verina", "sanhua", "rebecca"],
    tier: "B",
    why: "The recognized budget way to run Rebecca on-field: her damage identity is Basic Attack DMG, so Sanhua's 38% Basic Deepen plus the Moonlit/Heron hand-off converts directly into gun strings and Forte volleys off ~5s of Sanhua field time. Mid-tier ceiling, but every slot is free and it clears most content.",
    rotation:
      "Verina buff/heal pass → Sanhua Intro → Skill → Liberation → timed Detonate Heavy → Outro into Rebecca → basic strings to 120 Fervor → 3-stage Forte volley → 'BOOM! Fireworks!' turret, staying on-field so Sanhua's Deepen holds.",
  },
  {
    id: "liondance-frostline",
    name: "Liondance Frostline",
    memberIds: ["shorekeeper", "sanhua", "lingyang"],
    tier: "B",
    why: "The community-standard in-roster Lingyang team: Sanhua brings Glacio resonance, a ~5s concerto loop, and the 38% Basic Deepen covering his Glacio-infused basic chains in Striding Lion, while Shorekeeper's ER-scaled crit feed closes his tight crit budget and sustains his long transformed windows. Honest B — his best available shell for the weakest carry archetype.",
    rotation:
      "Shorekeeper Skill + Liberation (Stellarealm down) → Sanhua Skill → Liberation → Detonate → Outro into Lingyang Intro (upgrades Stellarealm) → Liberation into the aerial combo loop, staying airborne until the form ends.",
  },
  {
    id: "thunder-appraisal",
    name: "Thunder Appraisal (Coordinated Core)",
    memberIds: ["youhu", "yuanwu", "rebecca"],
    tier: "B",
    why: "The roster's one true coordinated-attack team: Youhu's 100% Coordinated Deepen (28s, persists through swaps) doubles the Thunder Wedge's DEF-scaled hits, and Rebecca's rapid on-field Electro strings are an ideal Wedge trigger while adding her own turret and burst. Chip-damage ceiling keeps it B, but it is cheap, safe, and self-healing.",
    rotation:
      "Youhu appraisal heal → Outro INTO Yuanwu (the amp must land on the coordinated attacker) → Yuanwu plants Thunder Wedge + Liberation → swap Rebecca and machine-gun inside the Field so every hit triggers amplified coordinated attacks.",
  },
  {
    id: "ironclad-bloodprice",
    name: "Ironclad Bloodprice (Protected Danjin)",
    memberIds: ["taoqi", "danjin", "baizhi"],
    tier: "B",
    why: "The classic all-4-star tank-type Danjin shell: Taoqi's swap-persistent shields plus her 38% Resonance Skill Deepen land exactly on Danjin's zero-cooldown, HP-draining skill spam, and Baizhi's 30s rolling heal Outro patches the self-drain — trading tempo for maximum error tolerance versus the Buling budget cell.",
    rotation:
      "Baizhi Skill + Liberation + Outro onto Danjin → Taoqi shield + Outro (Skill Deepen) into Danjin → greedy Skill/Chaoscleave loops without dodging out; Taoqi's Deepen drops if Danjin swaps, so burn the full window on-field.",
  },
];

const CURATED_BY_KEY = new Map<string, CuratedTeam>(
  CURATED.map((c) => [teamKey(c.memberIds), c])
);

/* ---------- Roster access (defensive) ---------- */

function isTeamMeta(v: unknown): v is TeamMeta {
  if (!v || typeof v !== "object") return false;
  const m = v as Partial<TeamMeta>;
  return (
    typeof m.tier === "string" &&
    m.tier in TIER_PTS &&
    typeof m.roleType === "string" &&
    Array.isArray(m.dmgTags) &&
    !!m.outro &&
    typeof m.outro === "object" &&
    Array.isArray(m.outro.tags)
  );
}

let warnedMissing = false;

export function getRoster(): RosterUnit[] {
  const raw = RESONATORS as unknown as Array<{
    id: string;
    name: string;
    element: string;
    teamMeta?: unknown;
  }>;
  const units: RosterUnit[] = [];
  const skipped: string[] = [];
  for (const r of raw) {
    if (isTeamMeta(r.teamMeta)) {
      units.push({ id: r.id, name: r.name, element: r.element, meta: r.teamMeta });
    } else {
      skipped.push(r.id);
    }
  }
  if (skipped.length > 0 && !warnedMissing) {
    warnedMissing = true;
    console.warn(
      `[teamEngine] ${skipped.length} resonator(s) lack a valid teamMeta and were skipped: ${skipped.join(", ")}`
    );
  }
  return units;
}

/* ---------- Helpers ---------- */

export function teamKey(memberIds: string[]): string {
  return [...memberIds].sort().join("+");
}

export function shortName(fullName: string): string {
  const idx = fullName.lastIndexOf(":");
  return idx >= 0 ? fullName.slice(idx + 1).trim() : fullName;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Hit {
  text: string;
  pts: number;
}

function formatHit(h: Hit): string {
  const sign = h.pts >= 0 ? "+" : "−";
  return `${h.text} (${sign}${Math.abs(h.pts)})`;
}

/* ---------- Viability + carry selection ---------- */

function isViable(units: RosterUnit[]): boolean {
  return units.some(
    (u) =>
      (u.meta.roleType === "main-dps" || u.meta.roleType === "sub-dps") &&
      u.meta.dmgTags.length > 0
  );
}

function pickCarry(units: RosterUnit[]): RosterUnit {
  const withTags = (role: RoleType) =>
    units.filter((u) => u.meta.roleType === role && u.meta.dmgTags.length > 0);
  const pool = withTags("main-dps");
  const fallback = pool.length > 0 ? pool : withTags("sub-dps");
  return [...fallback].sort((a, b) => TIER_PTS[b.meta.tier] - TIER_PTS[a.meta.tier])[0];
}

/* ---------- Scoring ---------- */

export interface TeamEvaluation {
  score: number;
  carry: RosterUnit;
  hits: Hit[];
}

export function evaluateTeam(units: RosterUnit[]): TeamEvaluation | null {
  const carry = pickCarry(units);
  // No unit qualifies as a carry (e.g. three pure supports) — the trio is
  // nonviable; internal callers pre-filter with isViable, but guard for
  // external callers so this can never throw.
  if (!carry) return null;
  const hits: Hit[] = [];
  const add = (text: string, pts: number) => {
    hits.push({ text, pts });
  };

  let score = units.reduce((s, u) => s + TIER_PTS[u.meta.tier], 0);

  const carryName = shortName(carry.name);
  const carryTargets = new Set<string>([...carry.meta.dmgTags, carry.element, "all"]);

  /* Outro contributions from the non-carry members */
  for (const u of units) {
    if (u === carry) continue;
    const o = u.meta.outro;
    const uName = shortName(u.name);

    if (o.kind === "deepen") {
      const directTags = o.tags.filter((t) => t !== "coordinated" && carryTargets.has(t));
      const coordRecipient = o.tags.includes("coordinated")
        ? units.find((t) => t !== u && t.meta.coordinated)
        : undefined;

      let recipient: RosterUnit | undefined;
      let text = "";
      if (directTags.length > 0) {
        recipient = carry;
        const tag = directTags[0];
        text =
          tag === carry.element
            ? `${uName}'s ${cap(tag)} Deepen matches ${carryName}'s attribute`
            : `${uName}'s ${cap(tag)} Deepen feeds ${carryName}'s ${tag} damage`;
      } else if (coordRecipient) {
        recipient = coordRecipient;
        text = `${uName}'s Coordinated Deepen doubles ${shortName(coordRecipient.name)}'s off-field hits`;
      }

      if (recipient) {
        let pts = DEEPEN_PER_STRENGTH * o.strength;
        if (o.untilSwap && recipient.meta.quickSwap && !recipient.meta.fieldHungry) {
          pts = Math.round(pts / 2);
          text += `, though the buff drops when ${shortName(recipient.name)} swaps out`;
        }
        score += pts;
        add(text, pts);
      }
    } else if (o.kind === "amp-all") {
      const pts = AMP_PER_STRENGTH * o.strength;
      score += pts;
      add(`${uName}'s Outro amplifies everything ${carryName} deals`, pts);
    } else if (o.kind === "heal") {
      score += HEAL_OUTRO_BONUS;
      add(`${uName}'s Outro heals the active resonator`, HEAL_OUTRO_BONUS);
    } else if (o.kind === "energy") {
      score += ENERGY_OUTRO_BONUS;
      add(`${uName}'s Outro feeds Resonance Energy into the rotation`, ENERGY_OUTRO_BONUS);
    } else if (o.kind === "stagger") {
      score += STAGGER_OUTRO_BONUS;
      add(`${uName}'s Outro adds stagger pressure`, STAGGER_OUTRO_BONUS);
    }
  }

  /* Sustain */
  const sustainers = units.filter((u) => u.meta.sustain);
  const needy = units.filter((u) => u.meta.needsSustain);
  if (sustainers.length > 0) {
    const text =
      needy.length > 0
        ? `${shortName(sustainers[0].name)} sustains ${needy
            .map((n) => shortName(n.name))
            .join(" and ")}'s HP costs`
        : `${shortName(sustainers[0].name)} keeps the team standing`;
    score += SUSTAIN_BONUS;
    add(text, SUSTAIN_BONUS);
  } else {
    for (const n of needy) {
      score += UNMET_SUSTAIN_PENALTY;
      add(`${shortName(n.name)}'s HP costs go uncovered — no healer or shielder`, UNMET_SUSTAIN_PENALTY);
    }
  }

  /* Field-time friction / clean rotation */
  const hungry = units.filter((u) => u.meta.fieldHungry);
  for (let i = 0; i < hungry.length; i++) {
    for (let j = i + 1; j < hungry.length; j++) {
      score += FIELD_CLASH_PENALTY;
      add(
        `${shortName(hungry[i].name)} and ${shortName(hungry[j].name)} fight over field time`,
        FIELD_CLASH_PENALTY
      );
    }
  }
  if (
    carry.meta.fieldHungry &&
    units.every((u) => u === carry || u.meta.quickSwap)
  ) {
    score += CLEAN_ROTATION_BONUS;
    add(`Quick-swap enablers keep the field clear for ${carryName}`, CLEAN_ROTATION_BONUS);
  }

  /* Curated pair loops */
  const seenPairs = new Set<string>();
  for (const u of units) {
    for (const pb of u.meta.pairBonus ?? []) {
      const partner = units.find((t) => t.id === pb.with);
      if (!partner) continue;
      const k = [u.id, partner.id].sort().join("|");
      if (seenPairs.has(k)) continue;
      seenPairs.add(k);
      score += PAIR_BONUS;
      add(`${shortName(u.name)} + ${shortName(partner.name)}: ${pb.why}`, PAIR_BONUS);
    }
  }

  /* Element loop: shared element + a matching elemental Deepen */
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const a = units[i];
      const b = units[j];
      if (a.element !== b.element) continue;
      const hasElemDeepen = [a, b].some(
        (u) => u.meta.outro.kind === "deepen" && u.meta.outro.tags.includes(a.element)
      );
      if (hasElemDeepen) {
        score += ELEMENT_LOOP_BONUS;
        add(
          `${shortName(a.name)} and ${shortName(b.name)} close a mono-${cap(a.element)} Deepen loop`,
          ELEMENT_LOOP_BONUS
        );
      }
    }
  }

  return { score, carry, hits };
}

function tierFromScore(score: number): TeamTier | null {
  if (score >= TEAM_SCORE_THRESHOLDS.S) return "S";
  if (score >= TEAM_SCORE_THRESHOLDS.A) return "A";
  if (score >= TEAM_SCORE_THRESHOLDS.B) return "B";
  if (score >= TEAM_SCORE_THRESHOLDS.theorycraft) return "theorycraft";
  return null;
}

function buildWhy(hits: Hit[]): string {
  const top = hits
    .filter((h) => h.pts > 0)
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 2)
    .map((h) => h.text);
  if (top.length === 0) {
    return "No standout synergies — the raw strength of the three units carries it.";
  }
  return `${top.join("; ")}.`;
}

/* ---------- Generation ---------- */

export function generateTeams(): GenerateResult {
  const roster = getRoster();
  const buckets: TeamBuckets = { S: [], A: [], B: [], theorycraft: [] };
  let totalEnumerated = 0;
  let totalViable = 0;

  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      for (let k = j + 1; k < roster.length; k++) {
        totalEnumerated++;
        const units = [roster[i], roster[j], roster[k]];
        if (!isViable(units)) continue;
        totalViable++;

        const evaln = evaluateTeam(units);
        if (!evaln) continue;
        const { score, carry, hits } = evaln;
        const key = teamKey(units.map((u) => u.id));
        const curated = CURATED_BY_KEY.get(key);
        const formattedHits = hits.map(formatHit);

        if (curated) {
          const bucket: BucketKey = curated.tier === "C" ? "B" : curated.tier;
          buckets[bucket].push({
            key,
            name: curated.name,
            memberIds: curated.memberIds,
            carryId: carry.id,
            tier: curated.tier,
            score,
            proven: true,
            why: curated.why,
            rotation: curated.rotation,
            hits: formattedHits,
          });
        } else {
          const tier = tierFromScore(score);
          if (!tier) continue;
          const ordered = [
            ...units.filter((u) => u !== carry).map((u) => u.id),
            carry.id,
          ];
          const bucket: BucketKey = tier === "theorycraft" ? "theorycraft" : (tier as BucketKey);
          buckets[bucket].push({
            key,
            name: units.map((u) => shortName(u.name)).join(" + "),
            memberIds: ordered,
            carryId: carry.id,
            tier,
            score,
            proven: false,
            why: buildWhy(hits),
            hits: formattedHits,
          });
        }
      }
    }
  }

  for (const b of TEAM_TIER_ORDER) {
    buckets[b].sort((x, y) => y.score - x.score);
  }

  return { buckets, totalViable, totalEnumerated };
}

/* ---------- Calibration sanity checks ---------- */

export function runSanityChecks(): string[] {
  const failures: string[] = [];
  const roster = getRoster();
  if (roster.length < 3) return failures; // metadata not merged yet — nothing to verify

  const byId = new Map(roster.map((u) => [u.id, u]));
  const scoreOf = (ids: string[]): number | null => {
    const units = ids.map((id) => byId.get(id));
    if (units.some((u) => !u)) return null;
    const evaln = evaluateTeam(units as RosterUnit[]);
    return evaln ? evaln.score : null;
  };

  for (const c of CURATED) {
    const s = scoreOf(c.memberIds);
    if (s == null) {
      failures.push(`curated "${c.id}": some member is missing teamMeta`);
      continue;
    }
    if (c.tier === "S" && s < TEAM_SCORE_THRESHOLDS.S) {
      failures.push(`curated S team "${c.id}" scores ${s} (< S threshold ${TEAM_SCORE_THRESHOLDS.S})`);
    }
    if (
      (c.id === "encore-classic" || c.id === "budget-havoc") &&
      !(s >= TEAM_SCORE_THRESHOLDS.B && s < TEAM_SCORE_THRESHOLDS.S)
    ) {
      failures.push(`"${c.id}" should score in the B..A band, got ${s}`);
    }
    if (
      c.id === "starter-gunpowder" &&
      !(s >= TEAM_SCORE_THRESHOLDS.theorycraft && s < TEAM_SCORE_THRESHOLDS.A)
    ) {
      failures.push(`"starter-gunpowder" should score in the theorycraft..B band, got ${s}`);
    }
  }

  /* No trio of three C-tier units may exceed B */
  const cUnits = roster.filter((u) => u.meta.tier === "C");
  for (let i = 0; i < cUnits.length; i++) {
    for (let j = i + 1; j < cUnits.length; j++) {
      for (let k = j + 1; k < cUnits.length; k++) {
        const units = [cUnits[i], cUnits[j], cUnits[k]];
        if (!isViable(units)) continue;
        const evaln = evaluateTeam(units);
        if (!evaln) continue;
        const { score } = evaln;
        if (score >= TEAM_SCORE_THRESHOLDS.A) {
          failures.push(
            `all-C team ${units.map((u) => u.id).join("+")} scores ${score} (>= A threshold ${TEAM_SCORE_THRESHOLDS.A})`
          );
        }
      }
    }
  }

  if (failures.length > 0) {
    console.warn("[teamEngine] calibration sanity checks FAILED:", failures);
  }
  return failures;
}

/* Run once at module load in dev builds only; never throw. */
const viteEnv = (import.meta as unknown as { env?: { DEV?: boolean } }).env;
if (viteEnv?.DEV) {
  try {
    runSanityChecks();
  } catch (err) {
    console.warn("[teamEngine] sanity checks crashed:", err);
  }
}
