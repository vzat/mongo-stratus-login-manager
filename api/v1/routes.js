const crypto = require('crypto');

const express = require('express');
const request = require('request-promise');
const config = require('config');
const bcrypt = require('bcrypt');

const logger = require('../../lib/logger');

const routes = express.Router();

const protocol = 'http://';

async function duplicateUsername (username) {
    try {
        const dataRetriever = config.services['mongo-stratus-data-retriever'];

        // Check if the username is taken
        const query = `query CheckIfUsernameExists ($username: String) {
            getAccounts (query: {username: $username}) {
                username
            }
        }`;

        let options = {
            method: 'POST',
            uri: protocol + dataRetriever.ip + ':' + dataRetriever.port + '/api/v1/admin/mongoStratus',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (process.env.APIToken || 'z321')
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    'username': username,
                }
            })
        };

        const userCheckResponseJSON = await request.post(options);
        const userCheckResponse = await JSON.parse(userCheckResponseJSON);

        if (Object.keys(userCheckResponse) === 0 || Object.keys(userCheckResponse.data) === 0 || Object.keys(userCheckResponse.data.getAccounts) === 0) {
            throw new Error('No Data Received');
        }

        const accounts = userCheckResponse.data.getAccounts;

        // Check if the username is taken
        for (const accountNo in accounts) {
            const account = accounts[accountNo];
            console.log(account);
            if (account.username === username) {
                return true;
            }
        }
        return false;
    }
    catch (err) {
        logger.log('error', err);
        return true;
    }
}

routes.post('/login', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const username = req.body.username;
        const password = req.body.password;

        const dataRetriever = config.services['mongo-stratus-data-retriever'];

        const query = `query GetHashedPassword ($username: String) {
            getAccounts (query: {username: $username}) {
                username
                password
            }
        }`;

        const options = {
            method: 'POST',
            uri: protocol + dataRetriever.ip + ':' + dataRetriever.port + '/api/v1/admin/mongoStratus',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (process.env.APIToken || 'z321')
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    'username': username,
                }
            })
        };

        const responseJSON = await request.post(options);
        const response= await JSON.parse(responseJSON);

        if (Object.keys(response) === 0 || Object.keys(response.data) === 0 || Object.keys(response.data.getAccounts) === 0) {
            throw new Error('No Data Received');
        }

        let hashedPassword = null;
        for (const userNo in response.data.getAccounts) {
            const user = response.data.getAccounts[userNo];
            if (user.username === username) {
                hashedPassword = user.password;

                if (await bcrypt.compare(password, hashedPassword)) {
                    req.session.authenticated = true;
                    // res.status(301).redirect('https://google.com/');
                    // next();
                    res.end(JSON.stringify({'ok': 1}));
                }
                else {
                    res.end(JSON.stringify({'ok': 0}));
                }

                break;
            }
        }

        if (!hashedPassword) {
            res.end(JSON.stringify({'ok': 0}));
        }
    }
    catch (err) {
        logger.log('error', err);
        res.end(JSON.stringify({'error': err}));
    }
});

routes.post('/register', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        const dataRetriever = config.services['mongo-stratus-data-retriever'];

        // // Check if the username is taken
        // const query = `query CheckIfUsernameExists ($username: String) {
        //     getAccounts (query: {username: $username}) {
        //         username
        //     }
        // }`;
        //
        // let options = {
        //     method: 'POST',
        //     uri: protocol + dataRetriever.ip + ':' + dataRetriever.port + '/api/v1/admin/mongoStratus',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + (process.env.APIToken || 'z321')
        //     },
        //     body: JSON.stringify({
        //         query: query,
        //         variables: {
        //             'username': username,
        //         }
        //     })
        // };
        //
        // const userCheckResponseJSON = await request.post(options);
        // const userCheckResponse = await JSON.parse(userCheckResponseJSON);
        //
        // if (Object.keys(userCheckResponse) === 0 || Object.keys(userCheckResponse.data) === 0 || Object.keys(userCheckResponse.data.getAccounts) === 0) {
        //     throw new Error('No Data Received');
        // }
        //
        // if (userCheckResponse.data.getAccounts.length !== 0) {
        //     res.end(JSON.stringify({'ok': 0, 'error': 'Duplicate Username'}));
        //     throw new Error('Username is already taken');
        // }

        // Check duplicate username
        if (await duplicateUsername(username)) {
            res.end(JSON.stringify({'ok': 0, 'error': 'username'}));
            throw new Error('Username is already taken');
        }

        // Create User
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const token = await crypto.randomBytes(16).toString('hex');

        const mutation = `mutation RegisterUser ($username: String, $password: String, $email: String, $token: String) {
            insertAccounts (docs: {username: $username, password: $password, email: $email, token: $token}) {
                username
            }
        }`;

        const options = {
            method: 'POST',
            uri: protocol + dataRetriever.ip + ':' + dataRetriever.port + '/api/v1/admin/mongoStratus',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (process.env.APIToken || 'z321')
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    'username': username,
                    'password': hash,
                    'email': email,
                    'token': token
                }
            })
        };

        const response = await request.post(options);
        const responseJSON = await JSON.parse(response);

        if (Object.keys(responseJSON) === 0 || Object.keys(responseJSON.data) === 0 || Object.keys(responseJSON.data.insertAccounts) === 0) {
            throw new Error('No Data Received');
        }

        const accounts = responseJSON.data.insertAccounts;

        if (accounts.length === 1) {
            res.end(JSON.stringify({'ok': 1}));
        }

        res.end(JSON.stringify({'ok': 0, 'error': 'account'}));
    }
    catch (err) {
        logger.log('error', err);
        res.end(JSON.stringify({'error': err}));
    }
});

module.exports = routes;
