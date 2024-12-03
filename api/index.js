//links to the severs need modules
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();

// chooses the port
const port = 5000;

//connects to the severs required files
require('dotenv').config();
require('../conifg/db.js')();
require('../conifg/image_upload.js');

//sets up the apps type
app.use(express.json());
app.set('view engine', 'html');

//sets up image view
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/'));

app.use((req, res, next) => 
{
    //grabs authorization
    let authHeader = req.headers.authorization?.split(' ');
    console.log(authHeader);

    //confirms authorization
    if (req.headers?.authorization && authHeader[0] == 'Bearer')
    {
        //verifies authorization
        jwt.verify(authHeader[1], process.env.JWT_SECRET, (err, decoded) => 
        {
            if (err)req.worker = undefined;
            req.worker = decoded;
            next();
        });
    }
    else
    {
        req.worker = undefined;
        next();
    }
});

//connects the routes
app.use('/api/workers', require('../routes/workers.js'));
app.use('/api/minerals', require('..companies.js'));
app.use('/api/companies', require('../routes/companies.js'));
app.use('/api/mines', require('../routes/mines.js'));
app.use('/api/work_hours', require('../routes/work_hours.js'));
app.use('/api/mineral_mines', require('../routes/mineral_mines.js'));

//logs the port
app.listen(port, () =>
{
    console.log(`Example port = ${port}`);
});