import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './css/App.css';

import Login from './Login';
import Register from './Register';

class App extends Component {
  render() {
    return (
      <Router>
          <div className="App">
              <Route
                  exact path = "/"
                  render = {() => (
                      <Redirect to = "/login" />
                  )}
              />
              <Route
                  path = "/login"
                  component = {Login}
              />
              <Route
                  path = "/register"
                  component = {Register}
              />
          </div>
      </Router>
    );
  }
}

export default App;
