import { Component, Fragment } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreModel } from '../redux/storeModel';
import { Currency } from '../models/currency';
import { Product } from '../models/product';
import { CurrencySelect } from './CurrencySelect';
import { CartQuickAccess } from './CartQuickAccess';
import { client } from '../service/base';
import { gql } from '@apollo/client';
import { REDUX_ACTIONS } from '../redux/actions';

interface HeaderComponentProps {
    orders: Array<{
        product: Product;
        count: number;
    }>
    allCategories: Array<string>;
    activeCategory: string;
    setActiveCategory: (categoryName: string) => void;
    setAllCategories: (categories: Array<string>) => void;
}

interface HeaderComponentState {
    showCurrencyDropDown: boolean;
    showCartDropDown: boolean;
    allCurrencies: Array<Currency>;
}

class HeaderComponent extends Component<HeaderComponentProps, HeaderComponentState> {

    constructor(props: HeaderComponentProps) {
        super(props);
        this.state = {
            showCurrencyDropDown: false,
            showCartDropDown: false,
            allCurrencies: [],
        }
    }

    componentDidMount() {
        this.fetchAllCategories()
    }

    async fetchAllCategories() {
        try {
            let res = await client.query({
                query: gql`
                    query{
                        categories{
                        name
                      }
                    }
              `
            })
            let categories: Array<string> = res.data.categories.map((category: any, i: number) => { return category.name });
            this.props.setAllCategories(categories);
            if (categories.length > 0 && this.props.activeCategory === '') {
                this.props.setActiveCategory(categories[0])
            }
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className='header-wrapper'>
                <div className='left-side'>
                    {
                        this.props.allCategories.map((item: string, i: number) => {
                            return <Fragment key={i.toString()}>
                                <div
                                    key={i.toString()}
                                    onClick={() => {
                                        this.props.setActiveCategory(item);
                                        window.location.replace('/');
                                    }}
                                    className={`item ${item === this.props.activeCategory ? "selected" : ""}`}
                                >{item}</div>
                            </Fragment>
                        })
                    }
                </div>
                <div className='right-side' >
                    <CurrencySelect />
                    <CartQuickAccess />
                </div>
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        orders: store.orders,
        activeCategory: store.activeCategory,
        allCategories: store.allCategories
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {
        setActiveCategory: (categoryName: string) => dispatch({ type: REDUX_ACTIONS.ACTIVE_CATEGORY_UPDATE, payload: categoryName }),
        setAllCategories: (categories: Array<string>) => dispatch({ type: REDUX_ACTIONS.ALL_CATEGORIES_UPDATE, payload: categories })
    }
}

export const Header = connect(storeToProps, dispatchToProps)(HeaderComponent)