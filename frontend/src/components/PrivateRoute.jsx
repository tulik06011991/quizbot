import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Tokenni saqlash uchun localStorage ishlatamiz

  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Agar token bo'lmasa login sahifasiga yo'naltiramiz
        )
      }
    />
  );
};

export default PrivateRoute;
