const { Schema, model } = require('mongoose');

const mineralSchema = new Schema(
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
    }
},

{
    timestamps: true
});

module.exports = model('Mineral', mineralSchema);