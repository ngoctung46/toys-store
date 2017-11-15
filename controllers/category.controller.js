const express = require('express');
const router = express.Router();
const category = require('../models/category');
const multer = require('multer');
const DIR = './public/uploads/category';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null,
            file.fieldname + '-' +
            datetimestamp + '.' +
            file.originalname.split('.')
            [file.originalname.split('.').length - 1]);
    }
})
const upload = multer({ storage: storage }).single('photo');
router.get('/', (req, res) => {
    category.getAll((err, items) => {
        if (err) {
            res.json({ success: false, message: `Failed to load categories. Error: ${err}` });
        } else {
            res.write(JSON.stringify({ success: true, items: items }, null, 2));
            res.end();
        }
    })
});

router.post('/', (req, res) => {
    let newCategory = new category({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        subCategories: req.body.subCategories
    });
    category.add(newCategory, (err, list) => {
        if (err) {
            res.json({ success: false, message: `Failed to create a new category. Error: ${err}` });
        } else {
            res.json({ success: true, message: `Added successfully.` });
        }
    });
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let updateCategory = {
        _id: id,
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        subCategories: req.body.subCategories
    };
    category.updateById(id, updateCategory, (err, list) => {
        if (err) {
            res.json({ success: false, message: `Failed to update a category. Error: ${err}` });
        } else {
            res.json({ success: true, message: `Updated successfully.` });
        }
    });
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    category.deleteById(id, (err, list) => {
        if (err) {
            res.json({ success: false, message: `Failed to delete category. Error: ${err}` });
        } else if (list) {
            res.json({ success: true, message: `Deleted successfully` });
        } else {
            res.json({ success: false });
        }
    });
});

router.post('/upload', function (req, res, next) {
    var path = '';
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured");
        }
        path = req.file.filename;
        res.write(path);
        res.end();
    })
});
module.exports = router;