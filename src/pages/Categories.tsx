import { gql } from '@apollo/client';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { returnSelectedProductIndex } from '../components/pureFunction';
import { Currency } from '../models/currency';
import { Product } from '../models/product';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';
import { client } from '../service/base';

interface CategoriesProps {
    activeCategory: string;
    activeCurrency: Currency;
    orders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>;
    ordersUpdate: (updatedOrders: Array<{
        product: Product;
        count: number;
        attr: Array<{
            attrId: string | number;
            attritemId: string | number;
        }>
    }>) => void
}

interface CategoriesState {
    activeCategory: string;
    data: Array<{
        name: string;
        products: Array<{
            id: string;
            gallery: Array<string>;
            name: string;
            prices: Array<{ amount: number, currency: { symbol: string; label: string } }>;
            category: string;
            brand: string;
            inStock: boolean
            description: string
            attributes: Array<{
                id: string;
                name: string;
                type: string;
                items: Array<{
                    id: string;
                    value: string;
                    displayValue: string;
                }>,
            }>
        }>
    }>
}

class CategoriesComponent extends Component<CategoriesProps, CategoriesState> {

    constructor(props: CategoriesProps) {
        super(props);
        this.state = {
            activeCategory: this.props.activeCategory,
            data: [],
        }
    }

    componentDidMount() {
        this.fetchAllCategories()
    }

    componentDidUpdate(prevProps: CategoriesProps) {
        if (prevProps.activeCategory === this.props.activeCategory) {
            return
        } else {
            this.setState({ ...this.state, activeCategory: this.props.activeCategory })
        }

    }

    async fetchAllCategories() {
        try {
            let res = await client.query({
                query: gql`
                    query{
                        categories{
                            name,
                            products{
                                id,
                                gallery,
                                name,
                                prices{
                                    amount,
                                    currency{
                                        label,
                                        symbol,
                                    },
                                }
                                category, 
                                brand, 
                                inStock, 
                                description, 
                                attributes{
                                    id,
                                    name,
                                    type,
                                    items{
                                        id,
                                        value,
                                        displayValue,
                                    },
                                },
                            }
                        }
                    }
                `
            })
            this.setState({ ...this.state, data: res.data.categories })
        } catch (error) {
            console.error(error)
        }
    }

    extractDefaultAttributes(product: Product): Array<{
        attrId: string | number;
        attritemId: string | number;
    }> {
        if (!product.attributes.length) return [];
        let attributes: Array<{
            attrId: string | number;
            attritemId: string | number;
        }> = [];
        for (let i = 0; i < product.attributes.length; i++) {
            if (product.attributes[i].items.length) {
                attributes.push({
                    attrId: product.attributes[i].id,
                    attritemId: product.attributes[i].items[0].id,
                })
            }
        }
        return attributes;
    }

    render() {
        return (
            <div className='categories'>
                <div className='active-category'>{this.state.activeCategory}</div>
                <div className="list-wrapper">
                    {
                        this.state.data.find((item: {
                            name: string;
                            products: Array<{
                                id: string;
                                gallery: Array<string>;
                                name: string;
                                prices: Array<{ amount: number, currency: { symbol: string; label: string } }>;
                                category: string;
                                brand: string;
                                inStock: boolean
                                description: string
                                attributes: Array<{
                                    id: string;
                                    name: string;
                                    type: string;
                                    items: Array<{
                                        id: string;
                                        value: string;
                                        displayValue: string;
                                    }>,
                                }>
                            }>
                        }) => { return item.name === this.state.activeCategory }) !== null
                            ? this.state.data.find((item: {
                                name: string;
                                products: Array<{
                                    id: string;
                                    gallery: Array<string>;
                                    name: string;
                                    prices: Array<{ amount: number, currency: { symbol: string; label: string } }>;
                                    category: string;
                                    brand: string;
                                    inStock: boolean;
                                    description: string;
                                    attributes: Array<{
                                        id: string;
                                        name: string;
                                        type: string;
                                        items: Array<{
                                            id: string;
                                            value: string;
                                            displayValue: string;
                                        }>,
                                    }>
                                }>
                            }) => { return item.name === this.state.activeCategory })?.products.map((product: {
                                id: string;
                                gallery: Array<string>;
                                name: string;
                                prices: Array<{ amount: number, currency: { symbol: string; label: string } }>;
                                category: string;
                                brand: string;
                                inStock: boolean
                                description: string
                                attributes: Array<{
                                    id: string;
                                    name: string;
                                    type: string;
                                    items: Array<{
                                        id: string;
                                        value: string;
                                        displayValue: string;
                                    }>,
                                }>
                            }, i: number) => {
                                return <div
                                    className='item'
                                    key={i.toString()}
                                    onClick={() => {
                                        window.location.replace(`/product-detail/${product.id}`)
                                    }}
                                >
                                    <div className="img-wrapper">
                                        <img className='item-img' src={product.gallery[0]} alt='' />
                                        {
                                            product.inStock !== true
                                                ? undefined
                                                : <div
                                                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                                        event.stopPropagation();
                                                        if (product.inStock !== true) return
                                                        let copiedOrders: StoreModel['orders'] = this.props.orders.length ? [...this.props.orders] : [];
                                                        let newOrder = {
                                                            product: product,
                                                            count: 1,
                                                            attr: this.extractDefaultAttributes(product),
                                                        };
                                                        let index: number | undefined = returnSelectedProductIndex(this.props.orders, newOrder)
                                                        if (typeof index === 'number') {
                                                            copiedOrders[index].count = copiedOrders[index].count + 1;
                                                            this.props.ordersUpdate(copiedOrders);
                                                        } else {
                                                            copiedOrders.push(newOrder);
                                                            this.props.ordersUpdate(copiedOrders);
                                                        }
                                                    }}
                                                    className="order-icon"
                                                >
                                                    <i className="fa fa-shopping-cart fa-2x"></i>
                                                </div>
                                        }
                                    </div>
                                    <h6 className='name'>{product.name}</h6>
                                    <h6 className='brand'>{product.brand}</h6>
                                    <div className='price'>
                                        {product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].currency.symbol}
                                        {product.prices.filter((item: { amount: number, currency: { symbol: string } }) => item.currency.symbol === this.props.activeCurrency.symbol)[0].amount}
                                    </div>
                                    {
                                        product.inStock !== true
                                            ? <h6 className='is-stock color-red'>Out of stock</h6>
                                            : undefined
                                    }
                                </div>
                            })
                            : undefined
                    }
                </div>
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        orders: store.orders,
        activeCategory: store.activeCategory,
        activeCurrency: store.activeCurrency,
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {
        ordersUpdate: (orders: Array<{
            product: Product;
            count: number;
            attr: Array<{
                attrId: string | number;
                attritemId: string | number;
            }>
        }>) => dispatch({ type: REDUX_ACTIONS.ORDERS_UPDATE, payload: orders })
    }
}

export const Categories = connect(storeToProps, dispatchToProps)(CategoriesComponent)