/**
 * Helpers to invalidate Cache Components tags after CMS writes.
 * Prefer updateTag in Server Actions for read-your-writes;
 * revalidateTag for background SWR-style invalidation from route handlers.
 */

import { revalidateTag, updateTag } from "next/cache";

export type CmsTag = "portfolio" | "faqs" | "journal" | "team" | "settings";

/** Background revalidation (stale-while-revalidate). Safe in Route Handlers. */
export function revalidateCms(tag: CmsTag | string) {
  revalidateTag(tag, "max");
}

/** Immediate refresh of tagged cache (Server Actions only). */
export function updateCms(tag: CmsTag | string) {
  updateTag(tag);
}
