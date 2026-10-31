import type { Menu } from './types';

export const menu: Menu = {
  provisional: false,
  note: 'Toutes nos pizzas sont préparées avec une pâte artisanale à la levure naturelle et avec des produits frais selon la tradition italienne.',
  categories: [
    {
      name: 'Nos pizzas',
      items: [
        {
          name: 'Margherita',
          ingredients: [
            'sauce tomate',
            'mozzarella fior di latte',
            'basilic',
            'filet d’huile d’olive',
          ],
          priceCents: 800,
        },
        {
          name: 'Prosciutto',
          ingredients: ['sauce tomate', 'mozzarella fior di latte', 'jambon'],
          priceCents: 900,
        },
        {
          name: 'Regina',
          ingredients: ['sauce tomate', 'mozzarella fior di latte', 'jambon cuit', 'champignon frais'],
          priceCents: 900,
        },
        {
          name: 'Capricciosa',
          ingredients: [
            'sauce tomate',
            'mozzarella fior di latte',
            'jambon',
            'champignons',
            'artichauts',
            'olives',
          ],
          priceCents: 1000,
        },
        {
          name: 'Diavola',
          ingredients: [
            'sauce tomate',
            'mozzarella fior di latte',
            'salami piquant',
            'poivrons rouges',
          ],
          priceCents: 1000,
        },
        {
          name: 'Parmigiana',
          ingredients: [
            'sauce tomate',
            'mozzarella fior di latte',
            'aubergines grillées',
            'parmesan',
            'basilic',
            'filet d’huile d’olive',
          ],
          priceCents: 1100,
        },
        {
          name: 'Végétarienne',
          ingredients: [
            'sauce tomate',
            'mozzarella fior di latte',
            'champignons',
            'artichauts',
            'olives',
          ],
          priceCents: 1100,
        },
      ],
    },
    {
      name: 'Boissons',
      items: [
        { name: 'Coca', ingredients: [], priceCents: 200 },
        { name: 'Coca zéro', ingredients: [], priceCents: 200 },
        { name: 'Eau plate', ingredients: [], priceCents: 200 },
        { name: 'Fanta', ingredients: [], priceCents: 200 },
        { name: 'Moretti', ingredients: [], priceCents: 300 },
      ],
    },
  ],
};
