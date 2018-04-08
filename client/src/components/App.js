import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './css/App.css';

import Login from './Login';
import Register from './Register';

class App extends Component {
    componentDidMount = async () => {
        const res = await fetch('/api/v1/internal/login-manager/valid/session', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await res.json();

        if (json.ok && json.ok === 1) {
            window.location = '/';
        }
    };

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
