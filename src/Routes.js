import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {

  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  MyWorkspace as MyWorkspaceView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Goals as GoalsView,
  Objectives as ObjectivesView,
  MyObjectives as MyObjectivesView,
} from './views';

export const Routes = () => {
  return (
    <Switch>
      
      
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={MyWorkspaceView}
        exact
        layout={MainLayout}
        path="/my-workspace"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <RouteWithLayout
        component={GoalsView}
        exact
        layout={MainLayout}
        path="/goals/:id"
      />
      <RouteWithLayout
        component={ObjectivesView}
        exact
        layout={MainLayout}
        path="/objectives/:id?"
      />
      <RouteWithLayout
        component={MyObjectivesView}
        exact
        layout={MainLayout}
        path="/my-objectives"
      />
      <Redirect
        exact
        from="/"
        to="/my-workspace"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};


export default Routes;
