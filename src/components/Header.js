import React from "react";
import { Avatar, Button, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import { auth } from "./firebase";

const Header = () => {
  return (
    <Container
      style={{
        position: "sticky",
        top: "0",
        zIndex: "10",
        background: "repeating-linear-gradient(-45deg, #f44336, #6085d3 100px)",
      }}
    >
      <center>
        <strong>Under Development</strong>
      </center>
      <nav className="navbar">
        <Link to="" className="navbar--title">
          Rapid
        </Link>
        <div className="navbar--right">
          <div className="navbar--user">
            <Avatar alt="A" src="/static/images/avatar/1.jpg" />
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => auth.signOut()}
          >
            Sign Out
          </Button>
        </div>
      </nav>
    </Container>
  );
};

export default Header;
