const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Mineral = require('../models/mineral.model');

const deleteImage = async (filename) =>
{
    if (process.env.STORAGE_ENGINE === 'S3')
    {
        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

        const s3 = new S3Client(
        {
            region: process.env.MY_AWS_REGION,
            credentials:
            {
                accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
            }
        });

        try
        {
            const data = await s3.send(new DeleteObjectCommand(
            {
                Bucket: process.env.MY_AWS_BUCKET,
                Key: filename
            }));

            console.log("Object deleted ", data);
        }
        catch(err)
        {
            console.error(err);
        }
    }
    else
    {
        let path = `public/uploads/${filename}`;
    fs.access(path, fs.constants.F_OK, (err) =>
    {
        if (err)
        {
            console.error(err);
            return;
        }

        fs.unlink(path, err =>
        {
            if (err)
            {
                console.error(err);
                return;
            }

            console.log(`${filename} was deleted`);
        })
    })
}
}

const readData = (req, res) => {
    Mineral.find()
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
    Mineral.find().then(data =>
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

    Mineral.findById(id)
        .then((data) => {

            if(data){
                data.image_path = process.env.IMAGE_URL + data.image_path;
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Mineral with id: ${id} not found`
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
    
    Mineral.create(body).then(data =>
    {    
        return res.status(201).json
        ({
            message: "Mineral created",
            data
        });
    }
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

    if (req.file)
    {
        body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    Mineral.findByIdAndUpdate(id, body, {
        new: true
    })
        .then((data) => {

            if(data){
                if (req.file)
                {
                    deleteImage(data.filename)
                }

                res.status(201).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Mineral with id: ${id} not found`
                });
            }
            
        })
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
    let filename = '';

    Mineral.findById(id)
    .then(data =>
    {
        if (data)
        {
            filename = data.image_path;
            return data.deleteOne();
        }
        else
        {
            res.status(404).json({
                "message": `Mineral with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        deleteImage(filename);

        res.status(200).json({
            "message": `Mineral with id: ${id} deleted successfully`
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