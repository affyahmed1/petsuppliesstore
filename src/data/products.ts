import type { Product, CategoryId } from '../types';

/* ————— campaign imagery ————— */
export const IMAGES = {
  hero: 'https://image.qwenlm.ai/generated-images/eb056b2e-2993-4f33-88c9-bad45da6a69a/_result.png',
  friendship:
    'https://image.qwenlm.ai/generated-images/4f1c1ccb-4b95-4cc0-8fcf-bea0e59303b8/_result.png',
  dogPanel:
    'https://image.qwenlm.ai/generated-images/eb698b27-aef8-4442-ae29-f01c24fcced1/_result.png',
  catPanel:
    'https://image.qwenlm.ai/generated-images/c85edbd3-a28e-4d8a-bc72-e1f909589297/_result.png',
  craft:
    'https://image.qwenlm.ai/generated-images/19ee41e0-3e20-4241-ae90-b398ff3f6280/_result.png',
  care: 'https://image.qwenlm.ai/generated-images/ccfa1649-a8d0-4232-abe0-a0bb0a3ae6b6/_result.png',
};

/* ————— product imagery (duo plates, cropped per side) ————— */
const PLATE_LEATHER =
  'https://image.qwenlm.ai/generated-images/5268ca58-8152-440a-a8e7-7261cfc35dc2/_result.png';
const PLATE_REST =
  'https://image.qwenlm.ai/generated-images/b3d7de0a-760f-40bb-91a7-348dd8fbb6bc/_result.png';
const PLATE_RITUAL =
  'https://image.qwenlm.ai/generated-images/b1919733-be86-4ff1-ac1b-c9c914692f0d/_result.png';
const PLATE_PLAY =
  'https://image.qwenlm.ai/generated-images/d7cc5d5a-3935-4748-9022-d3ebb0830b2b/_result.png';

export const PRODUCTS: Product[] = [
  {
    id: 'heritage-collar',
    name: 'The Heritage Collar',
    tagline: 'Vegetable-tanned leather, broken in by walks.',
    categoryLabel: 'Dogs · Walk',
    categories: ['dogs'],
    species: 'dog',
    price: 68,
    image: PLATE_LEATHER,
    crop: 'left',
    tags: ['walk'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: 'XS — L',
    description:
      'A collar cut from vegetable-tanned cognac leather that softens with every walk, finished with solid brass hardware that patinas rather than fades.',
    details: [
      'Vegetable-tanned cognac leather',
      'Solid brass buckle and D-ring',
      'Hand-stitched saddle seams',
      'Adjustable — sizes XS to L',
    ],
  },
  {
    id: 'wanderer-leash',
    name: 'The Wanderer Leash',
    tagline: 'A braided lead for the long way home.',
    categoryLabel: 'Dogs · Walk',
    categories: ['dogs'],
    species: 'dog',
    price: 54,
    image: PLATE_LEATHER,
    crop: 'right',
    tags: ['walk'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: '140 cm',
    description:
      'Braided cognac leather with a solid brass clip — long enough for the scenic route, quiet in the hand, and better every year you keep it.',
    details: [
      'Braided vegetable-tanned leather',
      'Solid brass clip, hand-polished',
      '140 cm — city to trail length',
      'Pairs with The Heritage Collar',
    ],
  },
  {
    id: 'sunday-bed',
    name: 'The Sunday Bed',
    tagline: 'Undyed wool bouclé for the household’s best sleeper.',
    categoryLabel: 'Dogs · Home',
    categories: ['dogs', 'home'],
    species: 'dog',
    price: 186,
    image: PLATE_REST,
    crop: 'left',
    tags: ['comfort'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: 'S — L',
    description:
      'A round nest of undyed wool bouclé with a removable, washable cover — sized for deep sleeps, long lie-ins, and the warmest spot on the floor.',
    details: [
      'Undyed wool bouclé exterior',
      'Removable, machine-washable cover',
      'Supportive recycled-fibre fill',
      'Three sizes — S to L',
    ],
  },
  {
    id: 'nook-cave',
    name: 'The Nook Cave',
    tagline: 'A felt hideaway for professional observers.',
    categoryLabel: 'Cats · Home',
    categories: ['cats', 'home'],
    species: 'cat',
    price: 118,
    image: PLATE_REST,
    crop: 'right',
    tags: ['comfort'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: 'One size',
    description:
      'A cave of pressed wool felt with a soft brushed-cotton interior — quiet, dim, and exactly the right temperature for an afternoon disappearance.',
    details: [
      'Pressed wool felt shell',
      'Soft brushed-cotton interior',
      'Holds warmth, sheds hair easily',
      'One considered size',
    ],
  },
  {
    id: 'stoneware-duo',
    name: 'The Stoneware Duo',
    tagline: 'Two bowls, glazed the colour of afternoon light.',
    categoryLabel: 'Dogs & Cats · Meals',
    categories: ['dogs', 'cats', 'care'],
    species: 'both',
    price: 58,
    image: PLATE_RITUAL,
    crop: 'left',
    tags: ['meals'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: '900 ml',
    description:
      'Twin terracotta stoneware bowls in a matte honey glaze — weighted to stay put, shaped to slow a fast eater down, lovely to leave out.',
    details: [
      'Glazed terracotta stoneware',
      'Weighted, non-slip base',
      'Dishwasher safe',
      '900 ml per bowl',
    ],
  },
  {
    id: 'beech-brush',
    name: 'The Beech Brush',
    tagline: 'Ten quiet minutes, twice a week.',
    categoryLabel: 'Care · Grooming',
    categories: ['care'],
    species: 'both',
    price: 36,
    image: PLATE_RITUAL,
    crop: 'right',
    tags: ['grooming'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: 'One size',
    description:
      'An oiled beech handle and natural bristles, shaped for long strokes that feel less like maintenance and more like company.',
    details: [
      'Oiled beech wood handle',
      'Natural soft bristles',
      'For short and long coats alike',
      'Hangs by its leather loop',
    ],
  },
  {
    id: 'feather-wand',
    name: 'The Feather Wand',
    tagline: 'For the hunter in the living room.',
    categoryLabel: 'Cats · Play',
    categories: ['cats', 'play'],
    species: 'cat',
    price: 28,
    image: PLATE_PLAY,
    crop: 'left',
    tags: ['play'],
    lifeStages: ['young', 'adult', 'senior'],
    sizes: '48 cm',
    description:
      'Naturally moulted feathers on a fine leather cord and walnut handle — the oldest negotiation between a cat and its person.',
    details: [
      'Naturally moulted feathers',
      'Walnut handle, leather cord',
      'Replaceable feather head',
      'Made in small batches',
    ],
  },
  {
    id: 'knot-rope',
    name: 'The Knot Rope',
    tagline: 'Cotton, knotted for tug-of-war negotiations.',
    categoryLabel: 'Dogs · Play',
    categories: ['dogs', 'play'],
    species: 'dog',
    price: 24,
    image: PLATE_PLAY,
    crop: 'right',
    tags: ['play'],
    lifeStages: ['young', 'adult'],
    sizes: 'One size',
    description:
      'Undyed cotton rope knotted by hand — soft on teeth, honest underfoot, and endlessly negotiable on a Sunday afternoon.',
    details: [
      'Undyed cotton rope',
      'Hand-knotted, no dyes',
      'Machine washable',
      'Gentle on young teeth',
    ],
  },
];

export const CATEGORIES: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dogs', label: 'Dogs' },
  { id: 'cats', label: 'Cats' },
  { id: 'care', label: 'Care' },
  { id: 'play', label: 'Play' },
  { id: 'home', label: 'Home' },
];

export function getProduct(id: string | null): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(0)}`;
}
