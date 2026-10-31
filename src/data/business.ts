import type { Business } from './types';

export const business: Business = {
  provisional: false,
  siteUrl: 'https://da-sandro.be',
  name: 'Da Sandro',
  legalName: 'Sandro Meledina',
  legalForm: 'Personne physique',
  phone: '+32475291467',
  email: 'da.sandro.pizza@gmail.com',
  legalAddress: 'Rue Diérain Patar 55, 4460 Grâce-Hollogne',
  companyNumber: '0753.297.347',
  vatNumber: 'BE 0753.297.347',
  areaServed: 'Région liégeoise',
  // Placeholders: the production build refuses these until they point to the real pages.
  socialLinks: [
    { network: 'facebook', url: 'https://www.facebook.com/' },
    { network: 'instagram', url: 'https://www.instagram.com/' },
  ],
};
