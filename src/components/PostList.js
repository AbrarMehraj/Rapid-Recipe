import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import Post from "./Post";
import Filter from "./Filter";
import { db } from "./firebase";
import Spinner from "./Spinner";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState([]);
  // const [term, setTerm] = useState("");

  // const searching = posts?.filter((item) =>
  //   item.post.type.toLowerCase().includes(term.toLocaleLowerCase())
  // );

  // console.log(searching);

  useEffect(() => {
    const unsubs = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // calling use State
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => {
      unsubs();
    };
  }, [setPosts]);

  const getType = (value) => {
    const filter = posts.filter(({ post }) => post.type === value);
    setFilter(filter);
  };

  const renderList = () => {
    if (filter.length > 0) {
      return (
        <Grid container spacing={4} justify="center">
          {posts ? <div></div> : <Spinner />}
          {filter.map(({ id, post }) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Post id={id} post={post} />
              </Grid>
            );
          })}
        </Grid>
      );
    }

    // console.log(posts);
    // const searchQuery = (e) => {
    //   e.preventDefault();
    //   const searchQuery = posts.filter(({ post }) => (post.title = query));
    //   console.log("search query", searchQuery);
    // };

    return (
      <Grid container spacing={4} justify="center">
        {posts ? <div></div> : <Spinner />}
        {posts.map(({ id, post }) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Post id={id} post={post} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderCondition = () => {
    if (filter.length > 0) {
      return (
        <div>
          <center>
            {filter.length} {filter[0].post.type} Posts
          </center>
          {renderList()}
        </div>
      );
    }

    return renderList();
  };

  return (
    <Container>
      <Filter getType={getType} />
      {/* <input
        type="text"
        placeholder="search"
        onChange={(e) => setTerm(e.target.value)}
        value={term}
      /> */}
      {renderCondition()}
    </Container>
  );
};

export default PostList;
