import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import SignUp from './components/SignUp';
const App = () => {
  return (
    <div>
      <Router>
        <Route path='/' exact component={Home} />
        <Route path='/account/profile' exact>
          <center>Profile</center>
        </Route>
        p
        <Route path='/signup' exact component={SignUp} />
      </Router>
    </div>
  );
};

export default App;
