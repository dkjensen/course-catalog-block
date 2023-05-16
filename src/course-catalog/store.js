import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';

const STORE_NAME = 'bce/products';

const DEFAULT_STATE = {
    products: []
};

const actions = {
    setProducts(products) {
        return {
            type: 'SET_PRODUCTS',
            products
        };
    },
    getProducts(path) {
        return {
            type: 'GET_PRODUCTS',
            path
        };
    },
    fetchFromAPI(path) {
        return {
            type: 'FETCH_FROM_API',
            path,
        };
    },
};

const store = createReduxStore( STORE_NAME, {
    reducer(state = DEFAULT_STATE, action) {
        switch (action.type) {
            case 'SET_PRODUCTS':
                return {
                    ...state,
                    products: action.products,
                  };

            default: {
                return state;
            }
        }
    },

    actions,

    selectors: {
        getProducts(state) {
            const { products } = state;

            return products;
        },
    },

    controls: {
        FETCH_FROM_API(action) {
            return apiFetch({ path: action.path });
        },
    },

    resolvers: {
        *getProducts(item) {
            const path = '/bce/v1/products/';
            const products = yield actions.fetchFromAPI(path);
            return actions.setProducts(products);
        },
    },
});

register(store);

export { STORE_NAME };