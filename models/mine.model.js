const { Schema, model } = require('mongoose');

const mineSchema = new Schema(
{
    name: 
    {
        type:String,
        trim: true,
        required: true
    },

    latitude:
    {
        type:String,
        required: [true, 'Description is required']
    },

    longitude:
    {
        type:String,
        required: [true, 'Description is required']
    },

    image_path:
    {
        type:String
    },

    manager_email:
    {
        type:String,
        required: [true, 'ceo_email is required']
    },

    company_name:
    {
        type:String,
        required: [true, 'company name is required']
    },
},

{
    timestamps: true
});

module.exports = model('Mine', mineSchema);