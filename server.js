const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const morgan = require('morgan');

// load env vars
dotenv.config({ path: './config/config.env' });

// load express
const app = express();

// middlewares
if (process.env.NODE_ENV === "develoment") {
    app.use(morgan('dev'));
}
// load routers 
app.use('/api/v1/bootcamp', bootcamp);

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} with ${ENV} enviroment`);
});