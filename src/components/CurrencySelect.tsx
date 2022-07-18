import { Component } from 'react';
import { gql } from '@apollo/client';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Currency } from '../models/currency';
import { REDUX_ACTIONS } from '../redux/actions';
import { StoreModel } from '../redux/storeModel';
import { client } from '../service/base';

interface CurrencySelectComponentProps {
    activeCurrency: Currency;
    showDropDown: boolean;
    initialCurrencySet: (currency: Currency) => void;
    setShowDropDown: (status: boolean) => void;
}

interface CurrencySelectComponentState {
    allCurrencies: Array<Currency>;
}

class CurrencySelectComponent extends Component<CurrencySelectComponentProps, CurrencySelectComponentState> {

    constructor(props: CurrencySelectComponentProps) {
        super(props);
        this.state = {
            allCurrencies: [],
        }
    }

    componentDidMount() {
        this.fetchAllCurrencies();
    }

    async fetchAllCurrencies() {
        try {
            let res = await client.query({
                query: gql`
                        query{
                            currencies{
                                label,
                                symbol
                            }
                        }
              `
            })
            this.setState({ ...this.state, allCurrencies: res.data.currencies }, () => {
                if (this.props.activeCurrency.symbol === '') {
                    this.props.initialCurrencySet(res.data.currencies[0]);
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className='currency-select-wrapper'>
                <div
                    className="current-currency"
                    onClick={() => this.props.setShowDropDown(!this.props.showDropDown)}
                >
                    {this.props.activeCurrency.symbol}
                    {
                        this.props.showDropDown
                            ? <i className="fa fa-angle-up"></i>
                            : <i className="fa fa-angle-down"></i>
                    }
                </div>
                {
                    this.props.showDropDown
                        ? <ul className="currency-list">
                            {
                                this.state.allCurrencies.map((item: Currency, i: number) => {
                                    return <li
                                        className={`item ${item.symbol === this.props.activeCurrency.symbol ? "selected" : ""}`}
                                        key={i.toString()}
                                        onClick={() => {
                                            this.props.initialCurrencySet(item);
                                            this.props.setShowDropDown(!this.props.showDropDown);
                                        }}
                                    >
                                        {item.symbol}{` `}{item.label}
                                    </li>
                                })
                            }
                        </ul>
                        : undefined
                }
            </div>
        );
    }
}

const storeToProps = (store: StoreModel) => {
    return {
        activeCurrency: store.activeCurrency,
        showDropDown: store.currencyDropdownStatus,
    }
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {
        initialCurrencySet: (currency: Currency) => dispatch({ type: REDUX_ACTIONS.ACTIVE_CURRENCY_UPDATE, payload: currency }),
        setShowDropDown: (status: boolean) => dispatch({ type: REDUX_ACTIONS.CURRENCY_DROPDOWN_STATUS_TOGGLE, payload: status })
    }
}

export const CurrencySelect = connect(storeToProps, dispatchToProps)(CurrencySelectComponent)