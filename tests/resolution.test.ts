import { describe, it, expect } from "vitest";
import { resolveRound, type RoundSnapshot } from "@/lib/game/resolution";
import type { RouteKey, ObstacleKey } from "@/lib/game/content";

/**
 * Coverage for the patched rules (R1–R15) and the full resolution order
 * defined in Section 2 of the plan.
 */

function base(overrides: Partial<RoundSnapshot> = {}): RoundSnapshot {
  const routes = [
    { key: "garden" as RouteKey,   baseTime: 3, obstacles: [] as ObstacleKey[], originalObstacles: [] as ObstacleKey[] },
    { key: "gallery" as RouteKey,  baseTime: 4, obstacles: [] as ObstacleKey[], originalObstacles: [] as ObstacleKey[] },
    { key: "corridor" as RouteKey, baseTime: 5, obstacles: [] as ObstacleKey[], originalObstacles: [] as ObstacleKey[] },
  ];
  return {
    recipientKey: "celeste",
    intention: "Apology",
    routes,
    rivalRouteKey: "gallery",
    rivalTraitKey: "fast_courier",
    confidantPlayed: [],
    suitorPlayed: null,
    suitorToneKey: "honest",
    suitorChosenRouteKey: "garden",
    heartsEarnedSoFar: 0,
    rumoursSoFar: 0,
    gossipOnRivalRoute: false,
    ...overrides,
  };
}

describe("blocking obstacles", () => {
  it("locked door without find_key fails the round", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: ["locked_door"], originalObstacles: ["locked_door"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      suitorChosenRouteKey: "garden",
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("fail_blocking");
    expect(r.rumoursDelta).toBe(1);
  });

  it("locked door with find_key passes the block check", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 2, obstacles: ["locked_door"], originalObstacles: ["locked_door"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      suitorChosenRouteKey: "garden",
      confidantPlayed: ["find_key"],
      rivalRouteKey: "corridor",
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("success");
  });

  it("cover_story converts a blocking failure's rumour to 0", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: ["locked_door"], originalObstacles: ["locked_door"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      suitorChosenRouteKey: "garden",
      confidantPlayed: ["cover_story"],
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("fail_blocking");
    expect(r.rumoursDelta).toBe(0);
  });
});

describe("travel time comparisons", () => {
  it("suitor arrives first on shorter route", () => {
    const s = base({
      rivalRouteKey: "corridor",
      suitorChosenRouteKey: "garden",
      suitorToneKey: "bold",
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("success");
    expect(r.suitorTravelTime).toBeLessThan(r.rivalTravelTime);
  });

  it("rival arrives first when suitor's route is slower", () => {
    const s = base({
      rivalRouteKey: "garden",
      suitorChosenRouteKey: "corridor",
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("fail");
  });

  it("guard obstacle adds +2 TT and is cancellable", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: ["guard"], originalObstacles: ["guard"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      rivalRouteKey: "corridor",
      suitorToneKey: "honest",
    });
    const without = resolveRound(s);
    const withCancel = resolveRound({ ...s, confidantPlayed: ["distract_guard"] });
    expect(withCancel.suitorTravelTime).toBe(without.suitorTravelTime - 2);
  });
});

describe("R13 brave shortcut", () => {
  it("subtracts 1 TT and voids the four protection cards", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: ["guard"], originalObstacles: ["guard"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      rivalRouteKey: "corridor",
      suitorPlayed: "brave_shortcut",
      confidantPlayed: ["distract_guard"],
      suitorToneKey: "honest",
    });
    const r = resolveRound(s);
    // Brave Shortcut voids distract_guard, so guard still adds +2 and shortcut subtracts 1
    // 3 + 2 (guard active) - 1 (shortcut) = 4
    expect(r.suitorTravelTime).toBe(4);
  });
});

describe("R6 rival LP formula", () => {
  it("rival LP scales with hearts earned so far", () => {
    const a = resolveRound(base({ heartsEarnedSoFar: 0, suitorChosenRouteKey: "gallery", rivalRouteKey: "garden" }));
    const b = resolveRound(base({ heartsEarnedSoFar: 3, suitorChosenRouteKey: "gallery", rivalRouteKey: "garden" }));
    expect(b.rivalLetterPower).toBe(a.rivalLetterPower + 3);
  });

  it("gossip on rival route bumps rival LP unless tone is honest", () => {
    const tender = resolveRound(base({
      suitorToneKey: "tender",
      gossipOnRivalRoute: true,
      suitorChosenRouteKey: "gallery",
      rivalRouteKey: "garden",
    }));
    const honest = resolveRound(base({
      suitorToneKey: "honest",
      gossipOnRivalRoute: true,
      suitorChosenRouteKey: "gallery",
      rivalRouteKey: "garden",
    }));
    expect(tender.rivalLetterPower).toBe(honest.rivalLetterPower + 1);
  });
});

describe("LP tiebreak when travel time ties", () => {
  it("higher suitor LP wins a TT tie", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "gallery", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      rivalRouteKey: "gallery",
      rivalTraitKey: "hidden_seal", // no TT mod
      suitorChosenRouteKey: "garden",
      suitorToneKey: "honest",
      confidantPlayed: ["encouraging_note"],
    });
    const r = resolveRound(s);
    expect(r.suitorTravelTime).toBe(r.rivalTravelTime);
    expect(r.outcome).toBe("success");
  });
});

describe("R15 tone tiebreaker", () => {
  /**
   * Use `hidden_seal` rival trait — it does not affect TT or LP, only the
   * Read-the-Seal card. Combined with matched route base times this gives us
   * a clean TT tie to force the LP and tone tiebreakers.
   */
  function tieSetup(
    toneKey: "tender" | "bold" | "honest" | "playful",
    extra: Partial<RoundSnapshot> = {},
  ) {
    return base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "gallery", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      rivalRouteKey: "gallery",
      suitorChosenRouteKey: "garden",
      suitorToneKey: toneKey,
      rivalTraitKey: "hidden_seal",
      ...extra,
    });
  }

  it("tender wins ties", () => {
    // celeste likes tender. tender powerDelta +1. pref +1. Suitor LP = 6. Rival LP = 3 + 3 hearts = 6.
    // tender travelDelta +1 → Suitor TT = 4, but tender's TT penalty means we need rival TT = 4 too.
    // hidden_seal doesn't shorten rival TT. Need a route alignment.
    // Simpler: pick gallery base 3 + tender +1 = 4, rival on gallery (also 4)? No — they can't share routes.
    // Use a different LP construction: bold-route + tender from corridor → too many vars.
    // Cleanest approach: just verify Tender DOES win when LP ties at TT-tied scenario via setup.
    const s = tieSetup("tender", {
      routes: [
        { key: "garden",   baseTime: 2, obstacles: [], originalObstacles: [] },
        { key: "gallery",  baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      recipientKey: "celeste",
      heartsEarnedSoFar: 3,
    });
    // Suitor TT = 2 + 1 = 3. Rival TT = 3. Tied.
    // Suitor LP = 4 + 1 (tender) + 1 (celeste likes tender) = 6. Rival LP = 3 + 3 = 6. Pure tie. Tender wins.
    const r = resolveRound(s);
    expect(r.suitorTravelTime).toBe(r.rivalTravelTime);
    expect(r.suitorLetterPower).toBe(r.rivalLetterPower);
    expect(r.outcome).toBe("success");
  });

  it("bold loses ties", () => {
    // heir likes bold +1. bold LP -1. bold TT -1.
    // route base 3 + bold -1 = 2 suitor TT. Rival on corridor base 5 won't tie. Need different setup.
    const s = tieSetup("bold", {
      routes: [
        { key: "garden", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "gallery", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      recipientKey: "heir",
      heartsEarnedSoFar: 1,
    });
    // Suitor TT = 4 + (-1) = 3 = Rival TT (3). LP: 4 + (-1) + 1 (heir likes bold) = 4. Rival LP = 3 + 1 = 4. Tie.
    const r = resolveRound(s);
    expect(r.suitorTravelTime).toBe(r.rivalTravelTime);
    expect(r.suitorLetterPower).toBe(r.rivalLetterPower);
    expect(r.outcome).toBe("fail");
  });

  it("honest wins iff gossip cleared", () => {
    // celeste likes honest +1. honest LP/TT 0. Suitor LP = 5. Rival LP = 3+2 = 5.
    const setup = (cleared: boolean) =>
      tieSetup("honest", {
        recipientKey: "celeste",
        heartsEarnedSoFar: 2,
        confidantPlayed: cleared ? ["clear_gossip"] : [],
      });

    expect(resolveRound(setup(true)).outcome).toBe("success");
    expect(resolveRound(setup(false)).outcome).toBe("fail");
  });

  it("playful wins iff encouraging_note played", () => {
    // heir likes playful +1. playful LP/TT 0. With note: suitor LP = 5+1 = 6 > rival 5 → success via LP.
    // Without note: 5 = 5 → tone tiebreak → playful loses without note.
    const setup = (note: boolean) =>
      tieSetup("playful", {
        recipientKey: "heir",
        heartsEarnedSoFar: 2,
        confidantPlayed: note ? ["encouraging_note"] : [],
      });

    expect(resolveRound(setup(true)).outcome).toBe("success");
    expect(resolveRound(setup(false)).outcome).toBe("fail");
  });
});

describe("Sealed Promise overrides", () => {
  it("converts a tied LP loss into a win", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "gallery", baseTime: 3, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      rivalRouteKey: "gallery",
      suitorChosenRouteKey: "garden",
      suitorToneKey: "bold",
      recipientKey: "celeste", // dislikes bold → -1
      heartsEarnedSoFar: 2,
      suitorPlayed: "sealed_promise",
    });
    const r = resolveRound(s);
    expect(r.outcome).toBe("success");
  });
});

describe("rival traits", () => {
  it("fast_courier shaves 1 off rival TT", () => {
    const fast = resolveRound(base({ rivalTraitKey: "fast_courier" }));
    const default_ = resolveRound(base({ rivalTraitKey: "silver_tongue" }));
    expect(fast.rivalTravelTime).toBe(default_.rivalTravelTime - 1);
  });

  it("silver_tongue adds +1 rival LP", () => {
    const silver = resolveRound(base({ rivalTraitKey: "silver_tongue" }));
    const fast = resolveRound(base({ rivalTraitKey: "fast_courier" }));
    expect(silver.rivalLetterPower).toBe(fast.rivalLetterPower + 1);
  });

  it("jealous_rival adds +1 rival LP once 2+ hearts earned", () => {
    const early = resolveRound(base({ rivalTraitKey: "jealous_rival", heartsEarnedSoFar: 1 }));
    const late = resolveRound(base({ rivalTraitKey: "jealous_rival", heartsEarnedSoFar: 2 }));
    expect(late.rivalLetterPower).toBe(early.rivalLetterPower + 1 + 1); // +1 from hearts, +1 from trait
  });
});

describe("support card effects", () => {
  it("delay_rival adds +1 rival TT", () => {
    const with_ = resolveRound(base({ confidantPlayed: ["delay_rival"] }));
    const without = resolveRound(base());
    expect(with_.rivalTravelTime).toBe(without.rivalTravelTime + 1);
  });

  it("secret_map subtracts 1 from suitor TT", () => {
    const with_ = resolveRound(base({ confidantPlayed: ["secret_map"] }));
    const without = resolveRound(base());
    expect(with_.suitorTravelTime).toBe(without.suitorTravelTime - 1);
  });

  it("safe_passage cancels first obstacle (no double-dip with brave_shortcut)", () => {
    const s = base({
      routes: [
        { key: "garden", baseTime: 3, obstacles: ["guard"], originalObstacles: ["guard"] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      confidantPlayed: ["safe_passage"],
      suitorPlayed: "brave_shortcut",
      rivalRouteKey: "corridor",
    });
    const r = resolveRound(s);
    // Brave shortcut voids safe_passage; guard still active. 3 (base) +0(honest) +2(guard) -1(shortcut) = 4
    expect(r.suitorTravelTime).toBe(4);
  });
});

describe("travel time floor", () => {
  it("never goes below 1", () => {
    const r = resolveRound(base({
      routes: [
        { key: "garden", baseTime: 1, obstacles: [], originalObstacles: [] },
        { key: "gallery", baseTime: 4, obstacles: [], originalObstacles: [] },
        { key: "corridor", baseTime: 5, obstacles: [], originalObstacles: [] },
      ],
      suitorChosenRouteKey: "garden",
      suitorToneKey: "bold",
      confidantPlayed: ["secret_map"],
    }));
    expect(r.suitorTravelTime).toBeGreaterThanOrEqual(1);
  });
});
