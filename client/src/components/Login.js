import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './css/Login.css';

import { Button, Grid, Segment, Form, Input } from 'semantic-ui-react'

class Login extends Component {
    state = {
        username: '',
        password: ''
    };

    componentDidMount = () => {
        document.title = "Login";
    };

    goToRegisterPage = () => {
        const { history } = this.props;
        history.push("/register");
    };

    handleLogin = async () => {
        const username = this.state.username;
        const password = this.state.password;

        const res = await fetch('/api/v1/internal/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'username': username,
              'password': password
            })
        });

        const json = await res.json();

        console.log(json);
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        const registerText = 'Don\'t have an account?';

        return (
          <div className = 'Login'>
              <Grid centered verticalAlign = 'middle'>
                  <Grid.Column>
                      <h2 className = 'login-header'> MongoStratus </h2>
                      <Segment raised>
                          <Form>
                              <Form.Field>
                                  <Input
                                      icon = 'user'
                                      iconPosition = 'left'
                                      placeholder = 'Username'
                                      name = "username"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Field>
                              <Form.Field>
                                  <Input
                                      icon = 'lock'
                                      iconPosition = 'left'
                                      placeholder = 'Password'
                                      type = 'password'
                                      name = "password"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Field>
                              <Button color = 'green' onClick = {this.handleLogin}> Login </Button>
                              <p> {registerText} <a href = '' onClick = {this.goToRegisterPage}> Register </a> </p>
                          </Form>
                      </Segment>
                  </Grid.Column>
              </Grid>
          </div>
        );
    }
}

export default withRouter(Login);
