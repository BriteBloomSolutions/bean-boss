import * as ActionTypes from './ActionTypes';

export const locations = (state = { isLoading: true,
                                     errMess: null,
                                     locations: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CAMPSITES:
            return {...state, isLoading: false, errMess: null, locations: action.payload};

        case ActionTypes.CAMPSITES_LOADING:
            return {...state, isLoading: true, errMess: null, locations: []}

        case ActionTypes.CAMPSITES_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
          return state;
      }
};