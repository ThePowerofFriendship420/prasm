/**
 * Guards for the rules that keep the public site honest and safe. These run
 * on every pull request (npm test, via .github/workflows/ci.yml).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { images, isPublishable, type MediaRef } from "@/lib/images";
import { supporterTiers, visibleTiers } from "@/content/supporters";

test("withheld photos of identifiable people are never publishable", () => {
  const withheld: MediaRef = {
    src: "/x.jpg",
    alt: "x",
    people: "identifiable",
    consent: "withheld",
  };
  assert.equal(isPublishable(withheld), false);
  assert.equal(isPublishable({ ...withheld, consent: "cleared" }), true);
  assert.equal(
    isPublishable({ ...withheld, people: "none", consent: "not-needed" }),
    true,
  );
});

test("every registered photo has an honest people/consent pairing", () => {
  for (const [key, m] of Object.entries(images) as [string, MediaRef][]) {
    if (m.people === "identifiable") {
      assert.notEqual(
        m.consent,
        "not-needed",
        `${key}: identifiable needs a decision`,
      );
    } else {
      assert.equal(m.consent, "not-needed", `${key}: nobody identifiable`);
    }
    assert.ok(m.alt.length > 10, `${key}: alt text describes the photo`);
  }
});

test("sample supporters never reach the live site", () => {
  const live = visibleTiers(false).flatMap((t) => t.supporters);
  assert.ok(live.every((s) => !s.sample));
  const samples = supporterTiers
    .flatMap((t) => t.supporters)
    .filter((s) => s.sample);
  const preview = visibleTiers(true).flatMap((t) => t.supporters);
  assert.ok(
    samples.every((s) => preview.includes(s)),
    "previews show samples",
  );
});

test("empty tiers are dropped rather than rendered as empty sections", () => {
  for (const t of visibleTiers(false)) assert.ok(t.supporters.length > 0);
});
