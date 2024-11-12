const { Schema, model } = require('mongoose');

const Mineral_mineSchema = new Schema(
{
    mine_id: 
    {
        type:String,
        required: true
    },

    mineral_id:
    {
        type:String,
        required: [true, 'Description is required']
    },
},

{
    timestamps: true
});

module.exports = model('Mineral_mine', Mineral_mineSchema);