/** @format */

import { combineReducers } from "redux";
import { posts } from "./rootReducer";
import { User } from "./rootReducer";

export default combineReducers({
  posts,
  User,
});
