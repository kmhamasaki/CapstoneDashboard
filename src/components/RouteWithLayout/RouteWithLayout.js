import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import { SignIn } from '../../views';
import {authenticated} from '../../App'
const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        !authenticated ? (
          <Redirect to="sign-in" />
        ) :
        <Layout>
          <Component {...matchProps} />
        </Layout>
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
