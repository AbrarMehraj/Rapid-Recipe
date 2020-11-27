/** @format */

import { GET_POST_LIST, QUERY, SET_USER } from '../types/Types';

export const getPostList = (posts) => {
  return {
    type: GET_POST_LIST,
    payload: posts,
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const setTerm = (query) => {
  return {
    type: QUERY,
    payload: query,
  };
};
