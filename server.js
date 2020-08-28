const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const course = require('./routes/course');
const auth = require('./routes/auth');
const users = require('./routes/users');
const morgan = require('morgan');
const conectdb = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload')

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
// using express fileupload middleware
app.use(fileupload());

// set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// load routers 
app.use('/api/v1/bootcamp', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);

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
    // then process.exit() kill inmediatly all the task such as running functions of the server (stop all
    // existing connections)
    server.close(() => process.exit(1));
});