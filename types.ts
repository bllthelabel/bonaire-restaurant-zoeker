
export interface Restaurant {
  name: string;
  rating: number;
  numberOfReviews: number;
  cuisines: string[];
  city: string;
  priceLevel: string;
  features: string[];
  webUrl: string;
  image: string;
}

export interface Filters {
  name: string;
  city: string;
  cuisine: string;
  priceLevel: string;
  minRating: number;
  features: string[];
}

export type FilterType = keyof Filters;
