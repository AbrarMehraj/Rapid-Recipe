import React, { useEffect } from "react";
import Header from "./Header";
import PostList from "./PostList";
import SignIn from "./SignIn";
import { connect } from "react-redux";
import { setUser } from "../actions";
import { auth } from "./firebase";
import Upload from "./Upload";

const Home = ({ setUser, user }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions need to look again on useEffect
      unsubscribe();
    };
  }, [setUser]);

  const renderCondition = () => {
    if (user) {
      return (
        <>
          <Header />
          <PostList />
          <Upload />
        </>
      );
    }
    return <SignIn />;
  };
  return <div>{renderCondition()}</div>;
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};

export default connect(mapStateToProps, { setUser })(Home);
