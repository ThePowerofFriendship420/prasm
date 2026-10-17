import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/Figure";
import { cn } from "@/lib/cn";
import { images, type ImageKey } from "@/lib/images";

/**
 * Interior page hero — compact, on sand. With `image`, a real photo sits
 * beside the title on wide screens and below it on phones.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: ImageKey;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line bg-sand", className)}>
      <Container
        className={cn(
          "py-16 md:py-24",
          image && "grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14",
        )}
      >
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-[0.8125rem] font-semibold tracking-[0.12em] text-clay-600 uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-h1">{title}</h1>
          {lede && <p className="mt-5 text-lede text-stone">{lede}</p>}
        </div>
        {image && (
          <Figure
            media={images[image]}
            rounded="xl"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="shadow-soft"
          />
        )}
      </Container>
    </section>
  );
}
