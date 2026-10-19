export const navigation = [
  { href: '/work', title: 'Work' },
  { href: '/about', title: 'About' },
  { href: '/people', title: 'People' },
  { href: '/journal', title: 'Journal' },
  { href: '/playlist', title: 'Playlist' },
  { href: '/contact', title: 'Contact' },
];

export const pages = [
  { path: 'about', title: 'About' },
  { path: 'about/approach', title: 'Approach' },
  { path: 'about/our-story', title: 'Our Story' },
  { path: 'about/house-of-toml', title: 'House of TOML' },
  { path: 'people', title: 'Core Team' },
  { path: 'journal', title: 'Journal' },
  { path: 'playlist', title: 'Playlist' },
  { path: 'contact', title: 'Contact' },
  { path: 'privacy-policy', title: 'Privacy Policy' },
  { path: 'cookies', title: 'Cookies' },
];

export const aboutPages = pages.filter(({ path }) => path.startsWith('about/'));
