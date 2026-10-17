import { Quote } from "@/components/Quote";
import { Figure } from "@/components/Figure";
import { images } from "@/lib/images";
import type { FieldNoteBlock } from "@/content/fieldNotes";

/** Renders the dependency-free typed content blocks of a field note. */
export function FieldNoteBody({ blocks }: { blocks: FieldNoteBlock[] }) {
  return (
    <div className="max-w-[65ch] text-[1.0625rem] leading-[1.75] text-ink">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="mb-6">
                {block.text}
              </p>
            );
          case "h":
            return (
              <h2 key={i} className="mt-10 mb-3 text-h3 text-forest-700">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <div key={i} className="my-9">
                <Quote attribution={block.cite}>{block.text}</Quote>
              </div>
            );
          case "list":
            return (
              <ul
                key={i}
                className="mb-6 list-disc space-y-2 pl-6 marker:text-clay-300"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={i} className="my-9">
                <Figure
                  media={images[block.key]}
                  sizes="(min-width: 768px) 65ch, 100vw"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-sm leading-snug text-stone">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "gallery":
            return (
              <figure key={i} className="my-9">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {block.keys.map((key) => (
                    <Figure
                      key={key}
                      media={{ ...images[key], ratio: "1/1" }}
                      rounded="md"
                      sizes="(min-width: 768px) 32ch, 50vw"
                    />
                  ))}
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-sm leading-snug text-stone">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
