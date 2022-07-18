import { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Categories } from './pages/Categories';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Header } from './components/Header';
import { client } from './service/base';
import { gql } from '@apollo/client';
import './assets/main.scss';
import { StoreModel } from './redux/storeModel';
import { REDUX_ACTIONS } from './redux/actions';

interface AppProps {
  showDropDown: boolean;
  setShowDropDown: (status: boolean) => void;
}

interface AppState {
  allCategories: Array<string>;
  activeCategory: string;
}

class AppComponent extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      allCategories: [],
      activeCategory: ''
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
      this.setState({ ...this.state, allCategories: categories, activeCategory: categories[0] })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div
        className='app-wrapper'
        onClick={() => {
          if (this.props.showDropDown) {
            this.props.setShowDropDown(!this.props.showDropDown)
          }
        }}
      >
        <div className="header">
          <Header />
        </div>
        <div className="body">
          <Router>
            <Routes>
              <Route path='/' element={<Categories />} />
              <Route path='/product-detail/:id' element={<ProductDetail />} />
              <Route path='/cart' element={<Cart />} />
            </Routes>
          </Router>
        </div>
      </div>
    );
  }
}

const storeToProps = (store: StoreModel) => {
  return {
    showDropDown: store.currencyDropdownStatus,
  }
}

const dispatchToProps = (dispatch: Dispatch) => {
  return {
    setShowDropDown: (status: boolean) => dispatch({ type: REDUX_ACTIONS.CURRENCY_DROPDOWN_STATUS_TOGGLE, payload: status })
  }
}

export const App = connect(storeToProps, dispatchToProps)(AppComponent)
