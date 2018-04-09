import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './css/Login.css';

import { Grid, Segment, Form, Message, Image } from 'semantic-ui-react'

import logo from './resources/images/MongoStratusLogo.svg';

class Login extends Component {
    state = {
        username: '',
        password: '',
        redirect: false,
        loading: false,
        invalidFields: false
    };

    componentDidMount = () => {
        document.title = "Login";
    };

    goToRegisterPage = () => {
        const { history } = this.props;
        history.push("/register");
    };

    handleLogin = async () => {
        this.setState({'invalidFields': false});
        this.setState({'loading': true});

        const username = this.state.username;
        const password = this.state.password;

        const res = await fetch('/api/v1/internal/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'username': username,
              'password': password
            })
        });

        const json = await res.json();

        if (json.ok && json.ok === 1) {
            window.location = 'http://connection.mongostratus.me/';
        }
        else {
            this.setState({'invalidFields': true});
            this.setState({'loading': false});
        }
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
                      <Image src = {logo} size = 'small' />
                      <Segment raised>
                          <Form onSubmit = {this.handleLogin} loading = {this.state.loading} >
                              <Form.Field>
                                  <Form.Input
                                      icon = 'user'
                                      iconPosition = 'left'
                                      placeholder = 'Username'
                                      name = "username"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Field>
                              <Form.Field>
                                  <Form.Input
                                      icon = 'lock'
                                      iconPosition = 'left'
                                      placeholder = 'Password'
                                      type = 'password'
                                      name = "password"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Field>
                              {this.state.invalidFields &&
                                  <Message negative >
                                      <Message.Header> Invalid fields </Message.Header>
                                      The username or password is invalid
                                  </Message>
                              }
                              <Form.Button color = 'green'> Login </Form.Button>
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
