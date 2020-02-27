import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import { AuthContext } from "Auth";
import { SignIn } from '../../views';
const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  const {currentUser} = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={matchProps => (
        !!currentUser ? (
        <Layout>
          <Component {...matchProps} />
        </Layout>
        ) : (
          <Redirect to="sign-in" />
        )
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
