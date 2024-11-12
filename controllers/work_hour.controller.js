const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Work_hour = require('../models/work_hour.model');
const Worker = require('../models/worker.model');
const Mine = require('../models/mine.model');

const readData = (req, res) => {
    Work_hour.find()
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).json(data);
            }
            else{
                res.status(404).json("None found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

const readAll = (req, res) =>
{
    Work_hour.find().then(data =>
    {
        console.log(data);
    
        if (data.length > 0)
        {
            return res.status(200).json(data);
        }
        else
        {
            return res.status(404).json('None found');
        }
    }
    ).catch(err =>
    {
        return res.status(500).json(err);
    });
};

const readOne = (req, res) => {

    let id = req.params.id;

    Work_hour.findById(id)
        .then((data) => {

            if(data)
            {
                res.status(200).json(data);
            }
            else 
            {
                res.status(404).json({
                    "message": `Work_hour with id: ${id} not found`
                });
            }
            
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                res.status(500).json(err)
            }
            
        });
};

const createData = (req, res) =>
{
    let body = req.body;

    Worker.findOne({email: req.body.worker_email})
    .then(worker => 
    {
        if (!worker)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    Mine.findOne({_id: req.body.mine_id})
    .then(mine => 
    {
        if (!mine)
        {
            return res.status(422).json(
            {
                message: "Not a mine",
            });
        }
    })
    .then(Work_hour.create(body).then(data =>
    {    
        return res.status(201).json
        ({
            message: "Work_hour created",
            data
        });
    })
    ).catch(err =>
    {   
        if (err.name === 'ValidationError')
        {
            return res.status(422).json(err);
        }
    
        return res.status(500).json(err);
    });
};

const updateData = (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Worker.findOne({email: req.body.worker_email})
    .then(worker => 
    {
        if (!worker)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    Mine.findOne({_id: req.body.mine_id})
    .then(mine => 
    {
        if (!mine)
        {
            return res.status(422).json(
            {
                message: "Not a mine",
            });
        }
    })
    .then(Work_hour.findByIdAndUpdate(id, body, {
        new: true
    })
    .then((data) => {
        if(data)
        {
            if (req.file)
            {
                deleteImage(data.filename)
            }
            
            res.status(201).json(data);
        }
        else 
        {
            res.status(404).json(
            {
                "message": `Work_hour with id: ${id} not found`
            });
        }        
        }))
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            }
            else if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

const deleteData = (req, res) => {

    let id = req.params.id;

    Work_hour.findById(id)
    .then(data =>
    {
        if (data)
        {
            return data.deleteOne();
        }
        else
        {
            res.status(404).json({
                "message": `Work_hour with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        res.status(200).json({
            "message": `Work_hour with id: ${id} deleted successfully`
        });
    })
    .catch((err) => {
        console.error(err);
        if(err.name === 'CastError') {
            res.status(400).json({
                "message": `Bad request, ${id} is not a valid id`
            });
        }
        else {
            res.status(500).json(err)
        } 
    }); 
};

module.exports = 
{
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
};