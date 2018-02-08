import React, { Component } from 'react';

import './css/App.css';

import Login from './Login';
import Register from './Register';

class App extends Component {
  state = {
      login: 1
  }

  setLogin = (value) => {
      this.setState({login: value});
  };

  render() {
    const loginPage = this.state.login;

    console.log(this.state);

    return (
      <div className="App">
          {loginPage ?
              <Login setLogin = {this.setLogin} />
              :
              <Register setLogin = {this.setLogin} />
          }
      </div>
    );
  }
}

export default App;
