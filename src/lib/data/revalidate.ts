/**
 * Invalidate Next.js cache after CMS writes so the public site updates
 * without a Vercel redeploy.
 */

import { revalidatePath, revalidateTag } from "next/cache";

export type CmsTag = "portfolio" | "faqs" | "journal" | "team" | "settings";

/**
 * Call after any admin create/update/delete.
 * - revalidateTag: data-cache entries
 * - revalidatePath: HTML routes for home / work / journal / etc.
 */
export function revalidateCms(tag: CmsTag | string) {
  try {
    revalidateTag(tag, "max");
  } catch {
    /* older runtimes */
  }

  revalidatePath("/", "layout");

  if (tag === "portfolio" || tag.startsWith("portfolio:")) {
    revalidatePath("/");
    revalidatePath("/work");
    if (tag.startsWith("portfolio:")) {
      const slug = tag.slice("portfolio:".length);
      if (slug) revalidatePath(`/work/${slug}`);
    }
  }

  if (tag === "journal" || tag.startsWith("journal:")) {
    revalidatePath("/journal");
    if (tag.startsWith("journal:")) {
      const slug = tag.slice("journal:".length);
      if (slug) revalidatePath(`/journal/${slug}`);
    }
  }

  if (tag === "faqs") {
    revalidatePath("/faq");
  }

  if (tag === "team") {
    revalidatePath("/about");
    revalidatePath("/team");
  }

  if (tag === "settings") {
    revalidatePath("/");
    revalidatePath("/contact");
  }
}
