import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './css/Register.css';

import { Button, Grid, Segment, Form, Input, Message } from 'semantic-ui-react'

import utils from '../utils';

class Register extends Component {
    state = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        invalidEmail: false,
        invalidUsername: false,
        invalidPassword: false,
        loading: false
    };

    componentDidMount = () => {
        document.title = "Register";
    };

    goToLoginPage = () => {
        const { history } = this.props;
        history.push("/login");
    };

    handleRegister = async () => {
        const email = this.state.email;
        const username = this.state.username;
        const password = this.state.password;
        const confirmPassword = this.state.confirmPassword;

        let invalidFields = false;

        if (!email || email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            this.setState({'invalidEmail': true});
            invalidFields = true;
        }

        if (!password || !confirmPassword || password === '' || confirmPassword === '' || password !== confirmPassword) {
            this.setState({'invalidPassword': true});
            invalidFields = true;
        }

        // TODO: Check if username is unique
        if (!username || username === '') {
            this.setState({'invalidUsername': true});
            invalidFields = true;
        }

        if (invalidFields) {
            return;
        }

        this.setState({loading: true});

        const res = await fetch('/api/v1/internal/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'email': email,
              'username': username,
              'password': password
            })
        });

        const json = await res.json();

        if (json.ok && json.ok == 1) {
            window.location = "http://localhost:4000/";
        }
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value});
        this.setState({ ['invalid' + utils.toProperCase(event.target.name)]: false});
    };

    render() {
        return (
          <div className = 'Register'>
              <Grid centered verticalAlign = 'middle'>
                  <Grid.Column>
                      <h2 className = 'register-header'> MongoStratus </h2>
                      <Segment raised>
                          <Form onSubmit = {this.handleRegister} loading = {this.state.loading} >
                              <Form.Field>
                                  <Form.Input
                                      required
                                      icon = 'at'
                                      iconPosition = 'left'
                                      placeholder = 'Email'
                                      name = 'email'
                                      onChange = {this.handleChange}
                                      error = {this.state.invalidEmail}
                                  />
                                  {this.state.invalidEmail &&
                                      <Message negative >
                                          <Message.Header> Invalid email </Message.Header>
                                          Please enter a valid email address
                                      </Message>
                                  }
                              </Form.Field>
                              <Form.Field>
                                  <Form.Input
                                      required
                                      icon = 'user'
                                      iconPosition = 'left'
                                      placeholder = 'Username'
                                      name = 'username'
                                      onChange = {this.handleChange}
                                      error = {this.state.invalidUsername}
                                  />
                                  {this.state.invalidUsername &&
                                      <Message negative >
                                          <Message.Header> Duplicate username </Message.Header>
                                          The username has already been taken
                                      </Message>
                                  }
                              </Form.Field>
                              <Form.Field>
                                  <Form.Input
                                      required
                                      icon = 'lock'
                                      iconPosition = 'left'
                                      placeholder = 'Password'
                                      type = 'password'
                                      name = 'password'
                                      onChange = {this.handleChange}
                                      error = {this.state.invalidPassword}
                                  />
                              </Form.Field>
                              <Form.Field>
                                  <Form.Input
                                      required
                                      icon = 'lock'
                                      iconPosition = 'left'
                                      placeholder = 'Confirm Password'
                                      type = 'password'
                                      name = 'confirmPassword'
                                      onChange = {this.handleChange}
                                      error = {this.state.invalidPassword}
                                  />
                                  {this.state.invalidPassword &&
                                      <Message negative >
                                          <Message.Header> Password mismatch </Message.Header>
                                          The passwords do not match
                                      </Message>
                                  }
                              </Form.Field>
                              <Form.Field>
                                  <Form.Button color = 'green'> Register </Form.Button>
                              </Form.Field>
                              <p> Already have an account? <a href = '' onClick = {this.goToLoginPage}> Login </a> </p>
                          </Form>
                      </Segment>
                  </Grid.Column>
              </Grid>
          </div>
        );
    }
}

export default withRouter(Register);
