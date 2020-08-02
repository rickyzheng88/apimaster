const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const course = require('./routes/course');
const morgan = require('morgan');
const conectdb = require('./config/db');
const errorHandler = require('./middleware/error');

// load env vars
dotenv.config({ path: './config/config.env' });

// load express
const app = express();

// Database connection
conectdb();

// middlewares
if (process.env.NODE_ENV === "develoment") {
    app.use(morgan('dev'));
}
app.use(express.json());

// load routers 
app.use('/api/v1/bootcamp', bootcamp);
app.use('/api/v1/courses', course);

// load error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} with ${ENV} enviroment`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // server.close() stop listening for http connection on the server (But keep all existing connections)
    // then process.exit() kill all the task such as running functions of the server inmediatly (stop all
    // existing connections)
    server.close(() => process.exit(1));
});