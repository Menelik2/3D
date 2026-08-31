import { META_NAV_MARK } from "@/lib/meta-nav-mark";

/** Exact META mark — optimized transparent WebP (~3KB) */
export function MetaMark({
  className = "",
  title = "META Pictures",
}: {
  className?: string;
  title?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={META_NAV_MARK}
      alt={title}
      className={className}
      width={83}
      height={80}
      draggable={false}
      decoding="async"
    />
  );
}
