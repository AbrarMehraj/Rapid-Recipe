import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ children, ...rest }) => {
  const userInfo = useSelector((state) => state.userInfo);
  const isAdmin = userInfo && userInfo.uid === 'Tj1Fu400buSxKyvsl32ES2nya003';
  return isAdmin ? <Route {...rest} /> : <Redirect to='/' />;
};

export default ProtectedRoute;
