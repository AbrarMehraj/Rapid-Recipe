/** @format */

import {
  GET_COMMENT_LIST,
  GET_LIKE_LIST,
  GET_POST_LIST,
  SET_USER,
} from '../types/Types';

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

export const setCommentList = (comments) => {
  return {
    type: GET_COMMENT_LIST,
    payload: comments,
  };
};

export const setLikeList = (likes) => {
  return {
    type: GET_LIKE_LIST,
    payload: likes,
  };
};
