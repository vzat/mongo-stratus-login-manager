const express = require('express');
const request = require('request-promise');
const config = require('config');

const logger = require('../../lib/logger');

const routes = express.Router();

const protocol = 'http://';

routes.post('/login', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const username = req.body.username;
        const password = req.body.password;

        const dataRetriever = config.services['mongo-stratus-data-retriever'];

        const query = `query {
            getAccounts {
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
            body: JSON.stringify({query: query})
        };

        const response = await request.post(options);
        const responseJSON = await JSON.parse(response);
        res.end(JSON.stringify(responseJSON.data));
    }
    catch (err) {
        logger.log('error', err);
        res.end(err);
    }
});

module.exports = routes;
