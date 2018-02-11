import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './css/App.css';

import Login from './Login';
import Register from './Register';

class App extends Component {
    state = {
        validSession: false
    }

    componentDidMount = async () => {
        const res = await fetch('/api/v1/internal/valid/session', {
            method: 'POST',
            // https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie
            // credentials: 'same-origin',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await res.json();

        if (json.ok && json.ok === 1) {
            window.location = 'http://localhost:4000';
            // console.log('validSession');
            // this.setState({'validSession': true});
            //
        }
    };

    render() {
        console.log(this.state.validSession);
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

// <Route
//     exact path = "/"
//     render = {() => (
//         <Redirect to = "/login" />
//     )}
// />
