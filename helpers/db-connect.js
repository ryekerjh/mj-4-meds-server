export function dbConnect (app) {
const mongoose = require('mongoose');
require('dotenv').config();

    mongoose.connect(process.env.DBURL, {
        server: {
            poolSize: 5,
            auto_reconnect: true,
            socketOptions: {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0
            }
        },
    });
    mongoose.connection.on('connected',() => {
        console.log('db connection established');
    })
    return app;
}