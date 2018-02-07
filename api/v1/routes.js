const crypto = require('crypto');

const express = require('express');
const request = require('request-promise');
const config = require('config');
const bcrypt = require('bcrypt');

const logger = require('../../lib/logger');

const routes = express.Router();

const protocol = 'http://';

routes.post('/login', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const username = req.body.username;
        const password = req.body.password;

        const dataRetriever = config.services['mongo-stratus-data-retriever'];

        const query = `query GetUserHashedPassword ($username: String) {
            getAccounts (query: {username: $username}) {
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

        logger.log('info', response);

        if (Object.keys(response) === 0 || Object.keys(response.data) === 0 || Object.keys(response.data.getAccounts) === 0) {
            throw new Error('No Data Received');
        }

        if (response.data.getAccounts.length !== 1) {
            res.end(JSON.stringify({'ok': 0}));
        }

        const hashedPassword = response.data.getAccounts[0].password;

        if (await bcrypt.compare(password, hashedPassword)) {
            res.end(JSON.stringify({'ok': 1}));
        }

        res.end(JSON.stringify({'ok': 0}));

        //
        // const query = `query GetMatchingAccounts ($username: String, $password: String) {
        //     getAccounts (query: {username: $username, password: $password}) {
        //         username
        //     }
        // }`;
        //
        // const options = {
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
        //             'password': password
        //         }
        //     })
        // };
        //
        // const response = await request.post(options);
        // const responseJSON = await JSON.parse(response);
        //
        // if (Object.keys(responseJSON) === 0 || Object.keys(responseJSON.data) === 0 || Object.keys(responseJSON.data.getAccounts) === 0) {
        //     throw new Error('No Data Received');
        // }
        //
        // const accounts = responseJSON.data.getAccounts;
        //
        // if (accounts.length === 1) {
        //     res.end(JSON.stringify({'ok': 1}));
        // }
        //
        // res.end(JSON.stringify({'ok': 0}));
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

        if (userCheckResponse.data.getAccounts.length !== 0) {
            res.end(JSON.stringify({'ok': 0, 'error': 'Duplicate Username'}));
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const token = await crypto.randomBytes(16).toString('hex');

        const mutation = `mutation RegisterUser ($username: String, $password: String, $email: String, $token: String) {
            insertAccounts (docs: {username: $username, password: $password, email: $email, token: $token}) {
                username
            }
        }`;

        options = {
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

        res.end(JSON.stringify({'ok': 0}));
    }
    catch (err) {
        logger.log('error', err);
        res.end(JSON.stringify({'error': err}));
    }
});

module.exports = routes;
