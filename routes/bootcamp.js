const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200);
    res.json({ 
        success: true,
        msg: "Getting Bootcamp api"
    });
})

router.post('/', (req, res) => {
    res.status(201);
    res.json({ 
        success: true,
        msg: "Posting Bootcamp api, new data created"
    });
})

router.put('/:id', (req, res) => {
    res.status(200);
    res.json({ 
        success: true,
        msg: `updating bootcamp api data, data: ${req.params.id}`
    });
})

router.delete('/', (req, res) => {
    res.status(200);
    res.json({ 
        success: true,
        msg: "Deleting bootcamp api data"
    });
})

module.exports = router;