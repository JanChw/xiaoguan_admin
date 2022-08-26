import { Address } from './address.interface'
import { Cart } from './cart.interface'
import { Order } from './order.interface'

export interface User {
    id?: number;
    name: string;
    phone: string;
    password?: string;
    addresses?: Address[];
    cart?: Cart;
    orders?: Order[];
  }
