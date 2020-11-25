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
        <div>
          <Link to="" className="navbar--title">
            Rapid
          </Link>
        </div>

        <div className="navbar__search">
          <input type="text" className="navbar__searchInput" />
        </div>

        <div className="navbar--right">
          <div className="navbar--user">
            <Link to="account/profile">
              <Avatar alt="A" src="/static/images/avatar/1.jpg" />
            </Link>
          </div>
          <div onClick={() => auth.signOut()}>
            <Button variant="contained" color="secondary">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
    </Container>
  );
};

export default Header;
