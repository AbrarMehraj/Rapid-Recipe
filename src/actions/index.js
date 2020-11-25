/** @format */

import { GET_POST_LIST, SET_USER } from '../types/Types';

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
