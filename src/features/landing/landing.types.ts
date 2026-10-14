export type LandingLanguage = 'es' | 'en';

export type AuthEntryMode = 'login' | 'register';

export interface LandingContent {
  navigation: {
    possibilities: string;
    customization: string;
    process: string;
    preview: string;
    login: string;
    create: string;
    portfolio: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    reassurance: string;
    canvasLabel: string;
    available: string;
    role: string;
    projectLabel: string;
    projectTitle: string;
    skillsLabel: string;
    contactLabel: string;
  };
  possibilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      detail: string;
    }>;
  };
  customization: {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    panelLabel: string;
    liveLabel: string;
    sections: Array<{ label: string; enabled: boolean }>;
    cardTitle: string;
    cardDescription: string;
    addBlock: string;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  preview: {
    eyebrow: string;
    title: string;
    description: string;
    browserLabel: string;
    profileRole: string;
    profileBio: string;
    projectsLabel: string;
    featured: string;
    projectOne: string;
    projectOneType: string;
    projectTwo: string;
    projectTwoType: string;
    skillsLabel: string;
    languagesLabel: string;
    languageOne: string;
    languageTwo: string;
    contactLabel: string;
    contactCta: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    note: string;
  };
  footer: {
    tagline: string;
    product: string;
    possibilities: string;
    process: string;
    preview: string;
    access: string;
    login: string;
    create: string;
    copyright: string;
  };
}
