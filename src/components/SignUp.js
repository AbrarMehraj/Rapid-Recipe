/** @format */

import React from "react";
import { Button } from "@material-ui/core";
import { useState } from "react";
import { auth } from "./firebase";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setUser } from "../actions";
import { CenterFocusStrong } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const SignUp = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .then(() => history.push("/"))
      .catch((error) => alert(error.message));
  };

  const isDisabled = () => {
    if (username && email && password.length > 6) return false;
    return true;
  };

  return (
    <div className="signin--wrapper">
      <div className="signin">
        <div className="signin--form">
          <div className="title">Rapid</div>
          <form className={classes.root} noValidate autoComplete="off">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // error
                id="standard-error"
                label="Username"
                type="text"
                variant="outlined"
                style={{ width: "100%" }}

                // defaultValue="Hello World"
              />
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // error
                id="standard-error"
                label="Email"
                type="email"
                variant="outlined"
                style={{ width: "100%" }}

                // defaultValue="Hello World"
              />
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // error
                id="standard-error-helper-text"
                label="Password"
                type="password"
                variant="outlined"
                style={{ width: "100%" }}
                // defaultValue="Hello World"
                // helperText="Incorrect entry."
              />
              <Button
                style={{ alignSelf: "stretch", margin: "1rem 0" }}
                variant="contained"
                color="primary"
                onClick={signUp}
                disabled={isDisabled()}
              >
                Sign up
              </Button>
            </div>
          </form>
          <center>OR</center>
          <div className="create">
            Already have an account?
            <Link
              to="/"
              style={{
                textDecoration: "none",
                marginLeft: "5px",
                color: "blue",
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};

export default connect(mapStateToProps, { setUser })(SignUp);
