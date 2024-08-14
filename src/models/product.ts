export interface Product {
  id: number;
  name: string;
  unit?: number;
  quantity?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}

export type ProductWithUnitQuantity = Product & {
  unit: number;
  quantity: number;
};
