import { AnyAction, combineReducers, createStore, Reducer, ReducersMapObject } from "redux";
// import { configureStore } from '@reduxjs/toolkit'
import { StoreModel } from "./storeModel";
import { reducer as OrdersReducer } from './orders/reducer';
import { reducer as ActiceCurrencyReducer } from './active-currency/reducer';
import { reducer as ActiceCategoryReducer } from './active-category/reducer';
import { reducer as AllCategoriesReducer } from './all-categories/reducer';
import { reducer as CurrencyDropdownStatusReducer } from './currency-dropdown-status/reducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const reducers: ReducersMapObject<StoreModel, AnyAction> = {
    orders: OrdersReducer as Reducer<StoreModel['orders'], AnyAction>,
    activeCurrency: ActiceCurrencyReducer as Reducer<StoreModel['activeCurrency'], AnyAction>,
    activeCategory: ActiceCategoryReducer as Reducer<StoreModel['activeCategory'], AnyAction>,
    allCategories: AllCategoriesReducer as Reducer<StoreModel['allCategories'], AnyAction>,
    currencyDropdownStatus: CurrencyDropdownStatusReducer as Reducer<StoreModel['currencyDropdownStatus'], AnyAction>,
}

const combinedReducers = combineReducers(reducers);

const persistConfig = {
    key: 'root',
    storage
};

const persistedCombinedReducers = persistReducer(persistConfig, combinedReducers);

export const store = createStore(persistedCombinedReducers);
// export const store = configureStore({ reducer: persistedCombinedReducers });

export const persistedStore = persistStore(store);