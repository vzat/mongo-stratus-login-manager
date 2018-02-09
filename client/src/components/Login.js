import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './css/Login.css';

import { Button, Grid, Segment, Form, Input } from 'semantic-ui-react'

class Login extends Component {
    componentDidMount = () => {
        document.title = "Login";
    };

    goToRegisterPage = () => {
        const { history } = this.props;
        history.push("/register");
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
                                  <Input icon = 'user' iconPosition = 'left' placeholder = 'Username' />
                              </Form.Field>
                              <Form.Field>
                                  <Input icon = 'lock' iconPosition = 'left' placeholder = 'Password' type = 'password' />
                              </Form.Field>
                              <Button color = 'green'> Login </Button>
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
