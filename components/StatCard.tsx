import { Reveal } from "@/components/ui/Reveal";
import { SampleTag } from "@/components/SampleTag";
import { cn } from "@/lib/cn";
import { showSamples } from "@/lib/visibility";
import type { Stat } from "@/content/stats";

// Literal class names so Tailwind generates them.
const countingSpan: Record<number, string> = {
  0: "lg:col-span-4",
  1: "lg:col-span-3",
  2: "lg:col-span-2",
  3: "lg:col-span-1",
};

/**
 * Impact figures. Placeholder figures never render on the live site; their
 * place is taken by one honest "being counted" tile. On previews they show
 * with a Sample label so it is obvious which numbers still need real data.
 */
export function StatGrid({ stats }: { stats: Stat[] }) {
  const visible = showSamples ? stats : stats.filter((s) => !s.placeholder);
  const hidden = stats.length - visible.length;
  const odd = visible.length % 2 === 1;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-line lg:grid-cols-4">
      {visible.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={i * 80}
          className={cn(
            hidden > 0 &&
              odd &&
              i === visible.length - 1 &&
              "col-span-2 lg:col-span-1",
          )}
        >
          <div className="h-full bg-cream p-6 md:p-8">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-4xl font-semibold text-clay-600 md:text-5xl">
                {stat.value}
              </p>
              {stat.placeholder && <SampleTag />}
            </div>
            <p className="mt-2 font-medium text-forest-700">{stat.label}</p>
            {stat.caption && (
              <p className="mt-1 text-sm leading-snug text-stone">
                {stat.caption}
              </p>
            )}
            {stat.asOf && (
              <p className="mt-2 text-xs text-stone">
                As of {stat.asOf}
                {stat.source ? ` · ${stat.source}` : ""}
              </p>
            )}
          </div>
        </Reveal>
      ))}
      {hidden > 0 && (
        <div
          className={cn(
            "col-span-2 flex flex-col justify-center bg-cream p-6 md:p-8",
            countingSpan[visible.length % 4],
          )}
        >
          <p className="font-display text-2xl font-semibold text-forest-700">
            Being counted
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone">
            We&apos;re counting the families we walk alongside, the medical
            records built and the hospital visits covered, from our own records.
            Real figures, each with a date, will appear here. We won&apos;t show
            a number we can&apos;t stand behind.
          </p>
        </div>
      )}
    </div>
  );
}
