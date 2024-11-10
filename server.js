const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const port = 5000;

require('dotenv').config();
require('./conifg/db.js')();
require('./conifg/image_upload.js');

app.use(express.json());

app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/'));

app.use((req, res, next) =>
{
    console.log(Date.now())
    next();
});

app.use((req, res, next) => 
{
    let authHeader = req.headers.authorization?.split(' ');
    console.log(authHeader);

    if (req.headers?.authorization && authHeader[0] == 'Bearer')
    {
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

app.use('/api/workers', require('./routes/workers.js'));
app.use('/api/minerals', require('./routes/minerals.js'));
app.use('/api/companies', require('./routes/companies.js'));
app.use('/api/mines', require('./routes/mines.js'));
//app.use('/api/work_hours', require('./routes/work_hours.js'));
//app.use('/api/mines', require('./routes/mines.js'));

app.listen(port, () =>
{
    console.log(`Example port = ${port}`);
});