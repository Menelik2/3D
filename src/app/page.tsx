import { getFeaturedPortfolio } from "@/lib/data/public-cms";
import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { HeroContent } from "@/components/3d/HeroContent";
import { HomeSections } from "@/components/HomeSections";

export default async function HomePage() {
  const [featured, { media }] = await Promise.all([
    getFeaturedPortfolio(6),
    getPublicSiteConfig(),
  ]);

  return (
    <div className="grain">
      <HeroContent logoVideoUrl={media.logoVideoUrl} logoUrl={media.logoUrl} />
      <HomeSections
        featured={featured}
        showreel={media.showreelUrl}
        poster={media.showreelPosterUrl}
      />
    </div>
  );
}
