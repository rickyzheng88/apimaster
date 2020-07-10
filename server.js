const express = require('express');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// load express
const app = express();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

app.get('/todo', (req, res) => {
    res.json({ success: true });
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} with ${ENV} enviroment`);
});