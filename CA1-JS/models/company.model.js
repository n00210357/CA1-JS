const { Schema, model } = require('mongoose');

const companySchema = new Schema(
{
    name: 
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

    image_path:
    {
        type:String
    },

    ceo_email:
    {
        type:String,
        required: [true, 'ceo_email is required']
    },
},

{
    timestamps: true
});

module.exports = model('Company', companySchema);