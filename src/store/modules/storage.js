import * as types from '../mutation-types';

const state = {
    storage: sessionStorage
};

const getters = {
    storage: state => {
        return state.storage
    }
};

export default {
    state,
    getters
};