//enables mongoose and bcryptjs modules
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const validateEmail = (email) =>
{
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

const workerSchema = new Schema(
{
    //the workers full name
    full_name: 
    {
        type:String,
        trim: true,
        required: true
    },
    //holds any nessary info about the worker not include any were else in the database
    description:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the workers email
    email:
    {
        type:String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate: [validateEmail, 'Please use a valid email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email']
    },
    //the workers account password
    password:
    {
        type:String,
        required: true
    },
    //the workers phone number
    phone:
    {
        type:String,
    },
    //stores the http path to a image file
    image_path:
    {
        type:String
    }
},

{
    timestamps: true
});

//encodes the password
workerSchema.methods.comparePassword = function(password)
{
    console.log(bcrypt.compareSync(password, this.password));
};

//exports the model
module.exports = model('Worker', workerSchema);