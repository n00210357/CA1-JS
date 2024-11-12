const express = require('express');
const router = express.Router();
const imageUpload = require('../conifg/image_upload.js')

const 
{
    readAll, 
    registor,
    login,
    loginRequired,
    readOne,
    updateData,
    deleteData
} = require('../controllers/worker.controller')

router.get('/', readAll);
router.post('/register', imageUpload.any('image'), registor);
router.post('/login', login);

router.get('/:id', loginRequired, readOne);

router.put('/:id', imageUpload.any('image'), loginRequired, updateData);

router.delete('/:id', loginRequired, deleteData);

module.exports = router;