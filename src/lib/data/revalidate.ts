/**
 * Helpers to invalidate Next.js data cache after CMS writes.
 */

import { revalidateTag, updateTag } from "next/cache";

export type CmsTag = "portfolio" | "faqs" | "journal" | "team" | "settings";

/** Background revalidation. Safe in Route Handlers. */
export function revalidateCms(tag: CmsTag | string) {
  revalidateTag(tag, "max");
}

/** Immediate refresh of tagged cache (Server Actions). */
export function updateCms(tag: CmsTag | string) {
  updateTag(tag);
}
