import { Product } from "../models/product";

export function returnSelectedProductIndex(
    productsInCard: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>,
    selected: {
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }): number | undefined {
    let isProductExist: number | undefined = undefined;
    for (let i = 0; i < productsInCard.length; i++) {
        if (productsInCard[i].product.id === selected.product.id) {
            isProductExist = i;
            break;
        }
    }
    if (typeof isProductExist !== 'number') return undefined;

    let isAttrSame: boolean = true;

    for (let i = 0; i < productsInCard[isProductExist].attr.length; i++) {
        let isFound: boolean = false;
        for (let j = 0; j < selected.attr.length; j++) {
            if (selected.attr[j].attrId === productsInCard[isProductExist].attr[i].attrId &&
                selected.attr[j].attritemId === productsInCard[isProductExist].attr[i].attritemId
            ) {
                isFound = true;
                break;
            }
        }
        isAttrSame = isAttrSame && isFound;
        if (!isAttrSame) {
            break;
        }
    }

    if (!isAttrSame) return undefined;

    for (let i = 0; i < selected.attr.length; i++) {
        let isFound: boolean = false;
        for (let j = 0; j < productsInCard[isProductExist].attr.length; j++) {
            if (selected.attr[i].attrId === productsInCard[isProductExist].attr[j].attrId &&
                selected.attr[i].attritemId === productsInCard[isProductExist].attr[j].attritemId
            ) {
                isFound = true;
                break;
            }
        }
        isAttrSame = isAttrSame && isFound;
        if (!isAttrSame) {
            break;
        }
    }

    if (!isAttrSame) return undefined;

    return isProductExist
}