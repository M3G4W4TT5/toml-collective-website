import assets from "./deck-assets.json";
import legacy from "./legacy-content.json";
export const asset = (key: keyof typeof assets) => assets[key].src;
export type Section = { label: string; title: string; text: string };
export type Project = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  discipline: string;
  categories: string[];
  client: string;
  partner?: string;
  image: string;
  gallery: string[];
  sections: Section[];
  outcomes: { title: string; detail: string }[];
  outcomeLabel: string;
  outcomeNote?: string;
  source?: string;
  imageAlt?: string;
  imageCredit?: string;
  galleryDescriptions?: { alt: string; credit: string }[];
  campaigns?: { title: string; href: string; description: string }[];
};
const legacyImages = (slug: keyof typeof legacy) =>
  legacy[slug].images.map((i) => i.src);
export const projects: Project[] = [
  {
    slug: "siebert",
    title: "Siebert Financial",
    headline: "Siebert",
    summary: "A financial pioneer, reintroduced to a new generation.",
    discipline: "Brand identity / Campaigns / Content",
    categories: ["Branding", "Campaigns", "Film & content"],
    client: "Siebert Financial",
    image: asset("p1-p1_i21"),
    gallery: [asset("p3-p3_i116"), asset("p3-p3_i117"), asset("p3-p3_i118")],
    sections: [
      {
        label: "The brief",
        title: "Carry the spirit forward.",
        text: "Reintroduce a pioneering financial brand to younger and underserved investors, while keeping Muriel Siebert’s original spirit of independence.",
      },
      {
        label: "Our approach",
        title: "An independent spirit.",
        text: "Bold colour and expressive type give the brand a distinct voice. The visual language draws on punk imagery and early trading terminals, with the mission of financial freedom for everyone.",
      },
      {
        label: "What we made",
        title: "One connected brand.",
        text: "A visual identity carried into digital and campaign work. Our ongoing partnership includes content strategy, PR and campaign development.",
      },
    ],
    outcomeLabel: "In the world",
    outcomes: [
      { title: "75K+", detail: "Instagram followers\nFrom zero in 10 months" },
      { title: "+60%", detail: "Organic social reach" },
      { title: "A rebrand.\nAn ongoing partnership.", detail: "" },
    ],
    outcomeNote:
      "Performance figures reported in TOML’s published Siebert case study.",
    source: "https://www.tomlcollective.com/siebert",
    campaigns: [
      {
        title: "Generation Wealth",
        href: "/work/siebert-generation-wealth",
        description: "Say yeah to financial freedom.",
      },
      {
        title: "Corporate Bonds",
        href: "/work/siebert-corporate-bonds",
        description: "A campaign for Siebert Financial.",
      },
      {
        title: "Don’t be that guy",
        href: "https://www.behance.net/gallery/255538541/Dont-be-that-Guy",
        description: "Explore the campaign on Behance.",
      },
    ],
  },
  {
    slug: "eth-zurich-space",
    title: "ETH Zürich Space",
    headline: "ETH Zürich\nSpace",
    summary: "A new digital home for space research.",
    discipline: "Website / UX & UI",
    categories: ["Digital"],
    client: "ETH Zürich Space",
    image: asset("p1-p1_i25"),
    gallery: [asset("p4-p4_i32"), asset("p4-p4_i33"), asset("p4-p4_i34")],
    sections: [
      {
        label: "The brief",
        title: "Curiosity, invited in.",
        text: "Create an engaging home for space research, connecting students, researchers and industry partners.",
      },
      {
        label: "The thinking",
        title: "A clearer way to explore.",
        text: "Bring research and activity into a coherent digital experience, with a visual language that sparks curiosity.",
      },
      {
        label: "The making",
        title: "A website with perspective.",
        text: "Website design and UX/UI, giving the Space section a clear identity online and room for its research to grow.",
      },
    ],
    outcomeLabel: "Recognition",
    outcomes: [
      { title: "UI / UX", detail: "CSS Design Awards" },
      { title: "Innovation", detail: "CSS Design Awards" },
      { title: "Recognised for\nthe experience.", detail: "" },
    ],
    source: "https://www.tomlcollective.com/eth-space",
  },
  {
    slug: "ubs-red-thread",
    title: "UBS / The Red Thread",
    headline: "The Red\nThread",
    summary: "One creative thread across a global event series.",
    discipline: "Art direction / Film / Event communications",
    categories: ["Campaigns", "Film & content"],
    client: "UBS Asset Management",
    partner: "UNIT9",
    image: asset("p1-p1_i29"),
    gallery: [asset("p5-p5_i32"), asset("p5-p5_i33"), asset("p5-p5_i34")],
    sections: [
      {
        label: "The brief",
        title: "A shared conversation.",
        text: "Give a global thought leadership event series a connected identity while making each location relevant to its audience.",
      },
      {
        label: "The thinking",
        title: "Consistency with context.",
        text: "Carry one creative direction across the series, with content and materials adapted to each market.",
      },
      {
        label: "The making",
        title: "Across screens and spaces.",
        text: "Art direction with UNIT9, spanning film, digital communications and printed materials for the events.",
      },
    ],
    outcomeLabel: "The reach of the programme",
    outcomes: [
      { title: "14", detail: "International business centres" },
      { title: "3", detail: "Continents" },
      { title: "A shared thread.\nLocal perspectives.", detail: "" },
    ],
    source: "https://www.tomlcollective.com/ubs",
  },
  {
    slug: "vvitaverse",
    title: "Vvitaverse",
    headline: "Vvitaverse",
    summary:
      "An immersive branding experience for the first Italian metaverse.",
    discipline: "Art direction / UX & UI / Film / Campaigns",
    categories: ["Digital", "Film & content", "Campaigns"],
    client: "VVITA",
    partner: "Misty Media / Le Polish Bureau / UNIT9",
    image: legacyImages("vvita")[1],
    gallery: legacyImages("vvita"),
    sections: [
      {
        label: "The brief",
        title: "Beyond possible.",
        text: "We helped VVITA create an immersive branding experience, including a captivating video launch campaign, innovative launch strategies, engaging interactive games, and activities tailored for the first Italian metaverse.",
      },
      {
        label: "The experience",
        title: "A world to explore.",
        text: "Our team also meticulously crafted the user experience (UX) and user interface (UI) to ensure a seamless and visually stunning digital journey.",
      },
      {
        label: "Metagiro",
        title: "A new way into the race.",
        text: "Giro d’Italia embraced the realms of Web3 and the Metaverse by creating an exciting online game where participants could register to embark on a virtual exploration of Italy’s breathtaking bike tour, acquiring exclusive digital collections, redeeming subscriptions to Gazzetta dello Sport, and receiving the prestigious Maglia Rosa at their doorstep.",
      },
    ],
    outcomeLabel: "The work",
    outcomes: [
      {
        title: "Experience",
        detail: "UX design system and experience mapping",
      },
      { title: "Film", detail: "Branded teaser and launch campaign" },
      {
        title: "Metagiro",
        detail: "Giro d’Italia / VVITA\nDeveloper: Le Polish Bureau",
      },
    ],
    source: "https://www.tomlcollective.com/vvita",
  },
  {
    slug: "carvago",
    title: "Carvago",
    headline: "Carvago",
    summary: "A launch campaign for a new way to buy a car.",
    discipline: "Launch campaign / Marketing strategy",
    categories: ["Campaigns", "Film & content"],
    client: "Carvago",
    image: legacyImages("carvago")[0],
    gallery: legacyImages("carvago"),
    sections: [
      {
        label: "The challenge",
        title: "Entering new markets.",
        text: "Carvago, the largest European online platform for selling used cars, was entering the Czech Republic and the Western Balkans markets. The company asked us to create an enduring communications strategy.",
      },
      {
        label: "The solution",
        title: "A memorable introduction.",
        text: "Innovative and memorable digital and OOH marketing campaigns with a high-profile event launch that resonated with the local audiences, effectively conveying Carvago’s brand values, and drive market penetration and customer engagement in these new regions.",
      },
      {
        label: "The response",
        title: "A strong first three months.",
        text: "In the first 3 months only, the campaign generated over 15m+ audience reach, 150k active online users and 1 million euro in revenue, in the Western Balkans alone.",
      },
    ],
    outcomeLabel: "The response",
    outcomes: [
      { title: "15M+", detail: "Audience reach" },
      { title: "150K", detail: "Active online users" },
      { title: "€1M", detail: "Revenue in the Western Balkans" },
    ],
    outcomeNote:
      "Results reported by TOML for the campaign’s first three months.",
    source: "https://www.tomlcollective.com/carvago",
  },
  {
    slug: "rh45",
    title: "RH45",
    headline: "RH45",
    summary: "Designed in London. Made in Italy.",
    discipline: "Brand identity / Film / Digital / Prints",
    categories: ["Branding", "Digital", "Film & content"],
    client: "RH45",
    image: legacyImages("rh45")[0],
    gallery: legacyImages("rh45"),
    sections: [
      {
        label: "The challenge",
        title: "A complete brand universe.",
        text: "RH45, a London-based luxury streetwear brand made in Italy, wanted to elevate its presence. The goal was to create a cohesive brand system that could seamlessly connect its collections, digital presence, and global audience.",
      },
      {
        label: "The solution",
        title: "From fashion to film.",
        text: "TOML partnered with RH45 to design a complete brand universe. We established the visual identity — shaping how the brand expresses itself across fashion, media, and culture, including the prints on the garments themselves.",
      },
      {
        label: "The making",
        title: "Across every touchpoint.",
        text: "We created the digital ecosystem — designing a website that became a hub for storytelling, creative collaborations, and global commerce. We built the communication framework — from campaigns to content strategy, ensuring the brand could grow consistently across markets.",
      },
    ],
    outcomeLabel: "The work",
    outcomes: [
      { title: "Identity", detail: "Prints and garment collections" },
      { title: "Digital", detail: "Website and social content" },
      { title: "Film", detail: "Creative direction and production" },
    ],
    source: "https://www.tomlcollective.com/rh45",
  },
  {
    slug: "elja-unm",
    title: "Elja Ensemble / UNM",
    headline: "Elja / UNM",
    summary: "A new visual rhythm for contemporary music.",
    discipline: "Brand identity / Graphic design / Motion",
    categories: ["Branding", "Film & content"],
    client: "Elja Ensemble / UNM Iceland",
    image: asset("p1-p1_i33"),
    gallery: [asset("p6-p6_i32"), asset("p6-p6_i33"), asset("p6-p6_i34")],
    sections: [
      {
        label: "The brief",
        title: "Music, made visible.",
        text: "Festival branding for UNM and Elja, developed across graphic design and a 3D motion poster.",
      },
      {
        label: "The thinking",
        title: "A rhythm of its own.",
        text: "Graphic form and moving image give the music a visual language. Explore the identity and its applications below.",
      },
      {
        label: "The making",
        title: "From identity to motion.",
        text: "Branding, graphic design and a 3D motion poster, with the identity carried into festival materials.",
      },
    ],
    outcomeLabel: "The work",
    outcomes: [
      { title: "Branding", detail: "Graphic identity and design" },
      { title: "Motion", detail: "3D motion poster" },
      { title: "A visual language\nfor the festival.", detail: "" },
    ],
    source: "https://www.tomlcollective.com/unm",
  },
  {
    slug: "siebert-generation-wealth",
    title: "Siebert / Generation Wealth",
    headline: "Generation\nWealth",
    summary: "Say yeah to financial freedom.",
    discipline: "Campaign strategy / Film / Digital / OOH",
    categories: ["Campaigns", "Film & content"],
    client: "Siebert Financial",
    partner: "In-house Siebert team / Gebbia Media / TOML Collective",
    image: "/media/generation-wealth.webp",
    gallery: ["/media/generation-wealth.webp"],
    sections: [
      {
        label: "The challenge",
        title: "A new generation of investors.",
        text: "How can a 55 year old legacy financial brand connect with the new generation of investors and convert them into customers that last?",
      },
      {
        label: "The approach",
        title: "Build your wealth on your own terms.",
        text: "This concept reclaims every Gen Z financial stereotype — reckless spender, avocado-toast addict, luxury chaser — and reframes them as power moves. Because today, building wealth doesn’t have to mean giving up the life you love.",
      },
      {
        label: "The making",
        title: "A connected campaign.",
        text: "Cultural and behavioural research. Tone of voice and messaging framework. Content strategy and rollout. Campaign’s signature visual identity. Hero film production. Digital and OOH campaign production. Landing page and lead generation.",
      },
    ],
    outcomeLabel: "Campaign impact",
    outcomes: [
      { title: "21.5M+", detail: "Total impressions across all platforms" },
      { title: "~2K", detail: "Highly qualified lead form completions" },
      { title: "30%+", detail: "Newsletter open rate" },
    ],
    outcomeNote:
      "Figures supplied in “Gen W Case Study Final.pdf”. Created by the in-house Siebert team and Gebbia Media in collaboration with TOML Collective.",
    source:
      "https://drive.google.com/file/d/18ZxlDAEdAYUDRaZre9J8pXgAqN361Fgr/view",
  },
  {
    slug: "siebert-corporate-bonds",
    title: "Siebert / Corporate Bonds",
    headline: "Corporate\nBonds",
    summary: "Corporate Bonds",
    discipline: "Campaigns / Content",
    categories: ["Campaigns"],
    client: "Siebert Financial",
    image: "/media/corporate-bonds-0.webp",
    gallery: ["/media/corporate-bonds-1.webp", "/media/corporate-bonds-0.webp"],
    sections: [],
    outcomeLabel: "The campaign",
    outcomes: [],
    source: "https://www.behance.net/gallery/254885217/Corporate-Bonds",
  },
];
export const selectedProjects = projects.slice(0, 4);
export { enquiryTypes } from "../lib/enquiry-types";
export const enquire = (type: string, member?: string) =>
  "/contact?" +
  new URLSearchParams({ type, ...(member ? { member } : {}) }).toString();
export const team = [
  {
    name: "Virtyt",
    role: "Founder & Creative Lead",
    image: asset("p10-p10_i390"),
    initials: "VP",
    bio: "Creative direction and strategy, with a focus on visual storytelling. Virtyt founded TOML and leads the collective.",
  },
  {
    name: "Elza",
    role: "Art Director & Creative Producer",
    image: asset("p10-p10_i395"),
    initials: "ED",
    bio: "Art direction and creative production, keeping the idea connected to the way we make it.",
  },
  {
    name: "Mimi",
    role: "Marketing Manager",
    image: asset("p10-h796408d6f171eb9c_0_3"),
    initials: "MM",
    bio: "Marketing, connecting TOML’s work and people with clients and new opportunities.",
  },
  {
    name: "Elvira",
    role: "Senior Graphic Designer",
    image: "",
    initials: "ET",
    bio: "Graphic design and visual identity, with care for composition and the details that carry a brand.",
  },
  {
    name: "Vita",
    role: "Social Media Manager",
    image: "",
    initials: "VK",
    bio: "Social media and content, shaping how brands show up in feeds.",
  },
  {
    name: "Debora",
    role: "Creative & Writer",
    image: "",
    initials: "DD",
    bio: "Writing and creative development, from the first thought to the words that carry it.",
  },
];
export type Member = {
  slug: string;
  name: string;
  fullName: string;
  discipline: string;
  categories: string[];
  image: string;
  gallery: string[];
  bio: string;
  source: string;
  imageAlt?: string;
  imageCredit?: string;
  galleryDescriptions?: { alt: string; credit: string }[];
};
const memberRows: [string, string, string, string, string, string[]][] = [
  [
    "petrit",
    "Petrit",
    "Petrit Ukëhajdaraj",
    "petrit-ukehajdaraj",
    "Cinematography",
    ["Film & photography"],
  ],
  ["manshu", "Manshu", "Manshu Li", "manshu-li", "Illustration", ["Design"]],
  [
    "nertil",
    "Nertil",
    "Nertil Muhaxhiri",
    "nertil-muhaxhiri",
    "Art Direction & Graphic Design",
    ["Design"],
  ],
  [
    "valon",
    "Valon",
    "Valon Jashari",
    "valon-jashari",
    "3D Animation",
    ["Animation & VFX"],
  ],
  [
    "joan",
    "Joan",
    "Joan Kamberaj",
    "joankamberaj",
    "Stop Motion & Animation",
    ["Animation & VFX"],
  ],
  [
    "nick",
    "Nick",
    "Nick Dunne",
    "nick-dunne",
    "Photography",
    ["Film & photography"],
  ],
  [
    "besar",
    "Besar",
    "Besar Ismaili",
    "besar-ismaili",
    "VFX & Compositing, AI Lead",
    ["Animation & VFX"],
  ],
  ["debora", "Debora", "Debora Deva", "", "Writing & AI Content", ["Writing"]],
  ["colin", "Colin", "Colin Verdi", "colin-verdi", "Illustration", ["Design"]],
  [
    "elrid",
    "Elrid",
    "Elrid Carvalho",
    "elrid-carvalho",
    "Copywriting",
    ["Writing"],
  ],
  [
    "arvan",
    "Arvan",
    "Arvan Berisha",
    "arvan-berisha",
    "Design & Illustration",
    ["Design"],
  ],
  [
    "firar",
    "Firar",
    "Firar Kayran",
    "firar-kayran",
    "Cinematography",
    ["Film & photography"],
  ],
];
const memberImages = [
  "p11-p11_i598",
  "p11-p11_i599",
  "p11-p11_i600",
  "p11-p11_i601",
  "p11-p11_i602",
  "p11-p11_i603",
  "p11-p11_i604",
  "",
  "p11-p11_i608",
  "p11-p11_i609",
  "p11-p11_i610",
  "p11-p11_i611",
];
export const members: Member[] = memberRows.map(
  ([slug, name, fullName, oldSlug, discipline, categories], i) => ({
    slug,
    name,
    fullName,
    discipline,
    categories,
    image: memberImages[i] ? asset(memberImages[i] as keyof typeof assets) : "",
    gallery: oldSlug ? legacyImages(oldSlug as keyof typeof legacy) : [],
    bio:
      slug === "nertil"
        ? "An art director and graphic designer represented by TOML. Explore Nertil’s portfolio, or talk to us about bringing him into your next project."
        : slug === "debora"
          ? team[5].bio
          : slug === "colin"
            ? legacy["colin-verdi"].text[1]
            : "",
    source: oldSlug
      ? "https://www.tomlcollective.com/" + oldSlug
      : "https://www.linkedin.com/in/debora-deva-859425150/",
  }),
);
export const journalArticles = [
  {
    title:
      "Henrique Ghersi on building worlds for music, performance and installations",
    href: "https://www.tomljournal.com/interview-with-henrique-ghersi",
  },
  {
    title: "Is imperfection in design still meaningful when it’s intentional?",
    href: "https://www.tomljournal.com/imperfection-design-language",
  },
  {
    title: "Interview / Tina Touli",
    href: "https://www.tomljournal.com/interview-with-tina-touli",
  },
];
export const playlists = [
  {
    title: "Studio Flow",
    art: "STUDIO\nFLOW",
    description: "A steady mix for getting into it.",
    colour: "#ff532f",
  },
  {
    title: "Late Night Layouts",
    art: "LATE NIGHT\nLAYOUTS",
    description: "For the ideas that turn up after hours.",
    colour: "#b4c9ee",
  },
  {
    title: "Soft Launch",
    art: "SOFT\nLAUNCH",
    description: "Optimistic sounds for what’s next.",
    colour: "#f1b7c6",
  },
  {
    title: "Signals",
    art: "SIGNALS",
    description: "Music for a wider perspective.",
    colour: "#c0d8b5",
  },
  {
    title: "Brain Food",
    art: "BRAIN\nFOOD",
    description: "A little space to think.",
    colour: "#e7daaf",
  },
];
