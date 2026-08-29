export type Locale = "en" | "am";

export const locales: Locale[] = ["en", "am"];
export const defaultLocale: Locale = "en";
export const LOCALE_STORAGE_KEY = "meta-locale";

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    services: string;
    showreel: string;
    projects: string;
    blog: string;
    contact: string;
    work: string;
    journal: string;
    startProject: string;
  };
  hero: {
    tagline: string;
    headline: string;
    subtitle: string;
    watchShowreel: string;
    startProject: string;
    scroll: string;
  };
  splash: {
    tagline: string;
  };
  home: {
    showreelLabel: string;
    showreelTitle: string;
    showreelDesc: string;
    showreelSoon: string;
    viewAllWork: string;
    portfolioLabel: string;
    portfolioTitle: string;
    portfolioDesc: string;
    browseWork: string;
    featuredEmpty: string;
    capabilitiesLabel: string;
    capabilitiesTitle: string;
    capabilitiesDesc: string;
    exploreServices: string;
    ctaTitle: string;
    ctaDesc: string;
    bookConsultation: string;
    services: string[];
  };
  footer: {
    nextProject: string;
    readyWhen: string;
    startProject: string;
    tagline: string;
    blurb: string;
    explore: string;
    contact: string;
    follow: string;
    getInTouch: string;
    privacy: string;
    terms: string;
    rights: string;
    work: string;
    services: string;
    about: string;
    team: string;
    journal: string;
    faq: string;
  };
  lang: {
    en: string;
    am: string;
    switchTo: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      showreel: "Showreel",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
      work: "Work",
      journal: "Journal",
      startProject: "Start a Project",
    },
    hero: {
      tagline: "Cinematic Film & Media Production",
      headline: "Beyond the frame.",
      subtitle:
        "We don't just film. We create cinema — for artists, brands, businesses and the people whose stories deserve a frame.",
      watchShowreel: "Watch Showreel",
      startProject: "Start a Project",
      scroll: "Scroll",
    },
    splash: {
      tagline: "Beyond the frame.",
    },
    home: {
      showreelLabel: "Showreel",
      showreelTitle: "See what we see.",
      showreelDesc:
        "Every frame has a story — cinema for artists, brands, and businesses.",
      showreelSoon: "Showreel coming soon",
      viewAllWork: "View all work →",
      portfolioLabel: "Portfolio",
      portfolioTitle: "Selected work",
      portfolioDesc: "Music videos · Commercials · Weddings · Documentaries",
      browseWork: "Browse work",
      featuredEmpty:
        "Featured projects appear here when published and marked featured in the studio dashboard.",
      capabilitiesLabel: "Capabilities",
      capabilitiesTitle: "What we create",
      capabilitiesDesc:
        "Cinematic storytelling for brands, artists, and real moments.",
      exploreServices: "Explore services",
      ctaTitle: "Ready to tell your story?",
      ctaDesc:
        "Whether you have a clear vision or just an idea — we help shape it into cinema.",
      bookConsultation: "Book Consultation",
      services: [
        "Music Videos",
        "Commercial Films",
        "Wedding Films",
        "Event Production",
        "Corporate Films",
        "Documentaries",
        "Social Media Content",
        "Photography",
      ],
    },
    footer: {
      nextProject: "Next project",
      readyWhen: "Ready when you are.",
      startProject: "Start a Project",
      tagline: "Beyond the frame.",
      blurb:
        "Cinematic film & media production for brands, artists, and real moments.",
      explore: "Explore",
      contact: "Contact",
      follow: "Follow",
      getInTouch: "Get in touch →",
      privacy: "Privacy",
      terms: "Terms",
      rights: "All rights reserved.",
      work: "Work",
      services: "Services",
      about: "About",
      team: "Team",
      journal: "Journal",
      faq: "FAQ",
    },
    lang: {
      en: "EN",
      am: "አማ",
      switchTo: "Language",
    },
  },
  am: {
    nav: {
      home: "መነሻ",
      about: "ስለ እን",
      services: "አገልግሎቶች",
      showreel: "ሾውሪል",
      projects: "ፕሮጀክቶች",
      blog: "ብሎግ",
      contact: "አግኙን",
      work: "ስራዎች",
      journal: "ጆርናል",
      startProject: "ፕሮጀክት ጀምር",
    },
    hero: {
      tagline: "ሲኒማቲክ ፊልም እና ሚዲያ ፕሮዳክሽን",
      headline: "ከፍሬም ባሻገር።",
      subtitle:
        "የእንዓ ስራ ዝም ብሎ መቅረጽ ብቻ አይደለም፣ ድንቅ የሲኒማ ጥበትን እንፈጥራለን — ለአርቲስቶች፣ ለድርጅቶች፣ ለንግድ ተ቉ማት፣ እንዲሁም ታሪካቸው በክብር ሊቀረጽ ለሚገባቸው ሰዎች",
      watchShowreel: "ሾውሪል ይመልከቱ",
      startProject: "ፕሮጀክት ጀምር",
      scroll: "ሸብልል",
    },
    splash: {
      tagline: "ከፍሬም ባሻገር።",
    },
    home: {
      showreelLabel: "ሾውሪል",
      showreelTitle: "እንዓ የምናየውን ይመልከቱ።",
      showreelDesc:
        "እያንዳንዱ ፍሬም ታሪክ አለው — ለአርቲስቶች፣ ብራንዶች እና ንግዶች ሲኒማ።",
      showreelSoon: "ሾውሪል በቅርብ ይመጣል",
      viewAllWork: "ሁሉንም ስራዎች ይመልከቱ →",
      portfolioLabel: "ፖርትፎሊዮ",
      portfolioTitle: "የተመረጡ ስራዎች",
      portfolioDesc: "ሙዚቃ ቪዲዮ · ኮሜርሻል · ሰርግ · ዶኩመንታሪ",
      browseWork: "ስራbዎችን ያስሱ",
      featuredEmpty:
        "በስቱዲዮ ዳሽቦርድ ላይ ሲታተሙ እና እንደ ተለይተው ሲሰየሙ የተመረጡ ፕሮጀክቶች እዚህ ይታያሉ።",
      capabilitiesLabel: "ችሎታዎች",
      capabilitiesTitle: "የምንፈጥረው",
      capabilitiesDesc:
        "ለብራንዶች፣ ለአርቲስቶች እና ለእውነተኛ ጊዜያት ሲኒማቲክ ታሪክ አተረጋጎም።",
      exploreServices: "አገልግሎቶችን ያስሱ",
      ctaTitle: "ታሪክዎን ለመንገር ዝግጁ ነዎት?",
      ctaDesc:
        "ግልጽ ራዕይ ቢኖሮት ወይም ሃሳብ ብቻ ቢኖሮት — ወደ ሲኒማ እንድንቀርጵ እንረዳዎታለን።",
      bookConsultation: "ምክክር ይያዙ",
      services: [
        "ሙዚቃ ቪዲዮች",
        "ኮሜርሻል ፊልሞች",
        "የሰርግ ፊልሞች",
        "የዝግጅት ፕሮዳክሽን",
        "ኮርፖሬት ፊልሞች",
        "ዶኩመንታሪዎች",
        "የማህበራዊ ሚዲያ ይዘት",
        "ፎቶግራፊ",
      ],
    },
    footer: {
      nextProject: "ቀጣይ ፕሮጀክት",
      readyWhen: "እርሶዎ ሲዘጋጁ እንዓ ዝግጁ ነን።",
      startProject: "ፕሮጀክት ጀምር",
      tagline: "ከፍሬም ባሻገር።",
      blurb:
        "ለብራንዶች፣ ለአርቲስቶች እና ለእውነተኛ ጊዜያት ሲኒማቲክ ፊልም እና ሚዲያ ፕሮዳክሽን።",
      explore: "ያስሱ",
      contact: "አግኙን",
      follow: "ተከተሉ",
      getInTouch: "ያግኙን →",
      privacy: "ግላዊነት",
      terms: "ውሎች",
      rights: "መብቱ በህግ የተጠበቀ ነው።",
      work: "ስራዎች",
      services: "አገልግሎቶች",
      about: "ስለ እን",
      team: "ቡድን",
      journal: "ጆርናል",
      faq: "ተደጋጋሚ ጥያቄዎች",
    },
    lang: {
      en: "EN",
      am: "አማ",
      switchTo: "቉ንቃ",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
