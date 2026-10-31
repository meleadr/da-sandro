import type { Menu } from './types';

export const menu: Menu = {
  provisional: true,
  categories: [
    {
      name: 'Les classiques',
      pizzas: [
        {
          name: 'Margherita',
          ingredients: ['sauce tomate', 'mozzarella', 'basilic'],
          priceCents: null,
        },
        {
          name: 'Regina',
          ingredients: ['sauce tomate', 'mozzarella', 'jambon', 'champignons'],
          priceCents: null,
        },
        {
          name: 'Quattro Formaggi',
          ingredients: ['sauce tomate', 'quatre fromages'],
          priceCents: null,
        },
      ],
    },
  ],
};
