export type Species = 'dog' | 'cat' | 'both';

export type CategoryId = 'dogs' | 'cats' | 'care' | 'play' | 'home';

export type CropSide = 'left' | 'right' | 'full';

export type LifeStage = 'young' | 'adult' | 'senior';

export type Temperament = 'calm' | 'playful' | 'adventurous';

export type Focus = 'comfort' | 'play' | 'meals' | 'grooming' | 'walk';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  categoryLabel: string;
  categories: CategoryId[];
  species: Species;
  price: number;
  image: string;
  crop: CropSide;
  tags: Focus[];
  lifeStages: LifeStage[];
  sizes: string;
  description: string;
  details: string[];
}

export interface CartLine {
  id: string;
  qty: number;
}

export type ToastIcon = 'bag' | 'heart' | 'check';

export interface ToastItem {
  id: number;
  message: string;
  icon: ToastIcon;
}
