import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRound } from "@/lib/game/createRound";
import { resolveRound, type RoundSnapshot } from "@/lib/game/resolution";
import { HEARTS_TO_WIN, RUMOURS_TO_LOSE, SIGNAL_TYPES, type Signal } from "@/lib/game/content";
import { ActionSchema } from "@/lib/game/schema";

const TWO_SIGNALS: Signal[] = [
  { type: "heart", target: "tone:tender" },
  { type: "thorn", target: "route:fast" },
];

function base(overrides: Partial<RoundSnapshot> = {}): RoundSnapshot {
  return {
    moodKey: "tender",
    dangerRouteKey: "fast",
    rivalRouteKey: "safe",
    confidantAction: "delay_rival",
    signals: TWO_SIGNALS,
    suitorToneKey: "tender",
    suitorChosenRouteKey: "secret",
    heartsEarnedSoFar: 0,
    rumoursSoFar: 0,
    ...overrides,
  };
}

describe("round generation", () => {
  it("only produces Fast, Safe, and Secret routes", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const round = createRound(seed);
      expect(round.routes.map((r) => r.key).sort()).toEqual(["fast", "safe", "secret"]);
      expect(["fast", "safe", "secret"]).toContain(round.dangerRouteKey);
      expect(["fast", "safe", "secret"]).toContain(round.rivalRouteKey);
    }
  });

  it("only produces Tender, Bold, and Honest moods", () => {
    for (let seed = 1; seed <= 50; seed++) {
      expect(["tender", "bold", "honest"]).toContain(createRound(seed).moodKey);
    }
  });
});

describe("signals and action validation", () => {
  it("only uses Heart, Thorn, Clock, and Mask as active signals", () => {
    expect(SIGNAL_TYPES).toEqual(["heart", "thorn", "clock", "mask"]);
  });

  it("Confidant can place exactly 2 signals, not 3", () => {
    expect(ActionSchema.safeParse({
      type: "confidant_commit",
      action: "clear_danger",
      signals: TWO_SIGNALS,
    }).success).toBe(true);

    expect(ActionSchema.safeParse({
      type: "confidant_commit",
      action: "clear_danger",
      signals: [...TWO_SIGNALS, { type: "mask", target: "route:safe" }],
    }).success).toBe(false);
  });

  it("rejects retired signal types", () => {
    expect(ActionSchema.safeParse({
      type: "confidant_commit",
      action: "clear_danger",
      signals: [
        { type: "eye", target: "route:fast" },
        { type: "heart", target: "tone:tender" },
      ],
    }).success).toBe(false);
  });
});

describe("simplified resolver", () => {
  it("danger route without Clear Danger gives Rumour", () => {
    const result = resolveRound(base({
      confidantAction: "delay_rival",
      suitorChosenRouteKey: "fast",
      dangerRouteKey: "fast",
      rivalRouteKey: "safe",
    }));
    expect(result.outcome).toBe("fail");
    expect(result.rumoursDelta).toBe(1);
  });

  it("Clear Danger protects the danger route", () => {
    const result = resolveRound(base({
      confidantAction: "clear_danger",
      suitorChosenRouteKey: "fast",
      dangerRouteKey: "fast",
      rivalRouteKey: "safe",
    }));
    expect(result.outcome).toBe("success");
    expect(result.heartsDelta).toBe(1);
  });

  it("Rival route with wrong tone gives Rumour", () => {
    const result = resolveRound(base({
      moodKey: "honest",
      suitorToneKey: "bold",
      suitorChosenRouteKey: "safe",
      rivalRouteKey: "safe",
      dangerRouteKey: "fast",
      confidantAction: "clear_danger",
    }));
    expect(result.outcome).toBe("fail");
  });

  it("Rival route with correct tone gives Heart", () => {
    const result = resolveRound(base({
      moodKey: "bold",
      suitorToneKey: "bold",
      suitorChosenRouteKey: "safe",
      rivalRouteKey: "safe",
      dangerRouteKey: "fast",
      confidantAction: "clear_danger",
    }));
    expect(result.outcome).toBe("success");
  });

  it("Delay Rival protects the Rival route", () => {
    const result = resolveRound(base({
      moodKey: "honest",
      suitorToneKey: "bold",
      suitorChosenRouteKey: "safe",
      rivalRouteKey: "safe",
      dangerRouteKey: "fast",
      confidantAction: "delay_rival",
    }));
    expect(result.outcome).toBe("success");
  });

  it("Strengthen Letter saves a wrong-tone Rival route", () => {
    const result = resolveRound(base({
      moodKey: "honest",
      suitorToneKey: "bold",
      suitorChosenRouteKey: "safe",
      rivalRouteKey: "safe",
      dangerRouteKey: "fast",
      confidantAction: "strengthen_letter",
    }));
    expect(result.outcome).toBe("success");
  });

  it("non-danger, non-Rival route gives Heart", () => {
    const result = resolveRound(base({
      suitorChosenRouteKey: "secret",
      dangerRouteKey: "fast",
      rivalRouteKey: "safe",
      confidantAction: "clear_danger",
      suitorToneKey: "bold",
      moodKey: "honest",
    }));
    expect(result.outcome).toBe("success");
  });

  it("first to 3 Hearts wins", () => {
    const result = resolveRound(base({ heartsEarnedSoFar: 2 }));
    expect(2 + result.heartsDelta).toBe(HEARTS_TO_WIN);
  });

  it("3 Rumours loses", () => {
    const result = resolveRound(base({
      rumoursSoFar: 2,
      confidantAction: "delay_rival",
      suitorChosenRouteKey: "fast",
      dangerRouteKey: "fast",
    }));
    expect(2 + result.rumoursDelta).toBe(RUMOURS_TO_LOSE);
  });
});

describe("room redaction SQL", () => {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0003_simplified_rules.sql"), "utf8");

  it("Suitor base view does not expose hidden facts or action", () => {
    const basePayload = sql
      .split("v_round_payload := jsonb_build_object(")[1]
      .split("  if v_is_confidant then")[0];

    expect(basePayload).not.toContain("'mood_key'");
    expect(basePayload).not.toContain("'danger_route'");
    expect(basePayload).not.toContain("'rival_route'");
    expect(basePayload).not.toContain("'confidant_action'");
  });

  it("Confidant view exposes hidden facts", () => {
    const confidantBlock = sql
      .split("if v_is_confidant then")[1]
      .split("  if v_round.current_phase")[0];

    expect(confidantBlock).toContain("'mood_key'");
    expect(confidantBlock).toContain("'danger_route'");
    expect(confidantBlock).toContain("'rival_route'");
    expect(confidantBlock).toContain("'confidant_action'");
  });
});
