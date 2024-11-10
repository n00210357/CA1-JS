const express = require('express');
const router = express.Router();

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
router.post('/register', registor);
router.post('/login', login);

router.get('/:id', loginRequired, readOne);

router.put('/:id', loginRequired, updateData);

router.delete('/:id', loginRequired, deleteData);

module.exports = router;