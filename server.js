const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');

// load env vars
dotenv.config({ path: './config/config.env' });

// load express
const app = express();

// load routers 
app.use('/api/v1/bootcamp', bootcamp);

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} with ${ENV} enviroment`);
});