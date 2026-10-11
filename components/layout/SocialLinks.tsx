import { Mail, Heart } from "lucide-react";
import { socialList, type SocialChannel } from "@/content/social";
import { cn } from "@/lib/cn";

const iconFor: Record<SocialChannel["key"], React.ElementType> = {
  email: Mail,
  patreon: Heart,
};

/** Row of social/contact icon links from content/social. */
export function SocialLinks({
  variant = "dark",
  showLabels = false,
  className,
}: {
  variant?: "light" | "dark";
  showLabels?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {socialList.map((channel) => {
        const Icon = iconFor[channel.key];
        const external = channel.key !== "email";
        return (
          <li key={channel.key}>
            <a
              href={channel.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "inline-flex items-center gap-2 rounded-full transition-colors",
                showLabels ? "px-3 py-2 text-sm" : "h-10 w-10 justify-center",
                variant === "light"
                  ? "text-cream/80 hover:bg-cream/10 hover:text-cream"
                  : "text-forest-600 hover:bg-sand hover:text-clay-700",
              )}
              aria-label={`${channel.label}: ${channel.handle}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              {showLabels && <span>{channel.handle}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
