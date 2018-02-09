import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './css/Register.css';

import { Button, Grid, Segment, Form, Input } from 'semantic-ui-react'

class Register extends Component {
    componentDidMount = () => {
        document.title = "Register";
    };

    goToLoginPage = () => {
        const { history } = this.props;
        history.push("/login");
    };

    render() {
        return (
          <div className = 'Register'>
              <Grid centered verticalAlign = 'middle'>
                  <Grid.Column>
                      <h2 className = 'register-header'> MongoStratus </h2>
                      <Segment raised>
                          <Form>
                              <Form.Field>
                                  <Input icon = 'at' iconPosition = 'left' placeholder = 'Email' />
                              </Form.Field>
                              <Form.Field>
                                  <Input icon = 'user' iconPosition = 'left' placeholder = 'Username' />
                              </Form.Field>
                              <Form.Field>
                                  <Input icon = 'lock' iconPosition = 'left' placeholder = 'Password' type = 'password' />
                              </Form.Field>
                              <Form.Field>
                                  <Input icon = 'lock' iconPosition = 'left' placeholder = 'Confirm Password' type = 'password' />
                              </Form.Field>
                              <Button color = 'green'> Register </Button>
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
