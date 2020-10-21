/** @format */

export const posts = (state = [], action) => {
  switch (action.type) {
    case "POSTS":
      return action.posts;
    default:
      return state;
  }
};

// export const postComments = (state = [], action) => {
//   switch (action.type) {
//     case "COMMENTS":
//       return action.comments;
//     default:
//       return state;
//   }
// };

export const User = (state = {}, action) => {
  switch (action.type) {
    case "SET__USER":
      return action.user;
    default:
      return state;
  }
};
