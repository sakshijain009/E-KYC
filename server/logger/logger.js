const winston = require('winston');
require('winston-mongodb');
const MESSAGE = Symbol.for('message');

const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry)
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
}
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format(jsonFormatter)(),
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: 'logger/error.log',
        }),
        new winston.transports.File({
            level: 'info',
            filename: 'logger/event.log',
        }),
        new winston.transports.MongoDB({
            level: 'info',
            db: process.env.ATLAS_URI,
            collection: 'log'
        })
    ],
    colorize: true,
    handleExceptions: true,
    exitOnError: false
});

module.exports = logger;