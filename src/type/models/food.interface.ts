import { SaleType } from './food.enum'
import { Spec } from './spec.interface'
import { File } from './file.interface'
export interface Food {
  id?: number;

  imgUrl: string;

  name: string;

  description: string;

  detail: string;

  specs?: Spec[];

  originPrice?: number | string;

  isPublished?: boolean;

  saleType?: SaleType;

  images?: File[];

  createdAt?: Date;
}

export interface FoodPartial {
  imgUrl?: string;

  name?: string;

  desc?: string;

  detail?: string;

  originPrice?: number;

  isPublished?: boolean;

  saleType?: SaleType;

  images?: File[]
}
