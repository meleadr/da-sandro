export interface NavLink {
  readonly label: string;
  readonly path: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Emplacements', path: '/emplacements' },
  { label: 'Événements', path: '/evenements' },
  { label: 'Contact', path: '/contact' },
];
