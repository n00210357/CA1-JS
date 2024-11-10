const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const validateEmail = (email) =>
{
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

const workerSchema = new Schema(
{
    full_name: 
    {
        type:String,
        trim: true,
        required: true
    },

    description:
    {
        type:String,
        required: [true, 'Description is required']
    },

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

    password:
    {
        type:String,
        required: true
    },

    phone:
    {
        type:String,
    },

    image_path:
    {
        type:String
    }
},

{
    timestamps: true
});

workerSchema.methods.comparePassword = function(password)
{
    console.log(bcrypt.compareSync(password, this.password));
};

module.exports = model('Worker', workerSchema);