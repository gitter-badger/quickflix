import { createAction, handleActions } from 'redux-actions';
import hdviet from '../utils/hdviet';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = 'SEARCH:REQUEST_MOVIES';
export const CLEAR_RESULTS = 'SEARCH:CLEAR_RESULTS';
export const RECEIVE_MOVIES = 'SEARCH:RECEIVE_MOVIES';
export const RECEIVE_ERRORS = 'SEARCH:RECEIVE_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = createAction(REQUEST_MOVIES, keyword => ({ keyword }));
export const clearResults = createAction(CLEAR_RESULTS);
export const receiveMovies = createAction(RECEIVE_MOVIES, (movies) => ({ movies }));
export const receiveErrors = createAction(RECEIVE_ERRORS, (message) => ({ message }));

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function searchMovies(keyword) {
  return (dispatch, getState) => {
    if (getState().search.isFetching) {
      return;
    }
    if (getState().search.keyword !== keyword) {
      dispatch(clearResults());
    }
    if (!getState().auth.isAuthenticated) {
      // should dispatch an action that ask user to login
      return;
    }
    const creds = getState().auth.creds;
    // after dispatching `clearResults()` we got new state
    const page = getState().search.page + 1;
    dispatch(requestMovies(keyword));
    hdviet.search(keyword, { accessToken: creds.access_token, page })
      .then(data => {
        return data.docs.map((item) => {
          return {
            id: +item.id,
            name: {
              en: item.mo_name,
              vi: item.mo_known_as,
            },
            releaseDate: item.mo_release_date,
            plot: {
              vi: item.mo_plot_vi,
              en: item.mo_plot_en,
            },
            director: item.mo_director,
            imdbRating: item.mo_imdb_rating,
            poster: `http://t.hdviet.com/thumbs/124x184/${item.mo_new_poster}`,
            backdrop: `http://t.hdviet.com/backdrops/945x530/${item.mo_backdrop}`,
          };
        });
      })
      .then(movies => {
        dispatch(receiveMovies(movies));
      })
      .catch(error => {
        dispatch(receiveErrors(error.message));
      });
  };
}

export const actions = {
  searchMovies,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_MOVIES]: (state, { payload }) => ({ ...state, ...payload, isFetching: true }),
  [CLEAR_RESULTS]: (state) => ({ ...state, isFetching: false, movies: [], page: 0 }),
  [RECEIVE_MOVIES]: (state, { payload }) => {
    const movies = [];
    movies.push(...state.movies);
    movies.push(...payload.movies);
    return {
      ...state,
      page: state.page + 1,
      movies,
      isFetching: false,
      error: false,
      errorMessage: '',
    };
  },
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    error: true,
    errorMessage: payload.message,
  }),
}, {
  keyword: '',
  error: false,
  errorMessage: '',
  isFetching: false,
  page: 0,
  limit: 20,
  movies: [],
});
