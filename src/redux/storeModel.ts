import { Currency } from "../models/currency";
import { Product } from "../models/product";

export interface StoreModel {
    orders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>;
    activeCurrency: Currency;
    allCategories: Array<string>
    activeCategory: string;
    currencyDropdownStatus : boolean;
}