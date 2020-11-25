/** @format */

import { combineReducers } from 'redux';
import {
  commentListReducer,
  postListReducer,
  userDetailsReducer,
} from './rootReducer';

export default combineReducers({
  postList: postListReducer,
  userInfo: userDetailsReducer,
  commentList: commentListReducer,
});
