const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Worker = require('../models/worker.model');

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
    Worker.find()
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
    Worker.find().then(data =>
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

    Worker.findById(id)
        .then((data) => {

            if(data){
                data.image_path = process.env.IMAGE_URL + data.image_path;
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Worker with id: ${id} not found`
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

const updateData = (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if (req.file)
    {
        body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    Worker.findByIdAndUpdate(id, body, {
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
                    "message": `Worker with id: ${id} not found`
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

    Worker.findById(id)
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
                "message": `Worker with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        deleteImage(filename);

        res.status(200).json({
            "message": `Worker with id: ${id} deleted successfully`
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

const registor = (req, res) => 
{
    let newWorker = new Worker(req.body);
    console.log(req.body)

    if (req.file)
    {
        newWorker.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    newWorker.password = bcrypt.hashSync(req.body.password, 10);
    newWorker.save().then(data =>
    {
        data.password = undefined;
        return res.status(201).json(data);
    })
    .catch(err =>
    {
        return res.status(400).json(
        {
            message: err
        })
    }
    );
};

const login = (req, res) => 
    {
        Worker.findOne({email: req.body.email})
        .then(worker => 
        {
            if (worker && worker.comparePassword(req.body.password) == true)
            {
                return res.status(200).json(
                {
                    token: jwt.sign(
                    {
                       email: worker.email,
                       full_name: worker.full_name,
                       _id: worker._id
                    }, process.env.JWT_SECRET, )
                })
            }

            if (!worker || worker.comparePassword(req.body.password) == false)
            {
                return res.status(401).json(
                {
                    message: 'Authentication failed'
                })
            }

            return res.status(200).json(
            {
                token: jwt.sign(
                {
                    email: worker.email,
                    full_name: worker.full_name,
                    _id: worker._id
                }, process.env.JWT_SECRET, )
            })
        })
        .catch(err =>
        {
            return res.status(500).json(err)
        });
    };

const loginRequired = (req, res, next) => 
{    
    console.log(req.worker)
    if (req.worker)
    {
        next();
    }
    else
    {
        return res.status(401).json(
        {
            message: "Unathorised worker"
        })
    }
};

module.exports = 
{
    readAll,
    registor,
    login,
    loginRequired,
    readOne,
    updateData,
    deleteData
};