import React, { Fragment } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { Home } from './containers/home';

function App() {
  return (
    <Fragment>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Home} />
          <Route path="/home" component={Home} />
          <Route exact path="/" component={Home} />
          <Redirect to={'/home'} />
        </Switch>
      </HashRouter>
    </Fragment>
  );
}

export default App;
