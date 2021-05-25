const express = require('express');
const router = express.Router();
var listModel = [];
var id = 1;

router.get('/getList', (req, res) => {
    res.json(listModel)
})


router.post('/addList', (req, res) => {
    console.log(req.body)
    let newList = {
        _id: id,
        title: req.body.title,
        content: req.body.content,
        status: false
    };

    listModel.push(newList);
    id++
    res.json({
        "status": 0,
        "msg": "success",
        "data": newList
    })
});

router.post('/updateList', (req, res) => {
    console.log(req.body)
    var id = req.body.id;
    var index = listModel.findIndex(item => item._id == id)
    listModel[index].title = req.body.title;
    listModel[index].content = req.body.content;
    res.json({
        "status": 0,
        "msg": "success"
    });
});

router.post('/removeList', (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let index = listModel.findIndex(item => item._id == id);
    listModel.splice(index, 1)
    res.json({
        "status": 0,
        "msg": "success"
    });
});

router.post('/changeStatus', (req, res) => {
    console.log(req.body)
    let id = req.body.id;
    let index = listModel.findIndex(item => item._id == id);

    if (listModel[index].status) {
        listModel[index].status = false
    } else {
        listModel[index].status = true
    }
    res.json({
        "status": 0,
        "msg": "success"
    });
});

module.exports = router;