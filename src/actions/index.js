/** @format */

export const setPosts = (posts) => {
  return {
    type: "POSTS",
    posts,
  };
};

// export const postComments = (comments) => {
//   return {
//     type: "COMMENTS",
//     comments,
//   };
// };

export const setUser = (user) => {
  return {
    type: "SET__USER",
    user,
  };
};
