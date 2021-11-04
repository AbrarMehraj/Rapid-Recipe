/** @format */

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './bootstrap.min.css';
import { Container } from 'react-bootstrap';
// import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PostScreen from './screens/PostScreen';
import ProfileScreen from './screens/ProfileScreen';
import ForgetScreen from './screens/ForgetScreen';
import PostListScreen from './screens/PostListScreen';
import CreateOrderScreen from './screens/CreateOrderScreen';
import ProtectedRoute from './components/ProtectedRoute';
import OrdersScreen from './screens/OrdersScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' exact component={HomeScreen} />
          <Route path='/login' exact component={LoginScreen} />
          <Route path='/forgetpassword' exact component={ForgetScreen} />
          <Route path='/register' exact component={RegisterScreen} />
          <Route path='/post/:id' exact component={PostScreen} />
          <Route path='/profile' exact component={ProfileScreen} />
          <Route path='/admin/orders' exact component={OrdersScreen} />
          <ProtectedRoute
            path='/admin/postlist'
            exact
            component={PostListScreen}
          />
          <ProtectedRoute
            path='/admin/createorder'
            exact
            component={CreateOrderScreen}
          />

          <ProtectedRoute
            path='/admin/createorder/edit/:id'
            exact
            component={CreateOrderScreen}
          />
          {/* <Route path='/*' exact component={() => <div>Page Not Found</div>} /> */}
        </Container>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
