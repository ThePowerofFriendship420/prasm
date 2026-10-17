import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/CTASection";
import { SupporterAvatar } from "@/components/SupporterAvatar";
import { SampleTag } from "@/components/SampleTag";
import { showSamples } from "@/lib/visibility";
import { buildMetadata } from "@/lib/metadata";
import {
  supportersIntro,
  visibleTiers,
  supportersOutro,
  type Supporter,
} from "@/content/supporters";

export const metadata: Metadata = buildMetadata({
  title: "Our supporters",
  description:
    "With gratitude, we recognize the supporters whose generosity makes PRASM's work possible: our Founding Circle, patrons, and monthly sustainers.",
  path: "/supporters",
});

// Real supporters only on the live site; labelled samples on previews.
const tiers = visibleTiers(showSamples);
const byKey = (key: string) => tiers.find((t) => t.key === key);

/** Builds a short meta line like "Since 2024 · Seoul" from optional fields. */
function meta(s: Supporter): string {
  return [s.since ? `Since ${s.since}` : null, s.location]
    .filter(Boolean)
    .join(" · ");
}

export default function SupportersPage() {
  const founding = byKey("founding");
  const patrons = byKey("patrons");
  const sustainers = byKey("sustainers");

  return (
    <>
      <PageHero
        eyebrow={supportersIntro.eyebrow}
        title={supportersIntro.title}
        lede={supportersIntro.lede}
      />

      {/* Before the first consented supporters are added */}
      {tiers.length === 0 && (
        <Section tone="cream">
          <div className="mx-auto max-w-2xl rounded-[20px] border border-line bg-sand p-8 text-center md:p-10">
            <h2 className="text-h3">
              Our first supporters will be honoured here
            </h2>
            <p className="mt-3 text-stone">
              We only list people who have said yes to being named. As our first
              supporters give, and agree to be recognised, they will appear on
              this page, by name, initials, or simply as Anonymous.
            </p>
          </div>
        </Section>
      )}

      {/* Founding Circle — lead supporters, featured */}
      {founding && (
        <Section tone="cream">
          <SectionHeading
            eyebrow={founding.title}
            title="The people who believed first"
            lede={founding.subtitle}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {founding.supporters.map((s, i) => (
              <Reveal key={s.name + i} delay={i * 80}>
                <article className="flex h-full gap-5 rounded-[20px] border border-line bg-cream p-6 shadow-soft sm:p-7">
                  <SupporterAvatar
                    name={s.name}
                    size="lg"
                    className="ring-2 ring-gold-400 ring-offset-2 ring-offset-cream"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl font-semibold text-forest-700">
                        {s.name}
                      </h3>
                      <Badge tone="gold">Founding Circle</Badge>
                      {s.sample && <SampleTag />}
                    </div>
                    {meta(s) && (
                      <p className="mt-1 text-sm text-stone">{meta(s)}</p>
                    )}
                    <p className="mt-3 text-stone">{s.blurb}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Patrons — major gifts */}
      {patrons && (
        <Section tone="sand">
          <SectionHeading
            eyebrow={patrons.title}
            title="Patrons"
            lede={patrons.subtitle}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patrons.supporters.map((s, i) => (
              <Reveal key={s.name + i} delay={i * 70}>
                <article className="flex h-full flex-col rounded-[20px] border border-line bg-cream p-6 shadow-soft">
                  <SupporterAvatar name={s.name} size="md" />
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-forest-700">
                      {s.name}
                    </h3>
                    <Badge tone="clay">Patron</Badge>
                    {s.sample && <SampleTag />}
                  </div>
                  {meta(s) && (
                    <p className="mt-1 text-sm text-stone">{meta(s)}</p>
                  )}
                  <p className="mt-3 text-sm text-stone">{s.blurb}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Monthly sustainers — steady Patreon community */}
      {sustainers && (
        <Section tone="cream">
          <SectionHeading
            eyebrow={sustainers.title}
            title="Monthly sustainers"
            lede={sustainers.subtitle}
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {sustainers.supporters.map((s, i) => (
              <div
                key={s.name + i}
                className="inline-flex items-center gap-3 rounded-full border border-line bg-cream py-2 pr-5 pl-2 shadow-soft"
              >
                <SupporterAvatar name={s.name} size="sm" />
                <span className="font-medium text-forest-700">{s.name}</span>
                {s.sample && <SampleTag />}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone">
            And many more who give quietly every month. Thank you.
          </p>
        </Section>
      )}

      {/* Join them */}
      <CTASection
        title={supportersOutro.title}
        body={supportersOutro.body}
        actions={[
          { label: "Become a supporter", href: "/give" },
          { label: "Talk to us", href: "/contact" },
        ]}
      />
    </>
  );
}
