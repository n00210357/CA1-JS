const express = require('express');
const router = express.Router();
const imageUpload = require('../conifg/image_upload.js')

const 
{
    readAll, 
    readOne,
    createData,
    updateData,
    deleteData
} = require('../controllers/company.controller.js');

const { loginRequired } = require('../controllers/worker.controller.js');

router.get('/', readAll);
router.get('/:id', readOne);

router.post('/', imageUpload.any('image'), loginRequired, createData);
router.put('/:id', imageUpload.any('image'), loginRequired, updateData);
router.delete('/:id', loginRequired, deleteData);

module.exports = router;