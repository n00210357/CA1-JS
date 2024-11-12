const { Schema, model } = require('mongoose');

const Work_hourSchema = new Schema(
{
    start: 
    {
        type:String,
        required: true
    },

    end: 
    {
        type:String,
        required: true
    },

    mine_id: 
    {
        type:String,
        required: true
    },

    worker_email:
    {
        type:String,
        required: [true, 'Description is required']
    },
},

{
    timestamps: true
});

module.exports = model('Work_hour', Work_hourSchema);