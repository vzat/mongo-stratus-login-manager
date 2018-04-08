const express = require('express');
// const session = require('express-session');
const session = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let app = express();

const logger = require('../lib/logger');
const routes = require('../api/v1/routes');

module.exports = new Promise((resolve, reject) => {
    app.set('port', process.env.PORT || 3000);
    app.use(cors());
    app.use(bodyParser.json());
    app.use(session({
        name: 'session',
        secret: 'MongoStratus'
    }));
    app.use(morgan('combined'));

    app.use('/api/v1/internal', routes);

    const listen = app.listen(app.get('port'), function () {
        logger.log('info', 'Login Manager Server running on port ' + app.get('port'));
    });

    listen.on('error', (err) => {
        logger.log('error', err);
        reject(err);
    });

    resolve(app);
});
