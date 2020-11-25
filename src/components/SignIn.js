/** @format */

import React from "react";
import { Button } from "@material-ui/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setUser } from "../actions";
import { auth } from "./firebase";
import Spinner from "./Spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const SignIn = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailBool, setEmailBool] = useState(false);
  const [passwordBool, setPasswordBool] = useState(false);
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    validate();
  };

  const validate = (e) => {
    let isError = false;
    if (!email) {
      setEmailError("Email is required*");
      setEmailBool(true);
    } else {
      setEmailError("");
      setEmailBool(false);
    }
    if (!password) {
      setPasswordError("Password is required*");
      setPasswordBool(true);
    } else {
      setPasswordError("");
      setPasswordBool(false);
    }

    if (email && password) {
      setEmailError("");
      setPasswordError("");
      isError = true;
    }

    return isError;
  };

  const isDisabled = () => {
    if (email && password.length > 5) return false;
    return true;
  };

  const logIn = (e) => {
    setLoading(true);
    const isValidate = validate();
    console.log(isValidate);
    if (isValidate) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("spinner");
          // return <Spinner />;
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error.message);
        });

      e.preventDefault();
      console.log(errorMessage);
    }
  };

  const loginSuccess = () => {
    if (loading) {
      return (
        <Button
          style={{ alignSelf: "stretch", margin: "1rem 0" }}
          variant="contained"
          color="primary"
        >
          <Spinner />
        </Button>
      );
    }

    return (
      <div onClick={logIn}>
        <Button
          style={{ alignSelf: "stretch", margin: "1rem 0", width: "235px" }}
          variant="contained"
          color="primary"
          disabled={isDisabled()}
        >
          Sign In
        </Button>
      </div>
    );
  };

  return (
    <div className="signin--wrapper">
      <div className="signin">
        <div className="signin--form">
          <div className="title">Rapid</div>
          <form className={classes.root} validate="true" autoComplete="off">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                name="email"
                value={email}
                error={emailBool}
                onChange={(e) => change(e)}
                id="standard-error"
                label="Email"
                type="email"
                variant="outlined"
                style={{ width: "100%" }}
                helperText={emailError}
                required
              />
              <TextField
                name="password"
                error={passwordBool}
                value={password}
                onChange={(e) => change(e)}
                id="standard-error-helper-text"
                label="Password"
                type="password"
                variant="outlined"
                style={{ width: "100%" }}
                required
                helperText={passwordError}
              />
              {/* showing and  error if there is  */}
              {errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
              ) : null}

              {loginSuccess()}
            </div>
          </form>
          <center>OR</center>
          <div className="create">
            Don't have an account?
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                marginLeft: "5px",
                color: "blue",
              }}
            >
              Sign up
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

export default connect(mapStateToProps, { setUser })(SignIn);

// 260130076
// Dinosauria12;
