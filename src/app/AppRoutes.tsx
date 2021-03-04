import React from 'react';

import { Switch } from 'react-router-dom';

import { Route } from './routing';
import { ROUTES } from './routing/routes';

export const AppRoutes = () => (
  <Switch>
    {Object.values(ROUTES).map((route, index) => (
      <Route key={index} {...route} />
    ))}
  </Switch>
);
