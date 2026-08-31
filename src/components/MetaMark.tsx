import { META_NAV_MARK } from "@/lib/meta-nav-mark";

/** Exact META mark from your brand photo — transparent, no black plate */
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
      width={132}
      height={120}
      draggable={false}
      decoding="async"
    />
  );
}
