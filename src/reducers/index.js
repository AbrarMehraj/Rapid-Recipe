/** @format */

import { combineReducers } from 'redux';
import {
  postListReducer,
  queryReducer,
  userDetailsReducer,
} from './rootReducer';

export default combineReducers({
  postList: postListReducer,
  userInfo: userDetailsReducer,
  query: queryReducer,
});
