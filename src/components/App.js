import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import SignUp from "./SignUp";
import Upload from "./Upload";
const App = () => {
  return (
    <div>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/upload" exact>
          <Header />
          <Upload />
        </Route>
      </Router>
    </div>
  );
};

export default App;
