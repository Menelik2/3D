/** Extended page copy for public site (EN + AM). Admin stays English. */

export type PageCopy = {
  about: {
    eyebrow: string;
    title: string;
    description: string;
    whoTitle: string;
    whoP1: string;
    whoP2: string;
    philosophyTitle: string;
    philosophyP: string;
    createTitle: string;
    createItems: string[];
    processTitle: string;
    processSteps: string[];
    peopleLabel: string;
    teamTitle: string;
    viewAll: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    viewWork: string;
    startProject: string;
    ctaTitle: string;
    ctaDesc: string;
    items: { title: string; description: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    directLines: string;
    noDetails: string;
    responseTitle: string;
    responseBody: string;
    primary: string;
    startTitle: string;
    startDesc: string;
    beginInquiry: string;
    meeting: string;
    consultTitle: string;
    consultDesc: string;
    requestSlot: string;
  };
  work: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    commission: string;
  };
  team: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    aboutStudio: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    stillQuestions: string;
    contact: string;
    startProject: string;
    fallback: { q: string; a: string }[];
  };
  journal: {
    eyebrow: string;
    title: string;
    description: string;
  };
  bookConsultation: {
    eyebrow: string;
    title: string;
    description: string;
    typeLabel: string;
    types: string[];
    fullName: string;
    email: string;
    phone: string;
    preferredDate: string;
    projectNotes: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    selectTypeError: string;
    submitError: string;
    networkError: string;
    successEyebrow: string;
    successTitle: string;
    successBody: string;
    returnHome: string;
    viewWork: string;
  };
  startProject: {
    eyebrow: string;
    title: string;
    description: string;
    steps: string[];
    stepOf: string;
    fullName: string;
    company: string;
    email: string;
    phone: string;
    whatsapp: string;
    projectTypes: string[];
    projectTitle: string;
    projectDescription: string;
    creativeIdea: string;
    preferredDate: string;
    alternativeDate: string;
    city: string;
    location: string;
    budgets: string[];
    filesTitle: string;
    filesHint: string;
    summary: string;
    summaryName: string;
    summaryEmail: string;
    summaryTypes: string;
    summaryBudget: string;
    summaryCity: string;
    summaryDescription: string;
    back: string;
    continue: string;
    submit: string;
    submitting: string;
    submitError: string;
    networkError: string;
    successEyebrow: string;
    successTitle: string;
    successTagline: string;
    successBody: string;
    reference: string;
    viewPortfolio: string;
    backHome: string;
  };
  cta: {
    title: string;
    description: string;
    startProject: string;
    bookConsultation: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    home: string;
    viewWork: string;
  };
  common: {
    all: string;
    loading: string;
    back: string;
  };
};

export const pageCopy = {
  en: {
    about: {
      eyebrow: "Studio",
      title: "About META Pictures",
      description:
        "We transform ideas into visual stories that people remember. Intentional framing. Thoughtful pacing. Emotional honesty.",
      whoTitle: "Who we are",
      whoP1:
        "META Pictures is a creative film and media production company that turns ideas, people, brands, music, events, and real stories into cinematic visual experiences.",
      whoP2: "We don't just film. We create cinema — for artists, brands, and moments that matter.",
      philosophyTitle: "Philosophy",
      philosophyP:
        "Every frame has a story. Whether it's a music video, a brand film, or a wedding day, we build narrative through light, movement, and careful editing — not just coverage.",
      createTitle: "What we create",
      createItems: [
        "Music Videos",
        "Commercial & Brand Films",
        "Wedding Films",
        "Documentaries",
        "Corporate Communication",
        "Event Coverage",
        "Social Content",
        "Photography",
      ],
      processTitle: "Production process",
      processSteps: [
        "Idea & creative direction",
        "Pre-production",
        "Production",
        "Editing & color",
        "Client review",
        "Final delivery",
      ],
      peopleLabel: "People",
      teamTitle: "The team",
      viewAll: "View all →",
    },
    services: {
      eyebrow: "Capabilities",
      title: "Services",
      description:
        "From first concept to final delivery — cinematic production for brands, artists, and real stories.",
      viewWork: "View work",
      startProject: "Start a project",
      ctaTitle: "Not sure which service fits?",
      ctaDesc:
        "Tell us about your idea — we'll recommend the right format and production path.",
      items: [
        {
          title: "Music Videos",
          description:
            "Concept, cinematography, direction, production, edit, grade, and delivery — built for artists who need a strong visual identity.",
        },
        {
          title: "Commercial Films",
          description:
            "Brand and product films with cinematic craft and clear messaging for businesses and organizations.",
        },
        {
          title: "Wedding Films",
          description:
            "Emotion-first wedding storytelling — not just coverage, but a film you'll revisit for decades.",
        },
        {
          title: "Event Production",
          description:
            "Professional multi-camera video and photography for conferences, launches, and live moments.",
        },
        {
          title: "Corporate Films",
          description:
            "Brand stories, leadership interviews, culture films, and internal communication pieces.",
        },
        {
          title: "Documentaries",
          description:
            "Long-form and short documentary work rooted in authenticity and careful editorial structure.",
        },
        {
          title: "Social Media Content",
          description:
            "Short-form cinematic content for Instagram, TikTok, YouTube Shorts, and campaign cutdowns.",
        },
        {
          title: "Photography",
          description:
            "Commercial, portrait, event, and creative stills that match the tone of your moving image.",
        },
      ],
    },
    contact: {
      eyebrow: "Connect",
      title: "Contact",
      description:
        "Ready to start a conversation? Reach out directly or use a structured inquiry so we can respond with the right next step.",
      directLines: "Direct lines",
      noDetails:
        "Contact details will appear here once set in Admin → Settings or environment variables.",
      responseTitle: "Response time",
      responseBody:
        "Project inquiries are reviewed in order received. For time-sensitive shoots, include preferred dates in your form so we can prioritize.",
      primary: "Primary",
      startTitle: "Start a Project",
      startDesc:
        "Multi-step inquiry — vision, dates, location, budget, and references. Best for productions with a clear brief.",
      beginInquiry: "Begin inquiry →",
      meeting: "Meeting",
      consultTitle: "Book a Consultation",
      consultDesc:
        "Creative direction, production planning, wedding or music video meetings — when you want to talk before committing.",
      requestSlot: "Request a slot →",
    },
    work: {
      eyebrow: "Portfolio",
      title: "Work",
      description:
        "Selected cinematic projects across music, brand, wedding, and documentary. Every frame tells a story.",
      empty:
        "New work is publishing soon. Projects appear here once they are marked published in the studio dashboard.",
      commission: "Commission a project",
    },
    team: {
      eyebrow: "Studio",
      title: "Team",
      description:
        "The people who turn ideas into frames — direction, camera, edit, and production.",
      empty: "Team profiles will appear here once published in the admin dashboard.",
      aboutStudio: "About the studio",
    },
    faq: {
      eyebrow: "Support",
      title: "FAQ",
      description: "Common questions about working with META Pictures.",
      stillQuestions: "Still have questions?",
      contact: "Contact",
      startProject: "Start a Project",
      fallback: [
        {
          q: "How do I book a project?",
          a: "Use the Start a Project form or book a consultation. We review your brief and respond with next steps and a clear proposal.",
        },
        {
          q: "Do you travel for productions?",
          a: "Yes. Travel and location details are confirmed during the inquiry and proposal stage.",
        },
        {
          q: "What is included in a typical package?",
          a: "Packages vary by project type. Music videos, commercials, and weddings each have different scopes — inclusions are listed in the proposal.",
        },
        {
          q: "How long does delivery take?",
          a: "Timelines depend on complexity. A production schedule is agreed before cameras roll.",
        },
        {
          q: "Can I request revisions?",
          a: "Yes. Revision rounds are defined in the production agreement so expectations stay clear.",
        },
        {
          q: "Who owns the final footage?",
          a: "Usage rights and ownership are specified in the contract. Client media rights are documented before delivery.",
        },
      ],
    },
    journal: {
      eyebrow: "Stories",
      title: "Journal",
      description: "Notes from set, process, and culture at META Pictures.",
    },
    bookConsultation: {
      eyebrow: "Meeting",
      title: "Book a Consultation",
      description:
        "Choose a type, preferred date, and a short note about what you want to discuss.",
      typeLabel: "Consultation type *",
      types: [
        "Creative Consultation",
        "Production Planning",
        "Commercial Meeting",
        "Wedding Consultation",
        "Music Video Consultation",
      ],
      fullName: "Full name *",
      email: "Email *",
      phone: "Phone",
      preferredDate: "Preferred date",
      projectNotes: "Project notes",
      notesPlaceholder: "What would you like to discuss?",
      submit: "Request Consultation",
      submitting: "Submitting…",
      selectTypeError: "Please select a consultation type.",
      submitError: "Could not submit. Please try again.",
      networkError: "Network error. Check your connection and try again.",
      successEyebrow: "Received",
      successTitle: "Consultation requested",
      successBody:
        "We have your request. META Pictures will confirm availability and contact you shortly.",
      returnHome: "Return home",
      viewWork: "View work",
    },
    startProject: {
      eyebrow: "Inquiry",
      title: "Start a Project",
      description:
        "Tell us about your vision. We'll respond with next steps and a clear production path.",
      steps: [
        "Client",
        "Project type",
        "Details",
        "Date & location",
        "Budget",
        "Files",
        "Review",
      ],
      stepOf: "Step {current} of {total}",
      fullName: "Full name *",
      company: "Company / artist",
      email: "Email *",
      phone: "Phone",
      whatsapp: "WhatsApp",
      projectTypes: [
        "Music Video",
        "Commercial",
        "Wedding Film",
        "Event Coverage",
        "Photography",
        "Documentary",
        "Corporate Film",
        "Social Media Content",
        "Other",
      ],
      projectTitle: "Project title",
      projectDescription: "Description",
      creativeIdea: "Creative idea",
      preferredDate: "Preferred date",
      alternativeDate: "Alternative date",
      city: "City",
      location: "Location / venue",
      budgets: [
        "Under 10,000 ETB",
        "10,000–25,000 ETB",
        "25,000–50,000 ETB",
        "50,000–100,000 ETB",
        "100,000+ ETB",
        "Not sure / Need a quote",
      ],
      filesTitle: "Reference files (optional)",
      filesHint:
        "You can share links in the description for now. Secure file upload to private storage will connect in a later release.",
      summary: "Summary",
      summaryName: "Name",
      summaryEmail: "Email",
      summaryTypes: "Types",
      summaryBudget: "Budget",
      summaryCity: "City",
      summaryDescription: "Description",
      back: "← Back",
      continue: "Continue →",
      submit: "Submit request",
      submitting: "Submitting…",
      submitError: "Submission failed. Please try again.",
      networkError: "Network error. Please check your connection and try again.",
      successEyebrow: "Received",
      successTitle: "Thank you",
      successTagline: "Your story starts here.",
      successBody:
        "Your project request has been received. META Pictures will review your information and contact you.",
      reference: "Reference",
      viewPortfolio: "View portfolio",
      backHome: "Back home",
    },
    cta: {
      title: "Ready to tell your story?",
      description: "Share your idea, timeline, and vision. We'll shape it into cinema.",
      startProject: "Start a Project",
      bookConsultation: "Book Consultation",
    },
    notFound: {
      code: "404",
      title: "This frame does not exist.",
      description:
        "The page you're looking for may have been moved, unpublished, or never shot.",
      home: "Return home",
      viewWork: "View work",
    },
    common: {
      all: "All",
      loading: "Loading…",
      back: "Back",
    },
  } satisfies PageCopy,
  am: {
    about: {
      eyebrow: "ስቱዲዮ",
      title: "ስለ ሜታ ፒክቸርስ",
      description:
        "ሀሳቦችን ሰዎች የሚያስታውሷቸው የእይታ ታሪኮች እንለውጣለን። ሆን ተብሎ የተቀረጸ ፍሬም። በጥንቃቄ የተቀናጀ ፍጥነት። ስሜታዊ ታማኝነት።",
      whoTitle: "እኛ ማን ነን",
      whoP1:
        "ሜታ ፒክቸርስ ሀሳቦችን፣ ሰዎችን፣ ብራንዶችን፣ ሙዚቃን፣ ዝግጅቶችን እና እውነተኛ ታሪኮችን ወደ ሲኒማቲክ የእይታ ተሞክሮዎች የሚቀይር ፈጣሪ የፊልም እና ሚዲያ ፕሮዳክሽን ኩባንያ ነው።",
      whoP2: "እኛ ብቻ አንቀረጽም። ለአርቲስቶች፣ ለብራንዶች እና ለሚያስፈልጉ ጊዜያት ሲኒማ እንፈጥራለን።",
      philosophyTitle: "ፍልስፍና",
      philosophyP:
        "እያንዳንዱ ፍሬም ታሪክ አለው። ሙዚቃ ቪዲዮ፣ የብራንድ ፊልም ወይም የሰርግ ቀን ቢሆን፣ በብርሃን፣ በእንቅስቃሴ እና በጥንቃቄ በማረም ታሪክ እንገነባለን — ብቻ ሽፋን አይደለም።",
      createTitle: "የምንፈጥረው",
      createItems: [
        "ሙዚቃ ቪዲዮዎች",
        "ኮሜርሻል እና የብራንድ ፊልሞች",
        "የሰርግ ፊልሞች",
        "ዶኩመንታሪዎች",
        "ኮርፖሬት ግንኙነት",
        "የዝግጅት ሽፋን",
        "የማህበራዊ ይዘት",
        "ፎቶግራፊ",
      ],
      processTitle: "የፕሮዳክሽን ሂደት",
      processSteps: [
        "ሀሳብ እና የፈጠራ አቅጣጫ",
        "ቅድመ-ፕሮዳክሽን",
        "ፕሮዳክሽን",
        "አርትዖት እና ቀለም",
        "የደንበኛ ግምገማ",
        "የመጨረሻ ማቅረብ",
      ],
      peopleLabel: "ሰዎች",
      teamTitle: "ቡድኑ",
      viewAll: "ሁሉንም ይመልከቱ →",
    },
    services: {
      eyebrow: "ችሎታዎች",
      title: "አገልግሎቶች",
      description:
        "ከመጀመሪያ ሀሳብ እስከ የመጨረሻ ማቅረብ — ለብራንዶች፣ ለአርቲስቶች እና ለእውነተኛ ታሪኮች ሲኒማቲክ ፕሮዳክሽን።",
      viewWork: "ስራዎችን ይመልከቱ",
      startProject: "ፕሮጀክት ጀምር",
      ctaTitle: "የትኛው አገልግሎት እንደሚስማማ እርግጠኛ አይደሉም?",
      ctaDesc: "ስለ ሀሳብዎ ይንገሩን — ትክክለኛውን ቅርጽ እና የፕሮዳክሽን መንገድ እንመክራለን።",
      items: [
        {
          title: "ሙዚቃ ቪዲዮዎች",
          description:
            "ሀሳብ፣ ሲኒማቶግራፊ፣ ዳይሬክሽን፣ ፕሮዳክሽን፣ አርትዖት፣ ቀለም እና ማቅረብ — ጠንካራ የእይታ ማንነት ለሚፈልጉ አርቲስቶች።",
        },
        {
          title: "ኮሜርሻል ፊልሞች",
          description:
            "ለንግዶች እና ድርጅቶች በሲኒማቲክ ሙያ እና ግልጽ መልእክት የብራንድ እና የምርት ፊልሞች።",
        },
        {
          title: "የሰርግ ፊልሞች",
          description:
            "ስሜት-መጀመሪያ የሰርግ ታሪክ አተረጓጎም — ብቻ ሽፋን አይደለም፣ ለአስርተ ዓመታት የሚመለሱበት ፊልም።",
        },
        {
          title: "የዝግጅት ፕሮዳክሽን",
          description:
            "ለኮንፈረንስ፣ ለመጀመሪያዎች እና ለቀጥታ ጊዜያት ሙያዊ ብዙ-ካሜራ ቪዲዮ እና ፎቶግራፊ።",
        },
        {
          title: "ኮርፖሬት ፊልሞች",
          description:
            "የብራንድ ታሪኮች፣ የአመራር ቃለ-መጠይቆች፣ የባህል ፊልሞች እና የውስጥ ግንኙነት ቁርጥራጮች።",
        },
        {
          title: "ዶኩመንታሪዎች",
          description:
            "በእውነተኝነት እና በጥንቃቄ በተቀናጀ አርትዖት ላይ የተመሰረተ ረጅም እና አጭር ዶኩመንታሪ ስራ።",
        },
        {
          title: "የማህበራዊ ሚዲያ ይዘት",
          description:
            "ለኢንስታግራም፣ ቲክቶክ፣ ዩቱብ ሾርትስ እና የዘመቻ ቁርጥራጮች አጭር ሲኒማቲክ ይዘት።",
        },
        {
          title: "ፎቶግራፊ",
          description:
            "ከተንቀሳቃሽ ምስልዎ ቃና ጋር የሚስማማ ኮሜርሻል፣ ፖርትሬት፣ ዝግጅት እና የፈጠራ ስቲልስ።",
        },
      ],
    },
    contact: {
      eyebrow: "ተገናኙ",
      title: "አግኙን",
      description:
        "ውይይት ለመጀመር ዝግጁ ነዎት? በቀጥታ ያግኙን ወይም ትክክለኛውን ቀጣይ እርምጃ እንድንመልስ መዋቀረ ጥያቄ ይላኩ።",
      directLines: "ቀጥተኛ መስመሮች",
      noDetails: "የእውቂያ ዝርዝሮች በአስተዳዳሪ → ቅንብሮች ወይም በአካባቢ ተለዋዋጮች ሲዋቀሩ እዚህ ይታያሉ።",
      responseTitle: "የምላሽ ጊዜ",
      responseBody:
        "የፕሮጀክት ጥያቄዎች በተቀበሉበት ቅደም ተከተል ይገመገማሉ። ለጊዜ-አሳሳቢ ቀረጻዎች ተመራጭ ቀኖችን በቅጽዎ ያካትቱ።",
      primary: "ዋና",
      startTitle: "ፕሮጀክት ጀምር",
      startDesc:
        "ባለብዙ-ደረጃ ጥያቄ — ራዕይ፣ ቀኖች፣ ቦታ፣ በጀት እና ማጣቀሻዎች። ግልጽ ብሪፍ ላላቸው ፕሮዳክሽኖች።",
      beginInquiry: "ጥያቄ ጀምር →",
      meeting: "ስብሰባ",
      consultTitle: "ምክክር ይያዙ",
      consultDesc:
        "የፈጠራ አቅጣጫ፣ የፕሮዳክሽን እቅድ፣ የሰርግ ወይም የሙዚቃ ቪዲዮ ስብሰባዎች — ከመጀመርዎ በፊት ለመነጋገር።",
      requestSlot: "ቦታ ይጠይቁ →",
    },
    work: {
      eyebrow: "ፖርትፎሊዮ",
      title: "ስራዎች",
      description:
        "በሙዚቃ፣ ብራንድ፣ ሰርግ እና ዶኩመንታሪ ላይ የተመረጡ ሲኒማቲክ ፕሮጀክቶች። እያንዳንዱ ፍሬም ታሪክ ይናገራል።",
      empty:
        "አዲስ ስራ በቅርብ ይታተማል። በስቱዲዮ ዳሽቦርድ ላይ እንደ ታተመ ሲሰየሙ ፕሮጀክቶች እዚህ ይታያሉ።",
      commission: "ፕሮጀክት ይያዙ",
    },
    team: {
      eyebrow: "ስቱዲዮ",
      title: "ቡድን",
      description: "ሀሳቦችን ወደ ፍሬሞች የሚቀይሩ ሰዎች — ዳይሬክሽን፣ ካሜራ፣ አርትዖት እና ፕሮዳክሽን።",
      empty: "የቡድን መገለጫዎች በአስተዳዳሪ ዳሽቦርድ ሲታተሙ እዚህ ይታያሉ።",
      aboutStudio: "ስለ ስቱዲዮው",
    },
    faq: {
      eyebrow: "ድጋፍ",
      title: "ተደጋጋሚ ጥያቄዎች",
      description: "ከሜታ ፒክቸርስ ጋር ስለመስራት የተለመዱ ጥያቄዎች።",
      stillQuestions: "ገና ጥያቄዎች አሉዎት?",
      contact: "አግኙን",
      startProject: "ፕሮጀክት ጀምር",
      fallback: [
        {
          q: "ፕሮጀክት እንዴት እይዛለሁ?",
          a: "የፕሮጀክት ጀምር ቅጽን ይጠቀሙ ወይም ምክክር ይያዙ። ብሪፍዎን እንገመግማለን እና ቀጣይ እርምጃዎችን ከግልጽ ሀሳብ ጋር እንመልሳለን።",
        },
        {
          q: "ለፕሮዳክሽን ይጓዛሉ?",
          a: "አዎ። የጉዞ እና የቦታ ዝርዝሮች በጥያቄ እና ሀሳብ ደረጃ ይረጋገጣሉ።",
        },
        {
          q: "በተለመደ ጥቅል ምን ይካተታል?",
          a: "ጥቅሎች በፕሮጀክት አይነት ይለያያሉ። ሙዚቃ ቪዲዮ፣ ኮሜርሻል እና ሰርግ እያንዳንዳቸው የተለያየ ስፋት አላቸው — ማካተቶች በሀሳቡ ውስጥ ይዘረዘራሉ።",
        },
        {
          q: "ማቅረብ ምን ያህል ጊዜ ይወስዳል?",
          a: "ጊዜያት በውስብስብነት ይወሰናሉ። ካሜራዎች ከመንቀሳቀሳቸው በፊት የፕሮዳክሽን መርሃ ግብር ይስማማል።",
        },
        {
          q: "ማሻሻያ መጠየቅ እችላለሁ?",
          a: "አዎ። የማሻሻያ ዙሮች በፕሮዳክሽን ስምምነት ውስጥ ይገለጻሉ ስለዚህ ተስፋዎች ግልጽ ይቆያሉ።",
        },
        {
          q: "የመጨረሻው ቀረጻ ማን ነው ባለቤቱ?",
          a: "የአጠቃቀም መብቶች እና ባለቤትነት በውሉ ውስጥ ይገለጻሉ። የደንበኛ ሚዲያ መብቶች ከማቅረብ በፊት ይመዘገባሉ።",
        },
      ],
    },
    journal: {
      eyebrow: "ታሪኮች",
      title: "ጆርናል",
      description: "ከስብስብ፣ ከሂደት እና ከባህል በሜታ ፒክቸርስ ማስታወሻዎች።",
    },
    bookConsultation: {
      eyebrow: "ስብሰባ",
      title: "ምክክር ይያዙ",
      description:
        "ዓይነት፣ ተመራጭ ቀን እና ምን ማውያት እንደሚፈልጉ አጭር ማስታወሻ ይምረጡ።",
      typeLabel: "የምክክር ዓይነት *",
      types: [
        "የፈጠራ ምክክር",
        "የፕሮዳክሽን እቅድ",
        "ኮሜርሻል ስብሰባ",
        "የሰርግ ምክክር",
        "የሙዚቃ ቪዲዮ ምክክር",
      ],
      fullName: "ሙሉ ስም *",
      email: "ኢሜይል *",
      phone: "ስልክ",
      preferredDate: "ተመራጭ ቀን",
      projectNotes: "የፕሮጀክት ማስታወሻዎች",
      notesPlaceholder: "ምን ማውያት ይፈልጋሉ?",
      submit: "ምክክር ይጠይቁ",
      submitting: "በመላክ ላይ…",
      selectTypeError: "እባክዎ የምክክር ዓይነት ይምረጡ።",
      submitError: "መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
      networkError: "የኔትወርክ ስህተት። ግንኙነትዎን ይፈትሹ እና እንደገና ይሞክሩ።",
      successEyebrow: "ተቀብለናል",
      successTitle: "ምክክር ተጠይቋል",
      successBody:
        "ጥያቄዎ ደርሶናል። ሜታ ፒክቸርስ ተገኝነትን ያረጋግጣል እና በቅርቡ ያገኝዎታል።",
      returnHome: "ወደ መነሻ ተመለስ",
      viewWork: "ስራዎችን ይመልከቱ",
    },
    startProject: {
      eyebrow: "ጥያቄ",
      title: "ፕሮጀክት ጀምር",
      description:
        "ስለ ራዕይዎ ይንገሩን። ቀጣይ እርምጃዎችን እና ግልጽ የፕሮዳክሽን መንገድ እንመልሳለን።",
      steps: [
        "ደንበኛ",
        "የፕሮጀክት ዓይነት",
        "ዝርዝሮች",
        "ቀን እና ቦታ",
        "በጀት",
        "ፋይሎች",
        "ግምገማ",
      ],
      stepOf: "ደረጃ {current} ከ {total}",
      fullName: "ሙሉ ስም *",
      company: "ኩባንያ / አርቲስት",
      email: "ኢሜይል *",
      phone: "ስልክ",
      whatsapp: "ዋትስአፕ",
      projectTypes: [
        "ሙዚቃ ቪዲዮ",
        "ኮሜርሻል",
        "የሰርግ ፊልም",
        "የዝግጅት ሽፋን",
        "ፎቶግራፊ",
        "ዶኩመንታሪ",
        "ኮርፖሬት ፊልም",
        "የማህበራዊ ሚዲያ ይዘት",
        "ሌላ",
      ],
      projectTitle: "የፕሮጀክት ርዕስ",
      projectDescription: "መግለጫ",
      creativeIdea: "የፈጠራ ሀሳብ",
      preferredDate: "ተመራጭ ቀን",
      alternativeDate: "አማራጭ ቀን",
      city: "ከተማ",
      location: "ቦታ / ቬኑ",
      budgets: [
        "ከ 10,000 ብር በታች",
        "10,000–25,000 ብር",
        "25,000–50,000 ብር",
        "50,000–100,000 ብር",
        "100,000+ ብር",
        "እርግጠኛ አይደለሁም / ጥቅስ እፈልጋለሁ",
      ],
      filesTitle: "የማጣቀሻ ፋይሎች (አማራጭ)",
      filesHint:
        "ለአሁን አገናኞችን በመግለጫው ውስጥ ማጋራት ይችላሉ። ደህንነቱ የተጠበቀ የፋይል መጫን በኋላ ይገናኛል።",
      summary: "ማጠቃለያ",
      summaryName: "ስም",
      summaryEmail: "ኢሜይል",
      summaryTypes: "ዓይነቶች",
      summaryBudget: "በጀት",
      summaryCity: "ከተማ",
      summaryDescription: "መግለጫ",
      back: "← ተመለስ",
      continue: "ቀጥል →",
      submit: "ጥያቄ ላክ",
      submitting: "በመላክ ላይ…",
      submitError: "መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
      networkError: "የኔትወርክ ስህተት። ግንኙነትዎን ይፈትሹ እና እንደገና ይሞክሩ።",
      successEyebrow: "ተቀብለናል",
      successTitle: "አመሰግናለን",
      successTagline: "ታሪክዎ እዚህ ይጀምራል።",
      successBody:
        "የፕሮጀክት ጥያቄዎ ተቀብሏል። ሜታ ፒክቸርስ መረጃዎን ይገመግማል እና ያገኝዎታል።",
      reference: "ማጣቀሻ",
      viewPortfolio: "ፖርትፎሊዮ ይመልከቱ",
      backHome: "ወደ መነሻ",
    },
    cta: {
      title: "ታሪክዎን ለመንገር ዝግጁ ነዎት?",
      description: "ሀሳብዎን፣ የጊዜ ሰሌዳዎን እና ራዕይዎን ያጋሩ። ወደ ሲኒማ እንቀርጻለን።",
      startProject: "ፕሮጀክት ጀምር",
      bookConsultation: "ምክክር ይያዙ",
    },
    notFound: {
      code: "404",
      title: "ይህ ፍሬም የለም።",
      description: "የሚፈልጉት ገጽ ተንቀሳቅሶ፣ ያልታተመ ወይም በጭራሽ ያልተቀረጸ ሊሆን ይችላል።",
      home: "ወደ መነሻ ተመለስ",
      viewWork: "ስራዎችን ይመልከቱ",
    },
    common: {
      all: "ሁሉም",
      loading: "በመጫን ላይ…",
      back: "ተመለስ",
    },
  } satisfies PageCopy,
} as const;

export type Locale = "en" | "am";

export function getPageCopy(locale: Locale): PageCopy {
  return pageCopy[locale] ?? pageCopy.en;
}
