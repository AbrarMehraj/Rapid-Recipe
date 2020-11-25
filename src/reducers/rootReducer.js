import { GET_COMMENT_LIST, GET_POST_LIST, SET_USER } from '../types/Types';

export const postListReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_POST_LIST:
      return { posts: action.payload };

    default:
      return state;
  }
};

export const userDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;

    default:
      return state;
  }
};

export const commentListReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_COMMENT_LIST:
      return action.payload;

    default:
      return state;
  }
};
