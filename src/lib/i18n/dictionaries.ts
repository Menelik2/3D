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
      headline: "Every frame has a story.",
      subtitle:
        "We don't just film. We create cinema — for artists, brands, businesses and the people whose stories deserve a frame.",
      watchShowreel: "Watch Showreel",
      startProject: "Start a Project",
      scroll: "Scroll",
    },
    splash: {
      tagline: "Every frame has a story.",
    },
    home: {
      showreelLabel: "Showreel",
      showreelTitle: "See what we see.",
      showreelDesc: "A selection of cinematic work from META Pictures.",
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
      tagline: "Every frame has a story.",
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
      about: "ስለ እኛ",
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
      headline: "እያንዳንዱ ፍሬም ታሪክ አለው።",
      subtitle:
        "እኛ ብቻ አንቀረጽም። ለአርቲስቶች፣ ለብራንዶች፣ ለንግዶች እና ታሪካቸው ፍሬም የሚገባቸው ሰዎች ሲኒማ እንፈጥራለን።",
      watchShowreel: "ሾውሪል ይመልከቱ",
      startProject: "ፕሮጀክት ጀምር",
      scroll: "ሸብልል",
    },
    splash: {
      tagline: "እያንዳንዱ ፍሬም ታሪክ አለው።",
    },
    home: {
      showreelLabel: "ሾውሪል",
      showreelTitle: "እኛ የምናየውን ይመልከቱ።",
      showreelDesc: "ከሜታ ፒክቸርስ የተመረጡ ሲኒማቲክ ስራዎች።",
      showreelSoon: "ሾውሪል በቅርብ ይመጣል",
      viewAllWork: "ሁሉንም ስራዎች ይመልከቱ →",
      portfolioLabel: "ፖርትፎሊዮ",
      portfolioTitle: "የተመረጡ ስራዎች",
      portfolioDesc: "ሙዚቃ ቪዲዮ · ኮሜርሻል · ሰርግ · ዶኩመንታሪ",
      browseWork: "ስራዎችን ያስሱ",
      featuredEmpty:
        "በስቱዲዮ ዳሽቦርድ ላይ ሲታተሙ እና እንደ ተለይተው ሲሰየሙ የተመረጡ ፕሮጀክቶች እዚህ ይታያሉ።",
      capabilitiesLabel: "ችሎታዎች",
      capabilitiesTitle: "የምንፈጥረው",
      capabilitiesDesc: "ለብራንዶች፣ ለአርቲስቶች እና ለእውነተኛ ጊዜያት ሲኒማቲክ ታሪክ አተረጓጎም።",
      exploreServices: "አገልግሎቶችን ያስሱ",
      ctaTitle: "ታሪክዎን ለመንገር ዝግጁ ነዎት?",
      ctaDesc:
        "ግልጽ ራዕይ ቢኖርዎት ወይም ሀሳብ ብቻ ቢኖርዎት — ወደ ሲኒማ እንድንቀርጽ እንረዳዎታለን።",
      bookConsultation: "ምክክር ይያዙ",
      services: [
        "ሙዚቃ ቪዲዮዎች",
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
      readyWhen: "እርስዎ ሲዘጋጁ እኛ ዝግጁ ነን።",
      startProject: "ፕሮጀክት ጀምር",
      tagline: "እያንዳንዱ ፍሬም ታሪክ አለው።",
      blurb: "ለብራንዶች፣ ለአርቲስቶች እና ለእውነተኛ ጊዜያት ሲኒማቲክ ፊልም እና ሚዲያ ፕሮዳክሽን።",
      explore: "ያስሱ",
      contact: "አግኙን",
      follow: "ተከተሉ",
      getInTouch: "ያግኙን →",
      privacy: "ግላዊነት",
      terms: "ውሎች",
      rights: "መብቱ በህግ የተጠበቀ ነው።",
      work: "ስራዎች",
      services: "አገልግሎቶች",
      about: "ስለ እኛ",
      team: "ቡድን",
      journal: "ጆርናል",
      faq: "ተደጋጋሚ ጥያቄዎች",
    },
    lang: {
      en: "EN",
      am: "አማ",
      switchTo: "ቋንቋ",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
