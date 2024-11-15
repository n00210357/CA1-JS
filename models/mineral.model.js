//enables mongoose modules
const { Schema, model } = require('mongoose');

const mineralSchema = new Schema(
{
    //the minerals name
    name: 
    {
        type:String,
        trim: true,
        required: true
    },
    //holds any nessary info about the mineral not include any were else in the database
    description:
    {
        type:String,
        required: [true, 'Description is required']
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

//exports the model
module.exports = model('Mineral', mineralSchema);